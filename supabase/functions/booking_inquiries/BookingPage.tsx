// Rezdy integration removed — use internal booking flow
import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().max(20).optional(),
  preferred_date: z.string().trim().min(1, 'Preferred date is required'),
  experience_level: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
  paymentChoice: z.enum(['now', 'link', 'none']).optional(),
});


type BookingFormData = z.infer<typeof bookingSchema>;

const PAYPAL_LINK = 'https://paypal.me/prodivingasia';
const COURSE_DEPOSIT_RATE = 0.2;
const SKIP_PAYMENT_MESSAGE = 'You have chosen not to pay right now, no problem! We will contact you soon to arrange bookings and payment. Thank You, Pro Diving Asia Team.';

const COURSE_FALLBACKS: Record<string, { item: string; price?: number; currency?: string }> = {
  'wreck-diver': { item: 'PADI Wreck Diver Specialty', price: 8000, currency: 'THB' },
  'deep-diver': { item: 'PADI Deep Diver Specialty', price: 8000, currency: 'THB' },
  'self-reliant': { item: 'PADI Self-Reliant Diver Specialty', price: 8000, currency: 'THB' },
  'sidemount': { item: 'PADI Sidemount Diver Specialty', price: 8000, currency: 'THB' },
  'night-diver': { item: 'PADI Night Diver Specialty', price: 8000, currency: 'THB' },
  'peak-buoyancy': { item: 'PADI Peak Performance Buoyancy', price: 8000, currency: 'THB' },
  'navigator': { item: 'PADI Underwater Navigator Specialty', price: 3000, currency: 'THB' },
  'enriched-air': { item: 'PADI Enriched Air Diver Specialty', price: 8000, currency: 'THB' },
  'emergency-o2': { item: 'Emergency Oxygen Provider', price: 8000, currency: 'THB' },
  'dpv': { item: 'PADI DPV Diver Specialty', price: 4200, currency: 'THB' },
  'search-recovery': { item: 'PADI Search & Recovery Specialty', price: 8000, currency: 'THB' },
  'coral-watch': { item: 'Coral Watch Specialty', price: 2300, currency: 'THB' },
  'sea-turtle': { item: 'Sea Turtle Awareness Specialty', price: 2200, currency: 'THB' },
  'fish-id': { item: 'Fish Identification Specialty', price: 8000, currency: 'THB' },
  'dive-against-debris': { item: 'Dive Against Debris Specialty', price: 8000, currency: 'THB' },
  'shark-conservation': { item: 'Shark Conservation Specialty', price: 2500, currency: 'THB' },
  'whaleshark': { item: 'Whale Shark Awareness Specialty', price: 3500, currency: 'THB' },
  'underwater-naturalist': { item: 'PADI Underwater Naturalist Specialty', price: 3500, currency: 'THB' },
  'adaptive-support': { item: 'Adaptive Support Diver Specialty', price: 4000, currency: 'THB' },
  'current-diver': { item: 'PADI Current Diver Specialty', currency: 'THB' },
  'photography': { item: 'PADI Underwater Photography Specialty', price: 8000, currency: 'THB' },
  'equipment-specialist': { item: 'PADI Equipment Specialist', currency: 'THB' },
  'boat-diver': { item: 'PADI Boat Diver Specialty', currency: 'THB' },
  'divemaster-internship': { item: 'PADI Divemaster Internship', currency: 'THB' },
  'instructor-internship': { item: 'PADI Instructor Internship', currency: 'THB' },
};

const ADDONS = [
  { id: 'equipment', label: 'Equipment rental', amount: 300 },
  { id: 'photos', label: 'Underwater photos', amount: 500 },
  { id: 'lunch', label: 'Lunch & drinks', amount: 200 },
];

type BookingItemType = 'course' | 'dive' | 'stay';

