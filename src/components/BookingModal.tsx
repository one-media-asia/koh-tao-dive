
import React, { useState, useEffect } from 'react';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}


const LOCAL_STORAGE_KEY = 'bookingModalForm';

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    experience: '',
    message: '',
  });

  // Load saved form data when modal opens
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch {
          setForm({
            name: '',
            email: '',
            phone: '',
            date: '',
            experience: '',
            message: '',
          });
        }
      } else {
        setForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          experience: '',
          message: '',
        });
      }
    }
  }, [open]);

  if (!open) return null;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-gray-900">
        <h2 className="text-xl font-bold mb-4">New Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded text-gray-900" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded text-gray-900" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded text-gray-900" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Preferred Date" className="w-full border p-2 rounded text-gray-900" type="date" />
          <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience Level" className="w-full border p-2 rounded text-gray-900" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="w-full border p-2 rounded text-gray-900" />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-gray-900">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
