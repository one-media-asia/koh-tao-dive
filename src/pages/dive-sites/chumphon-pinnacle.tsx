import { useEffect, useState } from 'react';
import './chumphon-pinnacle.css';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document } from '@contentful/rich-text-types';

type ContentfulData = {
	title: string;
	description: { json: Document };
};

export default function ChumphonPinnaclePage() {
	const [data, setData] = useState<ContentfulData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
				const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
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
			} catch (e) {
				setError(e instanceof Error ? e.message : String(e));
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
		<main className="chumphon-main">
			<h1>{data.title}</h1>
			<div>
				{documentToReactComponents(data.description.json, {
					renderNode: {
						[BLOCKS.PARAGRAPH]: (node, children) => (
							<p className="chumphon-paragraph">{children}</p>
						),
					},
				} as Options)}
			</div>
		</main>
	);
}
