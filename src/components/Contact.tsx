import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePageContent } from '@/hooks/usePageContent';
import { useTranslation } from 'react-i18next';
import CalendarSubscribe from './CalendarSubscribe';

// Do not call emailjs.init with the service ID — we'll pass the public key on send.

const Contact = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const locale = isDutch ? 'nl' : 'en';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const apiUrl = (path: string) => (apiBase ? `${apiBase}${path}` : path);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'Course Information',
    message: ''
  });

  const fallbackContent = useMemo(() => {
    if (isDutch) {
      return {
        section_title: 'Neem contact op',
        section_subtitle: 'Klaar om de onderwaterwereld te ontdekken? Neem contact op met Bas om jouw duikavontuur op Koh Tao te boeken.',
        details_title: 'Contactgegevens',
        location_title: 'Locatie',
        location_line_1: 'Sairee Beach, Koh Tao',
        location_line_2: 'Surat Thani 84360, Thailand',
        phone_title: 'Telefoon',
        phone_line_1: '+66 77 456 789',
        phone_line_2: '+66 89 123 4567',
        email_title: 'E-mail',
        email_value: 'contact@divinginasia.com',
        opening_hours_title: 'Openingstijden',
        opening_hours_line_1: 'Dagelijks: 07:00 - 19:00',
        opening_hours_line_2: 'Noodgeval: 24/7',
        follow_title: 'Volg ons',
        form_title: 'Stuur ons een bericht',
        form_first_name_label: 'Voornaam',
        form_last_name_label: 'Achternaam',
        form_email_label: 'E-mail',
        form_subject_label: 'Onderwerp',
        subject_option_1: 'Cursusinformatie',
        subject_option_2: 'Boeking duiktrip',
        subject_option_3: 'Materiaalverhuur',
        subject_option_4: 'Algemene vraag',
        form_message_label: 'Bericht',
        form_submit_label: 'Verstuur bericht',
        form_sending_label: 'Versturen...',
        footer_line_1: '© 2026 Pro Diving Asia. Alle rechten voorbehouden. Powered by One Media Asia @ www.onemedia.asia',
        footer_line_2: 'Ontdek de magie onder de golven in het duikparadijs van Thailand.',
      };
    }

    return {
      section_title: 'Get in Touch',
      section_subtitle: 'Ready to explore the underwater world? Contact Bas to book your diving adventure on Koh Tao.',
      details_title: 'Contact Details',
      location_title: 'Location',
      location_line_1: 'Sairee Beach, Koh Tao',
      location_line_2: 'Surat Thani 84360, Thailand',
      phone_title: 'Phone',
      phone_line_1: '+66 77 456 789',
      phone_line_2: '+66 89 123 4567',
      email_title: 'Email',
      email_value: 'contact@divinginasia.com',
      opening_hours_title: 'Opening Hours',
      opening_hours_line_1: 'Daily: 07:00 - 19:00',
      opening_hours_line_2: 'Emergency: 24/7',
      follow_title: 'Follow Us',
      form_title: 'Send Us a Message',
      form_first_name_label: 'First Name',
      form_last_name_label: 'Last Name',
      form_email_label: 'Email',
      form_subject_label: 'Subject',
      subject_option_1: 'Course Information',
      subject_option_2: 'Dive Trip Booking',
      subject_option_3: 'Equipment Rental',
      subject_option_4: 'General Question',
      form_message_label: 'Message',
      form_submit_label: 'Send Message',
      form_sending_label: 'Sending...',
      footer_line_1: '© 2026 Pro Diving Asia. All rights reserved. Powered by One Media Asia @ www.onemedia.asia',
      footer_line_2: "Discover the magic beneath the waves in Thailand's diving paradise.",
    };
  }, [isDutch]);

  const { content } = usePageContent({
    pageSlug: 'contact',
    locale,
    fallbackContent,
  });

  const subjectOptions = useMemo(() => {
    return [
      content.subject_option_1,
      content.subject_option_2,
      content.subject_option_3,
      content.subject_option_4,
    ].filter((value): value is string => Boolean(value && value.trim()));
  }, [content]);

  useEffect(() => {
    setFormData((prev) => {
      const defaultSubject = subjectOptions[0] || 'Course Information';
      if (subjectOptions.includes(prev.subject)) return prev;
      return { ...prev, subject: defaultSubject };
    });
  }, [subjectOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject || 'Contact Form Submission',
        message: formData.message
      };
      const response = await fetch(apiUrl('/api/contact'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        const errMsg = data?.message || data?.error || response.statusText || 'Request failed';
        throw new Error(`Server returned ${response.status}: ${errMsg}`);
      }

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        if (data.warning) {
          toast.warning(`Saved your inquiry, but email delivery needs attention: ${data.warning}`);
        }
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: subjectOptions[0] || 'Course Information',
          message: ''
        });
      } else {
        const errMsg = data?.message || data?.error || 'Submission failed';
        console.error('Contact API error:', errMsg, data);
        toast.error(`Failed: ${errMsg}. Please try again or email us directly.`);
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      const message = error instanceof Error ? error.message : 'Network error';
      toast.error(`Failed to save contact: ${message}. Please try again or email us at contact@divinginasia.com`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{content.section_title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{content.section_subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">{content.details_title}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{content.location_title}</h4>
                  <p className="text-gray-300">
                    {content.location_line_1}<br />
                    {content.location_line_2}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{content.phone_title}</h4>
                  <p className="text-gray-300">{content.phone_line_1}</p>
                  <p className="text-gray-300">{content.phone_line_2}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{content.email_title}</h4>
                  <p className="text-gray-300">{content.email_value}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{content.opening_hours_title}</h4>
                  <p className="text-gray-300">{content.opening_hours_line_1}</p>
                  <p className="text-gray-300">{content.opening_hours_line_2}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-lg mb-4">{content.follow_title}</h4>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/divegoprobybas/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/pro_diving_asia/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://wa.me/66612345678" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp" className="text-green-400 hover:text-green-300 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">{content.form_title}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{content.form_first_name_label}</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{content.form_last_name_label}</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{content.form_email_label}</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{content.form_subject_label}</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange} title="Subject" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white">
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{content.form_message_label}</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white" placeholder="Tell us about your diving experience and what you're looking for..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold">
                {isSubmitting ? content.form_sending_label : content.form_submit_label}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>{content.footer_line_1}</p>
          <p className="mt-2">{content.footer_line_2}</p>
        </div>
      </div>
    </section>
  );
};


import { useSupabaseUser } from '@/hooks/useSupabaseUser';

const ContactWrapper = () => {
  const user = useSupabaseUser();
  return (
    <>
      <Contact />
      {user && <CalendarSubscribe />}
    </>
  );
};

export default ContactWrapper;