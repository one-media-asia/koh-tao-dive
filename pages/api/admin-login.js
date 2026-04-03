// Vercel Serverless Function: Basic Admin Login

const ADMIN_EMAILS_RAW = process.env.ADMIN_EMAILS || 'peter@p.com';
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '').trim();

const ADMIN_EMAILS = ADMIN_EMAILS_RAW
	.split(',')
	.map((email) => String(email || '').trim().toLowerCase())
	.filter(Boolean);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	if (!ADMIN_PASSWORD) {
		res.status(500).json({ success: false, error: 'Admin login is not configured' });
		return;
	}

	const { email, password } = req.body;
	const normalizedEmail = String(email || '').trim().toLowerCase();

	if (ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_PASSWORD) {
		// In production, set a secure cookie or JWT here
		res.status(200).json({ success: true, message: 'Login successful' });
	} else {
		res.status(401).json({ success: false, error: 'Invalid credentials' });
	}
}
