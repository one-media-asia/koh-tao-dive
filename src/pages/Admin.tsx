import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Trash2, RefreshCw, Users, CheckCircle, Clock, XCircle, LogOut, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { hasAdminAccess } from '@/lib/adminAccess';
import { PageManager } from '@/components/PageManager';
import PricingManager from '@/components/PricingManager';


interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  item_type: string | null;
  course_title: string;
  preferred_date: string | null;
  experience_level: string | null;
  addons: string | null;
  addons_json: string | null;
  addons_total: number;
  subtotal_amount: number | null;
  total_payable_now: number | null;
  internal_notes: string | null;
  message: string | null;
  status: string;
}


const Admin = () => {
  // --- STATE & HOOKS ---
  const [bookings, setBookings] = useState<BookingInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionBooking, setActionBooking] = useState<BookingInquiry | null>(null);
  const [notesBooking, setNotesBooking] = useState<BookingInquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<BookingInquiry | null>(null);
  const [invoiceAmountDraft, setInvoiceAmountDraft] = useState('');
  const [invoicePayPalLink, setInvoicePayPalLink] = useState('');
  const [isPayPalLinkCopied, setIsPayPalLinkCopied] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  // --- UTILS ---
  const fetchAdminApi = useCallback((url: string, options?: RequestInit) => {
    return fetch(url, options);
  }, []);
  const redirectToLogin = useCallback(() => navigate('/admin/login'), [navigate]);
  const PAYPAL_ME_LINK = 'https://paypal.me/prodivingasia';
  const statusConfig = {
    pending: { label: 'Pending', color: 'yellow' },
    confirmed: { label: 'Confirmed', color: 'green' },
    completed: { label: 'Completed', color: 'blue' },
    cancelled: { label: 'Cancelled', color: 'red' },
  };

  // --- AUTH & INITIAL DATA ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const [{ data: userData }, { data: sessionData }] = await Promise.all([
          supabase.auth.getUser(),
          supabase.auth.getSession(),
        ]);
        const user = userData.user || sessionData.session?.user || null;
        let token = sessionData.session?.access_token || null;
        if (!user) { redirectToLogin(); return; }
        if (!hasAdminAccess(user)) { redirectToLogin(); return; }
        if (!token) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          token = refreshed.session?.access_token || null;
        }
        if (!token) {
          toast.error('Unable to establish session token. Please log in again.');
          redirectToLogin();
          return;
        }
        setAuthToken(token);
        const response = await fetchAdminApi('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401 || response.status === 403) {
          toast.error('Bookings API is not authorized right now. You can still use Edit Pages.');
          setIsLoading(false);
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Admin auth init failed:', error);
        toast.error('Unable to load bookings right now. You can still use Edit Pages.');
        setBookings([]);
        setIsLoading(false);
      }
    };
    initAuth();
  }, [fetchAdminApi, redirectToLogin]);
  useEffect(() => {
    if (window.location.hash === '#pages') {
      setActiveTab('edit-pages');
    }
  }, []);

  // --- HANDLERS & HELPERS ---
  const fetchBookings = async (tokenArg?: string) => {
    const token = tokenArg || authToken;
    if (!token) return;
    try {
      const response = await fetchAdminApi('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401 || response.status === 403) {
        toast.error('Bookings API is not authorized right now. You can still use Edit Pages.');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!authToken) return;
    try {
      const response = await fetchAdminApi(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.status === 401 || response.status === 403) { redirectToLogin(); return; }
      if (!response.ok) throw new Error('Failed to update status');
      await fetchBookings();
      toast.success(`Status updated to ${statusConfig[newStatus as keyof typeof statusConfig]?.label || newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };
  const handleDeleteBooking = async () => {
    if (!deleteId || !authToken) return;
    try {
      const response = await fetchAdminApi(`/api/bookings/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 401 || response.status === 403) { redirectToLogin(); return; }
      if (!response.ok) throw new Error('Failed to delete booking');
      await fetchBookings();
      setDeleteId(null);
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };
  const handleSendInvoice = async (booking: BookingInquiry) => {
    setIsSendingInvoice(true);
    try {
      const amount = booking.message || booking.course_title || '';
      const payload: Record<string, unknown> = {
        access_key: 'e4c4edf6-6e35-456a-87da-b32b961b449a',
        to: 'payments@divinginasia.com',
        subject: `Invoice: ${booking.course_title} - ${booking.name}`,
        name: booking.name,
        message: `New Invoice Notification\n\nCustomer: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone || 'N/A'}\n\nCourse: ${booking.course_title}\nPreferred Date: ${booking.preferred_date || 'N/A'}\nAmount: ${booking.message || 'TBD'}\n\nCustomer Message:\n${booking.message || 'No additional message'}`,
        cc: booking.email,
      };
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        toast.success('Invoice sent to admin');
      } else {
        console.error('Web3Forms invoice error', res.status, json);
        toast.error('Failed to send invoice to admin');
      }
    } catch (err) {
      console.error('Send invoice error', err);
      toast.error('Failed to send invoice');
    } finally {
      setIsSendingInvoice(false);
    }
  };
  const openNotesDialog = (booking: BookingInquiry) => {
    setNotesBooking(booking);
    setNotesDraft(booking.internal_notes || '');
  };
  const getAddonsList = (booking: BookingInquiry) => {
    if (!booking.addons_json) return [] as Array<{ label?: string; amount?: number }>;
    try {
      const parsed = JSON.parse(booking.addons_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const getAddonsDisplay = (booking: BookingInquiry) => {
    if (booking.addons && booking.addons.trim()) return booking.addons;
    const list = getAddonsList(booking).map((addon) => addon.label).filter(Boolean);
    return list.length ? list.join(', ') : '-';
  };
  const getInvoiceNumbers = (booking: BookingInquiry) => {
    const subtotal = typeof booking.subtotal_amount === 'number' ? booking.subtotal_amount : null;
    const addonsTotal = typeof booking.addons_total === 'number' ? booking.addons_total : 0;
    const dueNow = typeof booking.total_payable_now === 'number' ? booking.total_payable_now : 0;
    const grandTotal = subtotal !== null ? subtotal + addonsTotal : null;
    const balanceDue = grandTotal !== null ? Math.max(grandTotal - dueNow, 0) : null;
    return { subtotal, addonsTotal, dueNow, grandTotal, balanceDue };
  };
  const buildPayPalLink = (booking: BookingInquiry, amount: number) => {
    const safeAmount = Math.max(0, amount);
    const amountLabel = Number.isInteger(safeAmount)
      ? String(safeAmount)
      : safeAmount.toFixed(2).replace(/\.00$/, '');
    return `${PAYPAL_ME_LINK}/${amountLabel}THB`;
  };
  const openInvoiceDialog = (booking: BookingInquiry) => {
    const { dueNow, grandTotal } = getInvoiceNumbers(booking);
    const defaultAmount = dueNow > 0 ? dueNow : grandTotal || 0;
    setInvoiceAmountDraft(defaultAmount > 0 ? String(defaultAmount) : '');
    setInvoicePayPalLink(defaultAmount > 0 ? buildPayPalLink(booking, defaultAmount) : '');
    setIsPayPalLinkCopied(false);
    setInvoiceBooking(booking);
  };
  const handleGeneratePayPalLink = () => {
    if (!invoiceBooking) return;
    const amount = Number(invoiceAmountDraft);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount to generate PayPal link');
      return;
    }
    const link = buildPayPalLink(invoiceBooking, amount);
    setInvoicePayPalLink(link);
    setIsPayPalLinkCopied(false);
    toast.success('PayPal link generated');
  };
  const handleCopyPayPalLink = async () => {
    if (!invoicePayPalLink) return;
    try {
      await navigator.clipboard.writeText(invoicePayPalLink);
      setIsPayPalLinkCopied(true);
      setTimeout(() => setIsPayPalLinkCopied(false), 1800);
      toast.success('PayPal link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };
  const buildInvoiceHtml = (booking: BookingInquiry, payPalLink?: string) => {
    const addons = getAddonsList(booking);
    const { subtotal, addonsTotal, dueNow, grandTotal, balanceDue } = getInvoiceNumbers(booking);
    const invoiceNo = `INV-${booking.id.slice(0, 8).toUpperCase()}`;
    const issueDate = format(new Date(), 'yyyy-MM-dd');
    const itemName = booking.course_title || 'Booking';
    const addonRows = addons.length
      ? addons.map((addon) => {
          const label = addon.label || 'Add-on';
          const amount = typeof addon.amount === 'number' ? addon.amount : 0;
          return `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${label}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">฿${amount}</td></tr>`;
        }).join('')
      : '<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;">No add-ons</td><td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">฿0</td></tr>';
    return `\n      <html>\n        <head>\n          <title>${invoiceNo}</title>\n          <meta charset=\"utf-8\" />\n        </head>\n        <body style=\"font-family:Arial,sans-serif;color:#111827;padding:24px;max-width:800px;margin:0 auto;\">\n          <div style=\"display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;\">\n            <div>\n              <img src=\"/images/logo.avif\" alt=\"Pro Diving Asia\" style=\"height:56px;width:auto;display:block;margin-bottom:10px;\" />\n              <h1 style=\"margin:0;font-size:26px;\">Pro Diving Asia</h1>\n              <div style=\"color:#6b7280;margin-top:4px;\">Koh Tao, Thailand</div>\n            </div>\n            <div style=\"text-align:right;\">\n              <div style=\"font-size:22px;font-weight:700;\">Invoice</div>\n              <div style=\"color:#6b7280;\">${invoiceNo}</div>\n              <div style=\"color:#6b7280;\">Date: ${issueDate}</div>\n            </div>\n          </div>\n\n          <div style=\"margin-bottom:20px;\">\n            <div style=\"font-weight:600;\">Bill To</div>\n            <div>${booking.name}</div>\n            <div>${booking.email}</div>\n            <div>${booking.phone || '-'}...</string>

export default Admin;