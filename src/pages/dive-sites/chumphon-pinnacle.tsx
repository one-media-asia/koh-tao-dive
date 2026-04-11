import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

type ContentfulData = {
	title: string;
	description: { json: any };
};

export default function ChumphonPinnaclePage() {
	const [data, setData] = useState<ContentfulData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
				const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
				// Fetch by content type and slug
				const res = await fetch(
					`https://cdn.contentful.com/spaces/${space}/environments/master/entries?access_token=${accessToken}&content_type=diveasia&fields.slug=chumphon-pinnacle&limit=1`
				);
				if (!res.ok) throw new Error('Failed to fetch');
				const json = await res.json();
				if (json.items.length === 0) {
					setData(null);
				} else {
					setData({
						title: json.items[0].fields.title,
						description: json.items[0].fields.description,
					});
				}
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return <div>No content found.</div>;

	return (
		<main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
			<h1>{data.title}</h1>
			<div>{documentToReactComponents(data.description.json, {
				renderNode: {
					[BLOCKS.PARAGRAPH]: (node, children) => <p style={{ marginBottom: 16 }}>{children}</p>,
				},
			})}</div>
		</main>
	);
}
