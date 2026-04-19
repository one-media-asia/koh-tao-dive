
import React from 'react';
import { Link } from 'react-router-dom';
import diveSitesData from '../data/dive-sites.json';

const DiveSites = () => {
	const diveSites = Object.entries(diveSitesData);
	return (
		<section style={{ padding: '2rem 0' }}>
			<h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Koh Tao Dive Sites</h2>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
				{diveSites.map(([key, site]: [string, any]) => (
					<Link
						to={`/dive-sites/${key}`}
						key={key}
						style={{
							display: 'block',
							width: 280,
							   background: '#f3f4f6', // Tailwind gray-100
							borderRadius: 12,
							boxShadow: '0 2px 12px #0001',
							textDecoration: 'none',
							color: '#222',
							overflow: 'hidden',
							transition: 'box-shadow 0.2s',
						}}
					>
						{site.images && site.images[0] && (
							<img src={site.images[0]} alt={site.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
						)}
						<div style={{ padding: '1rem' }}>
							<h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{site.name}</h3>
							<div style={{ fontSize: '0.97rem', color: '#555', marginBottom: 8 }}>{site.overview}</div>
							<ul style={{ fontSize: '0.95rem', color: '#444', marginBottom: 8, paddingLeft: 18 }}>
								<li><strong>Depth:</strong> {site.quickFacts?.depth}</li>
								<li><strong>Difficulty:</strong> {site.quickFacts?.difficulty}</li>
								<li><strong>Best Time:</strong> {site.quickFacts?.bestTime}</li>
							</ul>
							<div style={{ fontSize: '0.93rem', color: '#0070ba' }}>
								<strong>Highlights:</strong> {site.whatYouCanSee?.slice(0, 3).join(', ')}
								{site.whatYouCanSee?.length > 3 && '...'}
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

export default DiveSites;
