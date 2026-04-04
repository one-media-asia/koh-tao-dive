
// API route: /api/dropbox-gallery?folder=Apps/Diveasianew/fun-diving
// Pass the full Dropbox folder path in the 'folder' query parameter (e.g., Apps/Diveasianew/fun-diving)
// Returns an array of image URLs from the specified Dropbox folder

export default async function handler(req, res) {
	const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
	const folder = req.query.folder || '';
	if (!DROPBOX_ACCESS_TOKEN) {
		return res.status(401).json({ error: 'Missing Dropbox access token' });
	}
	if (!folder) {
		return res.status(400).json({ error: 'Missing folder parameter' });
	}
	// Ensure leading slash for Dropbox API path
	const dropboxPath = folder.startsWith('/') ? folder : `/${folder}`;

	try {
		// List files in the folder
		const listRes = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ path: dropboxPath }),
		});
		const listText = await listRes.text();
		let listData;
		try {
			listData = JSON.parse(listText);
		} catch (e) {
			listData = { parseError: true, raw: listText };
		}
		if (!listRes.ok) {
			return res.status(listRes.status).json({ error: listData.error_summary || listData.raw || 'Dropbox API error', details: listData });
		}
		const imageFiles = (listData.entries || []).filter(
			(f) => f['.tag'] === 'file' && /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(f.name)
		);

		// Get temporary links for each image
		const links = await Promise.all(
			imageFiles.map(async (file) => {
				const tempRes = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ path: file.path_lower }),
				});
				const tempText = await tempRes.text();
				let tempData;
				try {
					tempData = JSON.parse(tempText);
				} catch (e) {
					tempData = { parseError: true, raw: tempText };
				}
				if (!tempRes.ok) {
					return { error: tempData.error_summary || tempData.raw || 'Dropbox temp link error', details: tempData };
				}
				return tempData.link || null;
			})
		);
		res.status(200).json(links.filter(Boolean));
	} catch (err) {
		res.status(500).json({ error: err.message || 'Internal server error', stack: err.stack });
	}
}
// API route: /api/dropbox-gallery?folder=folder-name
// Returns an array of image URLs from the specified Dropbox folder

export default async function handler(req, res) {
	const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;
	const folder = req.query.folder || '';
	if (!DROPBOX_ACCESS_TOKEN) {
		return res.status(401).json({ error: 'Missing Dropbox access token' });
	}
	if (!folder) {
		return res.status(400).json({ error: 'Missing folder parameter' });
	}

	try {
		// List files in the folder
		const listRes = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ path: `/${folder}` }),
		});
		const listText = await listRes.text();
		let listData;
		try {
			listData = JSON.parse(listText);
		} catch (e) {
			listData = { parseError: true, raw: listText };
		}
		if (!listRes.ok) {
			return res.status(listRes.status).json({ error: listData.error_summary || listData.raw || 'Dropbox API error', details: listData });
		}
		const imageFiles = (listData.entries || []).filter(
			(f) => f['.tag'] === 'file' && /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(f.name)
		);

		// Get temporary links for each image
		const links = await Promise.all(
			imageFiles.map(async (file) => {
				const tempRes = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ path: file.path_lower }),
				});
				const tempText = await tempRes.text();
				let tempData;
				try {
					tempData = JSON.parse(tempText);
				} catch (e) {
					tempData = { parseError: true, raw: tempText };
				}
				if (!tempRes.ok) {
					return { error: tempData.error_summary || tempData.raw || 'Dropbox temp link error', details: tempData };
				}
				return tempData.link || null;
			})
		);
		res.status(200).json(links.filter(Boolean));
	} catch (err) {
		res.status(500).json({ error: err.message || 'Internal server error', stack: err.stack });
	}
}
 
