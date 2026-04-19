import React, { useState } from 'react';
import { useCurrency, CurrencySelector } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';




const COURSE_PRICES: Record<string, number> = {
  'Open Water': 12000,
  'Advanced Open Water': 11000,
  'Rescue Diver': 13000,
  'Divemaster': 35000,
  'Fun Dive': 1800,
};

const PAYPAL_BASE = 'https://paypal.me/prodivingasia';

interface BookNowFormProps {
  initialCourseTitle?: string;
}

const BookNowForm: React.FC<BookNowFormProps> = ({ initialCourseTitle }) => {
  const { currency, convertCurrency } = useCurrency();
  const [form, setForm] = useState({
    name: '',
    course_title: initialCourseTitle || '',
    email: '',
    phone: '',
    accommodation_type: '',
    arrival_date: '',
    diving_experience: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayOptions, setShowPayOptions] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const coursePrice = COURSE_PRICES[form.course_title] || 0;
  // For Fun Dive, deposit is always 360; for others, 20%
  const deposit = form.course_title === 'Fun Dive' ? 360 : (coursePrice ? Math.round(coursePrice * 0.2) : 0);
  const coursePriceConverted = convertCurrency(coursePrice, 'THB');
  const depositConverted = convertCurrency(deposit, 'THB');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'course_title') setShowPayOptions(true);
  };

  const sendToSupabaseAndEmail = async (payNow: boolean) => {
    // Save booking to Supabase
    await supabase.from('bookings').insert([
      {
        name: form.name,
        course_title: form.course_title,
        email: form.email,
        phone: form.phone,
        item_type: 'web-booking',
        accommodation_type: form.accommodation_type,
        preferred_date: form.arrival_date,
        experience_level: form.diving_experience,
        message: form.message,
        status: 'new',
        total_amount: coursePrice,
        deposit_amount: deposit,
        payment_status: payNow ? 'deposit_requested' : 'pending',
      },
    ]);
    // Send to Web3Forms
    const formEl = document.createElement('form');
    formEl.action = 'https://api.web3forms.com/submit';
    formEl.method = 'POST';
    formEl.style.display = 'none';
    [
      ['access_key', 'e4c4edf6-6e35-456a-87da-b32b961b449a'],
      ['subject', 'New Booking Inquiry from Website'],
      ['redirect', 'https://www.divinginasia.com/thank-you.html'],
      ['name', form.name],
      ['course_title', form.course_title],
      ['email', form.email],
      ['phone', form.phone],
      ['accommodation_type', form.accommodation_type],
      ['arrival_date', form.arrival_date],
      ['diving_experience', form.diving_experience],
      ['message', form.message],
      ['course_price', coursePrice.toString()],
      ['deposit_amount', deposit.toString()],
      ['payment_status', payNow ? 'deposit_requested' : 'pending'],
    ].forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k as string;
      input.value = v as string;
      formEl.appendChild(input);
    });
    document.body.appendChild(formEl);
    formEl.submit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowPayOptions(true);
  };

  const handlePayNow = async () => {
    setLoading(true);
    await sendToSupabaseAndEmail(true);
    window.location.href = `${PAYPAL_BASE}/${deposit}`;
  };

  const handleNotNow = async () => {
    setLoading(true);
    await sendToSupabaseAndEmail(false);
    setShowThankYou(true);
    setLoading(false);
  };

  return (
    <div className="form-container max-w-lg mx-auto my-8 bg-white text-gray-900 p-10 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <img src="/images/logo.png" alt="Diving In Asia Logo" className="mx-auto max-w-[180px] h-auto" />
      </div>
      <div className="flex justify-end mb-2">
        <CurrencySelector />
      </div>
      <h2 className="text-center mb-6 text-2xl font-bold">Booking / Inquiry Form</h2>
      {showThankYou ? (
        <div className="bg-green-50 rounded-lg p-8 text-center text-lg text-green-900 mt-6">
          <p>You have chosen not to pay now. That's fine, we will contact you to discuss your arrangements.</p>
          <p className="mt-4">Thank you – Team Asia</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* ...existing code... */}
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 font-medium">Name</label>
              <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="course_title" className="mb-1 font-medium">Course</label>
              <select id="course_title" name="course_title" required value={form.course_title} onChange={handleChange} className="w-full p-2 rounded border border-gray-300">
                <option value="">Select...</option>
                <option value="Open Water">Open Water</option>
                <option value="Advanced Open Water">Advanced Open Water</option>
                <option value="Rescue Diver">Rescue Diver</option>
                <option value="Divemaster">Divemaster</option>
                <option value="Fun Dive">Fun Dive</option>
              </select>
            </div>
            {form.course_title && coursePrice > 0 && (
              <div className="bg-blue-50 rounded p-4 mb-2">
                <div><strong>Course Price:</strong> {coursePrice.toLocaleString()} THB
                  {currency !== 'THB' && (
                    <span className="ml-2 text-blue-700">({coursePriceConverted} THB)</span>
                  )}
                </div>
                <div><strong>Deposit (20%):</strong> {deposit.toLocaleString()} THB
                  {currency !== 'THB' && (
                    <span className="ml-2 text-blue-700">({depositConverted} THB)</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">You can pay the deposit now to secure your spot, or choose to pay later.</div>
              </div>
            )}
            {/* ...existing code... */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium">Email</label>
              <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 font-medium">Phone</label>
              <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="accommodation_type" className="mb-1 font-medium">Accommodation Type</label>
              <select id="accommodation_type" name="accommodation_type" value={form.accommodation_type} onChange={handleChange} className="w-full p-2 rounded border border-gray-300">
                <option value="">Select...</option>
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
                <option value="other">Other / Not sure</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="arrival_date" className="mb-1 font-medium">Arrival Date</label>
              <input type="date" id="arrival_date" name="arrival_date" value={form.arrival_date} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="diving_experience" className="mb-1 font-medium">Diving Experience</label>
              <select id="diving_experience" name="diving_experience" value={form.diving_experience} onChange={handleChange} className="w-full p-2 rounded border border-gray-300">
                <option value="">Select...</option>
                <option value="none">No diving experience</option>
                <option value="beginner">Beginner (1-10 dives)</option>
                <option value="intermediate">Intermediate (10-50 dives)</option>
                <option value="advanced">Advanced (50+ dives)</option>
                <option value="professional">Professional diver</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="message" className="mb-1 font-medium">Comments / Questions</label>
              <textarea id="message" name="message" rows={3} placeholder="Let us know any special requests, questions, or details..." value={form.message} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {!showPayOptions && (
              <button type="submit" disabled={loading} className="mt-6 py-3 px-6 bg-blue-700 text-white rounded w-full text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit Booking'}
              </button>
            )}
          </form>
          {/* Payment options modal/section */}
          {showPayOptions && form.course_title && coursePrice > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6 text-center shadow">
              <h3 className="mb-3 text-lg font-semibold">Secure Your Spot</h3>
              <div className="mb-2">Pay a <strong>20% deposit ({deposit.toLocaleString()} THB)</strong> now via PayPal to confirm your booking, or choose to pay later.</div>
              <div className="flex gap-4 justify-center mt-4">
                <button onClick={handlePayNow} disabled={loading} className="bg-blue-700 text-white rounded px-6 py-3 text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : 'Pay Now (PayPal)'}
                </button>
                <button onClick={handleNotNow} disabled={loading} className="bg-gray-400 text-white rounded px-6 py-3 text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Processing...' : 'Not Now'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookNowForm;
