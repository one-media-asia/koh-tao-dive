import React, { useState, useEffect } from 'react';
import './BookingForm.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  preferred_date: z.string().optional(),
  experience_level: z.string().optional(),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
  paymentChoice: z.enum(['now', 'link', 'none']).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  itemType: 'course' | 'dive';
  itemTitle: string;
  depositMajor?: number;
  depositCurrency?: string;
  paymentMethod?: 'stripe' | 'paypal';
  standalone?: boolean; // If true, render as a styled standalone form (not modal)
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen = false, onClose, itemType, itemTitle, depositMajor, depositCurrency, paymentMethod, standalone = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState<'THB' | 'USD' | 'EUR'>(depositCurrency === 'USD' || depositCurrency === 'EUR' ? depositCurrency : 'THB');
  const navigate = useNavigate();
  const apiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$|^\/+/, '');
  const apiUrl = (path: string) => (apiBase ? `${apiBase}${path}` : path);

  // Simple conversion rates (replace with real rates if needed)
  const rates = { THB: 1, USD: 0.027, EUR: 0.025 };
  const formatCurrency = (amount: number, currency: 'THB' | 'USD' | 'EUR') => {
    if (!amount) return '';
    return currency === 'THB'
      ? `${amount} THB`
      : currency === 'USD'
      ? `$${(amount * rates.USD).toFixed(2)} USD`
      : `€${(amount * rates.EUR).toFixed(2)} EUR`;
  };

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferred_date: '',
      experience_level: '',
      message: '',
      paymentChoice: 'now',
    },
  });

  // Reset form whenever dialog opens with a new course/item selection
  useEffect(() => {
    // Reset form when dialog opens or when item changes
    if ((isOpen && !standalone) || standalone) {
      form.reset({
        name: '',
        email: '',
        phone: '',
        preferred_date: '',
        experience_level: '',
        message: '',
        paymentChoice: 'now',
      });
    }
  }, [isOpen, itemTitle, form, standalone]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const paymentChoice = (data as any).paymentChoice || 'none';
      const messageBody = `Phone: ${data.phone || 'N/A'}\nPreferred Date: ${data.preferred_date || 'N/A'}\nExperience Level: ${data.experience_level || 'N/A'}\nPayment Option: ${paymentChoice}\n\nMessage:\n${data.message || 'N/A'}`;

      // Send to backend notification API
      const payload = {
        item_title: itemTitle,
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        preferred_date: data.preferred_date || 'N/A',
        experience_level: data.experience_level || 'N/A',
        payment_choice: paymentChoice,
        deposit_amount: typeof depositMajor === 'number' ? `฿${depositMajor}` : 'N/A',
        message: messageBody,
      };
      const response = await fetch(apiUrl('/send-booking-notification'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json().catch(() => ({}));

      // Calculate amounts
      const deposit_amount = typeof depositMajor === 'number' ? depositMajor : 0;
      // Example: total_amount is deposit * 3, due_amount is total - deposit
      const total_amount = deposit_amount * 3;
      const due_amount = total_amount - deposit_amount;

      // Insert booking into Supabase
      const { error: supaError } = await supabase.from('bookings').insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferred_date: data.preferred_date,
          experience_level: data.experience_level,
          message: data.message,
          payment_choice: paymentChoice,
          item_type: itemType,
          course_title: itemTitle,
          created_at: new Date().toISOString(),
          status: 'pending',
          deposit_amount,
          total_amount,
          due_amount,
        }
      ]);
      if (supaError) {
        console.error('Supabase insert error:', supaError);
        toast.error('Booking saved to email, but not to admin database.');
      }

            // After successful payment, redirect to thank you page
      if (response.ok && responseData.success) {
        if (responseData.warning) {
          toast.warning(`Booking saved, but email notification needs attention: ${responseData.warning}`);
        }
        toast.success('Booking inquiry sent. We will contact you shortly.');
        form.reset();
        onClose();
      } else {
        const errMsg = responseData?.message || responseData?.error || `HTTP ${response.status}`;
        console.error('Booking notification error:', errMsg, responseData);
        toast.error(`Failed to send booking: ${errMsg}. Please try again.`);
      }
      // Example: After successful payment, redirect to thank you page
      const handlePaymentSuccess = () => {
        navigate('/thankyou');
      };

      // Pass handlePaymentSuccess to your payment logic (Stripe/PayPal integration)
    } catch (error) {
      console.error('Booking submission failed:', error);
      toast.error(`Failed to send booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (standalone) {
    return (
      <div className="booking-form-container">
        <div className="booking-form-title">Booking / Inquiry Form</div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="booking-form-field">
            <label className="booking-form-label">Full Name *</label>
            <input className="booking-form-input" placeholder="John Doe" {...form.register('name')} />
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Email *</label>
            <input className="booking-form-input" type="email" placeholder="john@example.com" {...form.register('email')} />
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Phone</label>
            <input className="booking-form-input" placeholder="+66 123 456 789" {...form.register('phone')} />
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Course / Package</label>
            <input
              className="booking-form-input"
              value={depositMajor ? `${itemTitle} (${formatCurrency(depositMajor, currency)})` : itemTitle}
              disabled
            />
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Change Currency</label>
            <select
              className="booking-form-select"
              value={currency}
              onChange={e => setCurrency(e.target.value as 'THB' | 'USD' | 'EUR')}
            >
              <option value="THB">THB (Thai Baht)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Preferred Date</label>
            <input className="booking-form-input" type="date" {...form.register('preferred_date')} />
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Experience Level</label>
            <select className="booking-form-select" {...form.register('experience_level')}>
              <option value="">Select...</option>
              <option value="none">No diving experience</option>
              <option value="beginner">Beginner (1-10 dives)</option>
              <option value="intermediate">Intermediate (10-50 dives)</option>
              <option value="advanced">Advanced (50+ dives)</option>
              <option value="professional">Professional diver</option>
            </select>
          </div>
          <div className="booking-form-field">
            <label className="booking-form-label">Payment Option</label>
            <div className="booking-form-radio-group">
              <label className="booking-form-radio-label">
                <input type="radio" value="stripe" {...form.register('paymentMethod')} defaultChecked /> Pay with Card (Stripe)
              </label>
              <label className="booking-form-radio-label">
                <input type="radio" value="paypal" {...form.register('paymentMethod')} /> Pay with PayPal
              </label>
              <label className="booking-form-radio-label">
                <input type="radio" value="none" {...form.register('paymentMethod')} /> Just an inquiry
              </label>
            </div>
          </div>
          {/* Payment UI section */}
          {form.watch('paymentMethod') === 'stripe' && (
            <div className="payment-section">
              <Elements stripe={stripePromise} options={{ clientSecret: STRIPE_CLIENT_SECRET }}>
                <StripePaymentForm onSuccess={() => navigate('/thankyou')} />
              </Elements>
            </div>
          )}
          {form.watch('paymentMethod') === 'paypal' && (
            <div className="payment-section">
              <a
                className="booking-form-btn paypal-btn"
                href="https://www.paypal.com/paypalme/prodivingasia/2400"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                onClick={() => setTimeout(() => navigate('/thankyou'), 1200)}
              >
                Pay 2400 THB with PayPal
              </a>
            </div>
          )}
          <div className="booking-form-field">
            <label className="booking-form-label">Comments / Questions</label>
            <textarea className="booking-form-textarea" rows={3} placeholder="Any special requests or questions?" {...form.register('message')} />
          </div>
          <div className="booking-form-actions">
            <button type="submit" className="booking-form-btn" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Send Booking'}</button>
          </div>
        </form>
      </div>
    );
  }
  // Default: modal/dialog version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="booking-form-container">
          <div className="booking-form-title">Booking / Inquiry Form</div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="booking-form-field">
              <label className="booking-form-label">Full Name *</label>
              <input className="booking-form-input" placeholder="John Doe" {...form.register('name')} />
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Email *</label>
              <input className="booking-form-input" type="email" placeholder="john@example.com" {...form.register('email')} />
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Phone</label>
              <input className="booking-form-input" placeholder="+66 123 456 789" {...form.register('phone')} />
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Course / Package</label>
              <input className="booking-form-input" value={itemTitle} disabled />
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Preferred Date</label>
              <input className="booking-form-input" type="date" {...form.register('preferred_date')} />
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Experience Level</label>
              <select className="booking-form-select" {...form.register('experience_level')}>
                <option value="">Select...</option>
                <option value="none">No diving experience</option>
                <option value="beginner">Beginner (1-10 dives)</option>
                <option value="intermediate">Intermediate (10-50 dives)</option>
                <option value="advanced">Advanced (50+ dives)</option>
                <option value="professional">Professional diver</option>
              </select>
            </div>
            <div className="booking-form-field">
              <label className="booking-form-label">Payment Option</label>
              <div className="booking-form-radio-group">
                <label className="booking-form-radio-label">
                  <input type="radio" value="stripe" {...form.register('paymentMethod')} defaultChecked /> Pay with Card (Stripe)
                </label>
                <label className="booking-form-radio-label">
                  <input type="radio" value="paypal" {...form.register('paymentMethod')} /> Pay with PayPal
                </label>
                <label className="booking-form-radio-label">
                  <input type="radio" value="none" {...form.register('paymentMethod')} /> Just an inquiry
                </label>
              </div>
            </div>
            {/* Payment UI section */}
            {form.watch('paymentMethod') === 'stripe' && (
              <div className="payment-section">
                <Elements stripe={stripePromise} options={{ clientSecret: STRIPE_CLIENT_SECRET }}>
                  <StripePaymentForm onSuccess={() => navigate('/thankyou')} />
                </Elements>
              </div>
            )}
            {form.watch('paymentMethod') === 'paypal' && (
              <div className="payment-section">
                <button className="booking-form-btn paypal-btn" onClick={() => setTimeout(() => navigate('/thankyou'), 1200)}>
                  Pay with PayPal (Simulated)
                </button>
              </div>
            )}
            <div className="booking-form-field">
              <label className="booking-form-label">Comments / Questions</label>
              <textarea className="booking-form-textarea" rows={3} placeholder="Any special requests or questions?" {...form.register('message')} />
            </div>
            <div className="booking-form-actions">
              <button type="button" className="booking-form-btn outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="booking-form-btn" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Send Booking'}</button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
