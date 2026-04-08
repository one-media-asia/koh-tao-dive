import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }


  const {
    name,
    email,
    phone,
    course_name,
    fun_dive_count,
    accommodation_nights,
    accommodation,
    full_price,
    deposit_amount,
    course_title,
    preferred_date,
    experience_level,
    message
  } = req.body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { error } = await supabase.from('bookings').insert([
    {
      name,
      email,
      phone,
      course_name: course_name || course_title,
      fun_dive_count,
      accommodation_nights,
      accommodation,
      full_price,
      deposit_amount,
      preferred_date,
      experience_level,
      message
    }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true });
}
