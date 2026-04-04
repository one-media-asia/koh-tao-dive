 |                                          ^
26 |    import AffiliateClicksAdmin from '../components/AffiliateClicksAdmin';
27 |    const jiraEmbedUrl = import.meta.env.VITE_JIRA_EMBED_URL || '';
const affiliateClicksStore = [];
const MAX_AFFILIATE_CLICK_EVENTS = 2000;

const ALLOWED_ORIGINS = new Set([
	'https://www.divinginasia.com',
	'https://divinginasia.com',
	'http://localhost:3000',
	'http://localhost:5173',
]);

function setCors(req, res) {
	const origin = req.headers && typeof req.headers.origin === 'string' ? req.headers.origin : '';

	if (origin && ALLOWED_ORIGINS.has(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		res.setHeader('Vary', 'Origin');
	} else {
		res.setHeader('Access-Control-Allow-Origin', '*');
	}

	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
	setCors(req, res);

	if (req.method === 'OPTIONS') {
		res.status(204).end();
		return;
	}

	if (req.method === 'GET') {
		const providerFilter = req.query && typeof req.query.provider === 'string' ? req.query.provider : null;
		const filtered = providerFilter
			? affiliateClicksStore.filter((event) => event.provider === providerFilter)
			: affiliateClicksStore;

		const byProvider = {};
		for (const event of filtered) {
			const key = event.provider || 'unknown';
			byProvider[key] = (byProvider[key] || 0) + 1;
		}

		res.status(200).json({
			total: filtered.length,
			byProvider,
			recent: filtered.slice(-100).reverse(),
		});
		return;
	}

	if (req.method === 'POST') {
		const body = req.body || {};
		const provider = typeof body.provider === 'string' ? body.provider : null;
		const hotelUrl = typeof body.hotel_url === 'string' ? body.hotel_url : null;

		if (!provider || !hotelUrl) {
			res.status(400).json({ error: 'Missing required fields: provider, hotel_url' });
			return;
		}
		// ...existing POST logic...
	}
}
