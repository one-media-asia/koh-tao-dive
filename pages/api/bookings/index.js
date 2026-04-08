import { handleOptions, applyCors } from '../_lib/cors.js';

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const BOOKING_TABLE = 'bookings';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	throw new Error('Supabase environment variables are not set');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { realtime: { enabled: false } });

const toNumberOr = (value, fallback = 0) => {
	if (typeof value === 'number' && !Number.isNaN(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? fallback : parsed;
	}
	return fallback;
};

const normalizeBooking = (row = {}) => ({
	id: row.id,
	name: row.name || '',
	email: row.email || '',
	phone: row.phone || '',
	course_title: row.course_title || '',
	preferred_date: row.preferred_date || '',
	experience_level: row.experience_level || '',
	message: row.message || '',
	status: row.status || 'pending',
	internal_notes: row.internal_notes || '',
	created_at: row.created_at || '',
	deposit_amount: typeof row.deposit_amount === 'number' ? row.deposit_amount : null,
	total_amount: typeof row.total_amount === 'number' ? row.total_amount : null,
	due_amount: typeof row.due_amount === 'number' ? row.due_amount : null,
	bank_transfer_details: row.bank_transfer_details || '',
});

export default async function handler(req, res) {
	await applyCors(req, res);
	if (req.method === 'OPTIONS') return handleOptions(req, res);

	if (req.method === 'POST') {
		try {
			const { name, email, phone, course_title, preferred_date, experience_level, message } = req.body || {};
			if (!name || !email || !course_title) {
				return res.status(400).json({ error: 'Missing required fields' });
			}
			const { data, error } = await supabase.from(BOOKING_TABLE).insert([
				{
					name,
					email,
					phone,
					course_title,
					preferred_date,
					experience_level,
					message,
					status: 'pending',
				},
			]).select();
			if (error) {
				return res.status(500).json({ error: error.message });
			}
			// Call Supabase Edge Function for booking notification
			try {
				await fetch(
					process.env.BOOKING_NOTIFICATION_URL || 'https://koh-tao-dive-dreams-peach.vercel.app/send-booking-notification',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							name,
							email,
							phone,
							preferred_date,
							experience_level,
							message,
							item_title: course_title,
							deposit_amount: 0,
							payment_choice: 'none',
							paypal_link: '',
						}),
					}
				);
			} catch (notifyErr) {
				// Log but do not block booking creation
				console.error('Booking notification failed:', notifyErr);
			}
			return res.status(201).json({ booking: normalizeBooking(data[0]) });
		} catch (err) {
			return res.status(500).json({ error: err.message || 'Failed to create booking' });
		}
	} else {
		res.setHeader('Allow', ['POST', 'OPTIONS']);
		return res.status(405).end('Method Not Allowed');
	}
}