const       BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiBaseRaw = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const apiBaseNormalized = apiBaseRaw
    ? (apiBaseRaw.startsWith('http://') || apiBaseRaw.startsWith('https://')
        ? apiBaseRaw
        : `https://${apiBaseRaw}`)
    : 'https://koh-tao-dive-dreams.vercel.app';
  const apiBase = apiBaseNormalized.replace(/\/+$/, '');
  const apiUrl = (path: string) => `${apiBase}${path}`;
  const courseSlug = (searchParams.get('course') || '').trim();
  const fallbackCourse = courseSlug ? COURSE_FALLBACKS[courseSlug] : undefined;
  const hasDirectBookingContext = Boolean(
    searchParams.get('item') ||
    searchParams.get('type') ||
    searchParams.get('price') ||
    fallbackCourse
  );
  const selectedBookingKind = (searchParams.get('bookingKind') || '').trim();
  const bookingSource = (searchParams.get('source') || 'direct').trim();
  const rawType = (searchParams.get('type') || '').trim();
  const genericType: BookingItemType = selectedBookingKind === 'course' ? 'course' : 'dive';
  const itemType: BookingItemType = rawType === 'dive' || rawType === 'stay' || rawType === 'course'
    ? rawType
    : (hasDirectBookingContext ? 'course' : genericType);
  const itemTitle = searchParams.get('item') || fallbackCourse?.item || (itemType === 'course' ? 'Course Booking' : 'Fun Dive');
  const isDiveBooking = itemType === 'dive';
  const isCourseBooking = itemType === 'course';
  const isStayBooking = itemType === 'stay';
  const rawPrice = searchParams.get('price');
  const parsedPrice = rawPrice ? Number(rawPrice) : NaN;
  const baseCourseCostMajor = Number.isFinite(parsedPrice)
    ? parsedPrice
    : (fallbackCourse?.price || (!hasDirectBookingContext && itemType === 'dive' ? 2000 : 0));
  const parsedDeposit = Number(searchParams.get('deposit') || '0');
  const depositFromQuery = Number.isFinite(parsedDeposit) ? parsedDeposit : 0;
  const depositCurrency = searchParams.get('currency') || fallbackCourse?.currency || 'THB';
  const isFunDiveBooking = isDiveBooking && /fun dive/i.test(itemTitle);
  const isDiscoverScubaBooking = isDiveBooking && /(discover scuba|dsd)/i.test(itemTitle);

  const initialDiveCount = Math.min(20, Math.max(1, Number(searchParams.get('dives') || '2') || 2));
  const [funDiveCount, setFunDiveCount] = useState<number>(initialDiveCount);
  const initialCourseFunDiveCount = Math.min(10, Math.max(0, Number(searchParams.get('courseFunDives') || '0') || 0));
  const [courseFunDiveCount, setCourseFunDiveCount] = useState<number>(initialCourseFunDiveCount);
  const [stayWithUs, setStayWithUs] = useState<boolean>(searchParams.get('stay') === 'yes');
  const [showStayPopup, setShowStayPopup] = useState(false);

  const getFunDiveRate = (dives: number) => {
    if (dives >= 10) return 800;
    if (dives >= 2) return 900;
    return 1000;
  };

  const courseCostMajor = isFunDiveBooking
    ? getFunDiveRate(funDiveCount) * funDiveCount
    : baseCourseCostMajor;
  const courseFunDiveCostMajor = isCourseBooking && courseFunDiveCount > 0
    ? getFunDiveRate(courseFunDiveCount) * courseFunDiveCount
    : 0;
  const totalItemCostMajor = isCourseBooking ? courseCostMajor + courseFunDiveCostMajor : courseCostMajor;
  const depositFromPrice = totalItemCostMajor > 0 ? Math.round(totalItemCostMajor * COURSE_DEPOSIT_RATE) : 0;
  const depositMajor = depositFromPrice > 0 ? depositFromPrice : depositFromQuery;

  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const availableAddons = useMemo(() => {
    if (!isDiveBooking) return [];
    return ADDONS.filter((addon) => !(isDiscoverScubaBooking && addon.id === 'equipment'));
  }, [isDiveBooking, isDiscoverScubaBooking]);

  const totalAddons = useMemo(() => {
    if (!isDiveBooking) return 0;
    return availableAddons.reduce((sum, a) => sum + (selectedAddons[a.id] ? a.amount : 0), 0);
  }, [isDiveBooking, availableAddons, selectedAddons]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferred_date: new Date().toISOString().slice(0, 10),
      experience_level: '',
      message: searchParams.get('message') || '',
      paymentChoice: itemType === 'course' || itemType === 'dive' ? 'now' : 'none',
    },
  });

  const [showPaymentLinks, setShowPaymentLinks] = useState(false);
  const [showSkipPaymentPopup, setShowSkipPaymentPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: BookingFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Form validation errors:', form.formState.errors);
    setIsSubmitting(true);
    try {
      const amountMajor = (isStayBooking ? 0 : depositMajor) + totalAddons;
      // Calculate deposit, total, due for API
      const deposit_amount = isStayBooking ? null : depositMajor;
      const total_amount = isStayBooking ? null : (totalItemCostMajor + totalAddons);
      const due_amount = isStayBooking ? null : ((totalItemCostMajor + totalAddons) - depositMajor);
      const selectedAddonsList = isDiveBooking
        ? availableAddons.filter((addon) => selectedAddons[addon.id]).map((addon) => ({
            id: addon.id,
            label: addon.label,
            amount: addon.amount,
          }))
        : [];
      const bookingItemTitle = isFunDiveBooking
        ? `${itemTitle} (${funDiveCount} dives)`
        : (isCourseBooking && courseFunDiveCount > 0
          ? `${itemTitle} + ${courseFunDiveCount} Fun Dives`
          : itemTitle);
      const addonsText = isDiveBooking
        ? (availableAddons.filter(a => selectedAddons[a.id]).map(a => a.label).join(', ') || 'None')
        : 'N/A (course booking)';
      const messageWithSource = `${data.message || 'No additional message'}\n\nBooking Source: ${bookingSource}`;

      const apiBookingPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        item_type: itemType,
        course_title: bookingItemTitle,
        preferred_date: data.preferred_date || null,
        experience_level: data.experience_level || null,
        addons: addonsText,
        addons_json: JSON.stringify(selectedAddonsList),
        addons_total: totalAddons,
        subtotal_amount: totalItemCostMajor > 0 ? totalItemCostMajor : null,
        // Always send a value for total_payable_now
        total_payable_now: isStayBooking ? 'Quote on request' : (amountMajor > 0 ? amountMajor : 0),
        // New: send deposit, total, due for admin
        deposit_amount
        total_amount,
        due_amount,
        message: messageWithSource,
        status: 'pending',
      };

      let persisted = false;
      try {
        const dbRes = await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiBookingPayload),
        });
        persisted = dbRes.ok;
      } catch (dbErr) {
        console.warn('Booking persistence failed; continuing with email flow.', dbErr);
      }

      // Prepare Web3Forms payload
      const payload = {
        access_key: '4ca93aa5-cd42-4902-af87-a08e1ae7c832',
        to: 'petergreaney@proton.me',
        subject: `Booking Inquiry: ${bookingItemTitle}`,
        name: data.name,
        email: data.email,
        phone: data.phone || 'N/A',
        preferred_date: data.preferred_date || 'N/A',
        experience_level: data.experience_level || 'N/A',
        payment_choice: data.paymentChoice === 'now' ? 'Pay deposit now via PayPal' : 'Pay later (inquire only)',
        paypal_link: data.paymentChoice === 'now' ? `${PAYPAL_LINK}/${amountMajor}THB` : null,
        item_title: bookingItemTitle,
        full_price: totalItemCostMajor > 0 ? `฿${totalItemCostMajor}` : (isStayBooking ? 'Quote on request' : 'N/A'),
        dive_count: isFunDiveBooking ? funDiveCount : 'N/A',
        course_fun_dive_count: isCourseBooking ? courseFunDiveCount : 'N/A',
        course_fun_dive_cost: isCourseBooking && courseFunDiveCostMajor > 0 ? `฿${courseFunDiveCostMajor}` : 'N/A',
        stay_with_us: isCourseBooking
          ? (stayWithUs ? 'Yes - accommodation free with course' : 'No')
          : (isDiveBooking ? (stayWithUs ? 'Yes - accommodation requested with dive booking' : 'No') : 'N/A'),
        deposit_amount: amountMajor > 0 ? `฿${amountMajor}` : 'Quote on request',
        addons: addonsText,
        booking_source: bookingSource,
        message: messageWithSource,
      };

      console.log('Sending booking payload to Web3Forms', payload);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));
      console.log('Web3Forms response:', res.status, responseData);

      // Notify user based on Web3Forms result, but booking is already persisted
      if (res.ok && responseData.success) {
        if (data.paymentChoice === 'now' && amountMajor > 0) {
          setShowPaymentLinks(true);
        } else {
          setShowSkipPaymentPopup(true);
        }
      } else {
        const errMsg = responseData?.message || responseData?.error || `HTTP ${res.status}`;
        console.error('Web3Forms error:', errMsg, responseData);
        if (persisted) {
          toast.error(`Inquiry saved, but email notification failed: ${errMsg}`);
          if (data.paymentChoice === 'now' && amountMajor > 0) {
            setShowPaymentLinks(true);
          } else {
            setShowSkipPaymentPopup(true);
          }
        } else {
          toast.error(`Submission failed: ${errMsg}. Please retry.`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rezdy prefill removed.

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto bg-background rounded-xl shadow-xl shadow-blue-900/20 p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold mb-2">Book: {itemTitle}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Select options and submit your booking or inquiry.</p>

        {!hasDirectBookingContext && (
          <div className="mb-6 p-4 border rounded-lg bg-blue-700 border-blue-600 text-white">
            <h3 className="font-semibold mb-3 text-white">What would you like to book?</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={isCourseBooking ? 'default' : 'outline'}
                className={isCourseBooking ? 'bg-blue-900 hover:bg-blue-950 text-white border-blue-900' : 'bg-white/10 hover:bg-white/20 text-white border-white/40'}
                onClick={() => navigate(`/booking?source=${encodeURIComponent(bookingSource)}&bookingKind=course`)}
              >
                Course
              </Button>
              <Button
                type="button"
                variant={isDiveBooking ? 'default' : 'outline'}
                className={isDiveBooking ? 'bg-blue-500 hover:bg-blue-400 text-white border-blue-500' : 'bg-white/10 hover:bg-white/20 text-white border-white/40'}
                onClick={() => navigate(`/booking?source=${encodeURIComponent(bookingSource)}&bookingKind=dive`)}
              >
                Fun Dives
              </Button>
            </div>
          </div>
        )}

        {/* Special Packages Banner */}
        {!hasDirectBookingContext && (
          <div className="mb-6 p-6 border-2 border-emerald-500 rounded-lg bg-emerald-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-4xl">🎓</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">3 Specialty Bundle - Save ฿6,000!</h3>
                <p className="text-emerald-800 mb-3">
                  Enroll in three PADI Specialty Dive Courses and pay less. It's a unique opportunity to explore various aspects of scuba diving, from marine life identification to underwater photography.
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-emerald-900">฿18,000</span>
                  <span className="text-emerald-700 line-through text-xl">฿24,000</span>
                  <span className="text-sm text-emerald-700">(3 courses of your choice)</span>
                </div>
                <Button 
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.location.href = '/booking?item=3%20Specialty%20Bundle&type=course&price=18000&currency=THB'}
                >
                  Book 3 Specialty Bundle
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {itemType === 'course' ? (
                <>
                  <div className="text-lg font-semibold">Course cost</div>
                  <div className="text-2xl font-bold">{totalItemCostMajor > 0 ? `฿${totalItemCostMajor}` : 'Contact us'}</div>
                  {courseFunDiveCostMajor > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Includes Fun Dives add-on: ฿{courseFunDiveCostMajor}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">Deposit payable now (20%): {depositMajor > 0 ? `฿${depositMajor}` : 'Contact us'}</div>
                </>
              ) : itemType === 'dive' ? (
                <>
                  <div className="text-lg font-semibold">Dive price</div>
                  <div className="text-2xl font-bold">{courseCostMajor > 0 ? `฿${courseCostMajor}` : 'Contact us'}</div>
                  <div className="text-sm text-muted-foreground mt-1">Deposit payable now (20%): {depositMajor > 0 ? `฿${depositMajor}` : 'Contact us'}</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold">Accommodation request</div>
                  <div className="text-2xl font-bold">Custom quote</div>
                  <div className="text-sm text-muted-foreground mt-1">We will confirm room options and exact seasonal pricing.</div>
                </>
              )}
            </div>
            {isDiveBooking && (
              <div className="text-right">
                <div className="text-lg font-semibold">Add-ons</div>
                <div className="text-sm text-muted-foreground">Select extras below</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-semibold mb-3">Quick booking options</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isCourseBooking || isDiveBooking) {
                  setStayWithUs(true);
                  setShowStayPopup(true);
                  return;
                }
                navigate('/booking?item=Resort%20Accommodation&type=stay&currency=THB');
              }}
            >
              Stay with us at our resort accommodation
            </Button>
          </div>
        </div>

        {(isCourseBooking || isDiveBooking) && (
          <div className="mb-6 p-3 border rounded-lg bg-blue-700 border-blue-600 text-white text-sm">
            If you choose alternative accommodation, please give us the details so we can arrange all necessary arrangements.
          </div>
        )}

        {isCourseBooking && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-semibold mb-3">Add Fun Dives to your course</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2 mb-3">
              {Array.from({ length: 11 }, (_, i) => i).map((count) => (
                <button
                  key={count}
                  type="button"
                  ONCLICK={() => SETCOURSEFUNDIVECOUNT(COUNT)}

                  {COUNT}
                </BUTTON>
              ))}
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND MB-3">
              PRICING: 1 DIVE = ฿1,000, 2-9 DIVES = ฿900 PER DIVE, 10+ DIVES = ฿800 PER DIVE.
              SELECTED ADD-ON: {COURSEFUNDIVECOUNT} DIVES{COURSEFUNDIVECOUNT > 0 ? ` (฿${COURSEFUNDIVECOSTMAJOR})` : ''}.
            </P>

            <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2 TEXT-SM">
              <INPUT
                TYPE="CHECKBOX"
                CHECKED={STAYWITHUS}
                ONCHANGE={(E) => {
                  CONST CHECKED = E.TARGET.CHECKED;
                  SETSTAYWITHUS(CHECKED);
                  IF (CHECKED) {
                    SETSHOWSTAYPOPUP(TRUE);
                  }
                }}
              />
              STAY WITH US (ACCOMMODATION)
            </LABEL>
          </DIV>
        )}

        {ISCOURSEBOOKING && STAYWITHUS && (
          <DIV CLASSNAME="MB-6 P-3 BORDER ROUNDED-LG BG-EMERALD-50 BORDER-EMERALD-200 TEXT-EMERALD-800 TEXT-SM">
            ACCOMMODATION IS FREE WITH THIS COURSE. COURSE PRICING REMAINS UNCHANGED.
          </DIV>
        )}

        {ISDIVEBOOKING && STAYWITHUS && (
          <DIV CLASSNAME="MB-6 P-3 BORDER ROUNDED-LG BG-BLUE-50 BORDER-BLUE-200 TEXT-BLUE-900 TEXT-SM">
            DEPOSIT PAYABLE NOW FOR YOUR DIVES AND ACCOMMODATION TOTAL PRICING TO BE CONFIRMED. PLEASE LEAVE DETAILS IN THE FORM BELOW AND WE WILL CONTACT TO CONFIRM YOUR TOTAL AMOUNT PAYABLE ON ARRIVAL OR DEPOSIT BEFORE ARRIVING.
          </DIV>
        )}

        {ISFUNDIVEBOOKING && (
          <DIV CLASSNAME="MB-6 P-4 BORDER ROUNDED-LG BG-MUTED/30">
            <H3 CLASSNAME="FONT-SEMIBOLD MB-3">CHOOSE NUMBER OF DIVES</H3>
            <DIV CLASSNAME="GRID GRID-COLS-3 SM:GRID-COLS-5 MD:GRID-COLS-10 GAP-2 MB-3">
              {ARRAY.FROM({ LENGTH: 10 }, (_, I) => I + 1).MAP((COUNT) => (
                <BUTTON
                  KEY={COUNT}
                  TYPE="BUTTON"
                  ONCLICK={() => SETFUNDIVECOUNT(COUNT)}
                  CLASSNAME={`PX-3 PY-2 ROUNDED BORDER TEXT-SM FONT-MEDIUM TRANSITION ${FUNDIVECOUNT === COUNT ? 'BG-BLUE-600 TEXT-WHITE BORDER-BLUE-600' : 'BG-BACKGROUND HOVER:BG-BLUE-50 BORDER-BORDER'}`}
                >
                  {COUNT} {COUNT === 1 ? 'DIVE' : 'DIVES'}
                </BUTTON>
              ))}
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">
              PRICING: 1 DIVE = ฿1,000, 2-9 DIVES = ฿900 PER DIVE, 10+ DIVES = ฿800 PER DIVE.
              CURRENT RATE: ฿{GETFUNDIVERATE(FUNDIVECOUNT)} PER DIVE.
            </P>
          </DIV>
        )}

        {ISDIVEBOOKING && (
          <DIV CLASSNAME="GRID MD:GRID-COLS-2 GAP-6 MB-6">
            {AVAILABLEADDONS.MAP((A) => (
              <LABEL KEY={A.ID} CLASSNAME="FLEX ITEMS-CENTER GAP-3 P-4 BORDER ROUNDED">
                <INPUT TYPE="CHECKBOX" CHECKED={!!SELECTEDADDONS[A.ID]} ONCHANGE={() => SETSELECTEDADDONS(S => ({ ...S, [A.ID]: !S[A.ID] }))} />
                <DIV>
                  <DIV CLASSNAME="FONT-MEDIUM">{A.LABEL}</DIV>
                  <DIV CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">฿{A.AMOUNT}</DIV>
                </DIV>
              </LABEL>
            ))}
          </DIV>
        )}

        <DIV CLASSNAME="MB-6 TEXT-RIGHT">
          <DIV CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">
            {ISSTAYBOOKING ? 'PAYMENT:' : (ISDIVEBOOKING ? 'TOTAL PAYABLE NOW (INCL. ADD-ONS):' : 'TOTAL PAYABLE NOW:')}
          </DIV>
          <DIV CLASSNAME="TEXT-2XL FONT-BOLD">{ISSTAYBOOKING ? 'QUOTE ON REQUEST' : `฿${DEPOSITMAJOR + TOTALADDONS}`}</DIV>
        </DIV>

        <FORM {...FORM}>
          <FORM ONSUBMIT={FORM.HANDLESUBMIT(ONSUBMIT)} CLASSNAME="SPACE-Y-4">
            <FORMFIELD CONTROL={FORM.CONTROL} NAME="NAME" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><USER CLASSNAME="H-4 W-4" /> FULL NAME *</FORMLABEL>
                <FORMCONTROL><INPUT PLACEHOLDER="JOHN DOE" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="EMAIL" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><MAIL CLASSNAME="H-4 W-4" /> EMAIL *</FORMLABEL>
                <FORMCONTROL><INPUT TYPE="EMAIL" PLACEHOLDER="JOHN@EXAMPLE.COM" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PHONE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><PHONE CLASSNAME="H-4 W-4" /> PHONE</FORMLABEL>
                <FORMCONTROL><INPUT PLACEHOLDER="+66 123 456 789" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PREFERRED_DATE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><CALENDAR CLASSNAME="H-4 W-4" /> PREFERRED DATE</FORMLABEL>
                <FORMCONTROL><INPUT TYPE="DATE" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="EXPERIENCE_LEVEL" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL>EXPERIENCE LEVEL</FORMLABEL>
                <SELECT ONVALUECHANGE={FIELD.ONCHANGE} DEFAULTVALUE={FIELD.VALUE}>
                  <FORMCONTROL>
                    <SELECTTRIGGER>
                      <SELECTVALUE PLACEHOLDER="SELECT YOUR EXPERIENCE LEVEL" />
                    </SELECTTRIGGER>
                  </FORMCONTROL>
                  <SELECTCONTENT>
                    <SELECTITEM VALUE="NONE">NO DIVING EXPERIENCE</SELECTITEM>
                    <SELECTITEM VALUE="BEGINNER">BEGINNER (1-10 DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="INTERMEDIATE">INTERMEDIATE (10-50 DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="ADVANCED">ADVANCED (50+ DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="PROFESSIONAL">PROFESSIONAL DIVER</SELECTITEM>
                  </SELECTCONTENT>
                </SELECT>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="MESSAGE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><MESSAGESQUARE CLASSNAME="H-4 W-4" /> MESSAGE</FORMLABEL>
                <FORMCONTROL><TEXTAREA PLACEHOLDER="ANY SPECIAL REQUESTS OR QUESTIONS?" ROWS={3} {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PAYMENTCHOICE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL>PAYMENT METHOD</FORMLABEL>
                <FORMCONTROL>
                  <DIV CLASSNAME="SPACE-Y-2">
                    <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2">
                      <INPUT
                        TYPE="RADIO"
                        ID="PAYMENT-NOW"
                        NAME="PAYMENTCHOICE"
                        VALUE="NOW"
                        CHECKED={FIELD.VALUE === 'NOW'}
                        ONCHANGE={() => FIELD.ONCHANGE('NOW')}
                      />
                      <SPAN>{ISSTAYBOOKING ? 'PAY AFTER CONFIRMATION' : 'PAY DEPOSIT NOW WITH PAYPAL'}</SPAN>
                    </LABEL>
                    <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2">
                      <INPUT
                        TYPE="RADIO"
                        ID="PAYMENT-NONE"
                        NAME="PAYMENTCHOICE"
                        VALUE="NONE"
                        CHECKED={FIELD.VALUE === 'NONE'}
                        ONCHANGE={() => FIELD.ONCHANGE('NONE')}
                      />
                      <SPAN>{ISSTAYBOOKING ? 'SEND ACCOMMODATION INQUIRY' : 'PAY LATER (INQUIRE ONLY)'}</SPAN>
                    </LABEL>
                  </DIV>
                </FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <DIV CLASSNAME="FLEX GAP-3 PT-4">
              <BUTTON TYPE="BUTTON" VARIANT="OUTLINE" ONCLICK={() => NAVIGATE(-1)} CLASSNAME="FLEX-1">CANCEL</BUTTON>
              <BUTTON TYPE="SUBMIT" DISABLED={ISSUBMITTING} CLASSNAME="FLEX-1 BG-PRIMARY HOVER:BG-PRIMARY/90">
                {ISSUBMITTING ? 'SENDING...' : 'SUBMIT INQUIRY'}
              </BUTTON>
            </DIV>
          </FORM>
        </FORM>

        {SHOWPAYMENTLINKS && (
          <DIV CLASSNAME="MT-8 P-6 BORDER ROUNDED-XL BG-MUTED/50 TEXT-CENTER SPACE-Y-4">
            <H2 CLASSNAME="TEXT-XL FONT-BOLD">PAY YOUR DEPOSIT</H2>
            <P CLASSNAME="TEXT-MUTED-FOREGROUND">YOUR INQUIRY HAS BEEN SENT! TO SECURE YOUR BOOKING, PAY THE DEPOSIT OF <STRONG>฿{DEPOSITMAJOR + TOTALADDONS}</STRONG> VIA PAYPAL:</P>
            <DIV CLASSNAME="SPACE-Y-3">
              <A
                HREF={`${PAYPAL_LINK}/${DEPOSITMAJOR + TOTALADDONS}THB`}
                TARGET="_BLANK"
                REL="NOOPENER NOREFERRER"
              >
                <BUTTON CLASSNAME="BG-[#0070BA] HOVER:BG-[#005EA6] TEXT-WHITE PX-8 PY-3 TEXT-LG W-FULL">
                  PAY ฿{DEPOSITMAJOR + TOTALADDONS} WITH PAYPAL
                </BUTTON>
              </A>
              <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">OR</P>
              <A
                HREF={PAYPAL_LINK}
                TARGET="_BLANK"
                REL="NOOPENER NOREFERRER"
              >
                <BUTTON VARIANT="OUTLINE" CLASSNAME="PX-8 PY-3 TEXT-LG W-FULL">
                  OPEN PAYPAL.ME/PRODIVINGASIA
                </BUTTON>
              </A>
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">OR <BUTTON CLASSNAME="UNDERLINE" ONCLICK={() => { 
              FORM.RESET(); 
              SETSHOWPAYMENTLINKS(FALSE); 
              SETSHOWSKIPPAYMENTPOPUP(TRUE); 
            }}>SKIP PAYMENT FOR NOW</BUTTON></P>
          </DIV>
        )}
      </DIV>

      <ALERTDIALOG OPEN={SHOWSTAYPOPUP} ONOPENCHANGE={SETSHOWSTAYPOPUP}>
        <ALERTDIALOGCONTENT>
          <ALERTDIALOGHEADER>
            <ALERTDIALOGTITLE>{ISCOURSEBOOKING ? 'ACCOMMODATION INCLUDED' : 'ACCOMMODATION REQUEST NOTED'}</ALERTDIALOGTITLE>
            <ALERTDIALOGDESCRIPTION>
              {ISCOURSEBOOKING
                ? 'ACCOMMODATION FREE WITH US FOR COURSES.'
                : 'DEPOSIT PAYABLE NOW FOR YOUR DIVES AND ACCOMMODATION TOTAL PRICING TO BE CONFIRMED. PLEASE LEAVE DETAILS IN THE FORM BELOW AND WE WILL CONTACT TO CONFIRM YOUR TOTAL AMOUNT PAYABLE ON ARRIVAL Or deposit before arriving.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showSkipPaymentPopup}
        onOpenChange={(open) => {
          setShowSkipPaymentPopup(open);
          if (!open) {
            form.reset();
            navigate('/');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inquiry Sent</AlertDialogTitle>
            <AlertDialogDescription>{SKIP_PAYMENT_MESSAGE}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              form.reset();
              navigate('/');
            }}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingPage;
