

	import fetch from 'node-fetch';

	export default async function handler(req, res) {
		// Allow production and any Vercel preview domain
		const origin = req.headers.origin;
		const isProd = origin === 'https://www.divinginasia.com';
		const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
		if (isProd || isVercelPreview) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.setHeader('Vary', 'Origin');
		res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		if (req.method === 'OPTIONS') {
			res.status(200).end();
			return;
		}
		if (req.method !== 'POST') {
			res.status(405).json({ error: 'Method not allowed' });
			return;
		}

		try {
			const {
				name,
				email,
				phone,
				preferred_date,
				experience_level,
				message,
				item_title,
				deposit_amount,
				payment_choice,
				paypal_link,
			} = req.body || {};

			// Prepare data for Web3Forms
			const web3formsAccessKey = '0baa4056-09a3-4e86-9b77-5fcfea76b361';
			if (!web3formsAccessKey) {
				res.status(500).json({ success: false, error: 'Web3Forms not configured' });
				return;
			}

			const formData = {
				access_key: web3formsAccessKey,
				name: name,
				email: email,
				message: message || 'No message',
			};

			let response, data;
			try {
				response = await fetch('https://api.web3forms.com/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				});
				data = await response.json();
			} catch (apiErr) {
				console.error('Web3Forms API error:', apiErr);
				res.status(500).json({ success: false, error: 'Web3Forms API request failed', details: String(apiErr) });
				return;
			}

			if (data.success) {
				res.status(200).json({ success: true });
			} else {
				console.error('Web3Forms submission failed:', data);
				res.status(500).json({ success: false, error: data.message || 'Failed to send booking', details: data });
			}
		} catch (err) {
			console.error('send-booking-notification error', err);
			res.status(500).json({ error: err.message || 'Internal error' });
		}
	}
}
