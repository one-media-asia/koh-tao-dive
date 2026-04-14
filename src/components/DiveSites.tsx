
import React from 'react';
import diveSitesData from '../data/dive-sites.json';

const DiveSites = () => {
	// Convert the diveSitesData object to an array
	const diveSites = Object.entries(diveSitesData);

	return (
		<div>
			<h2>Dive Sites</h2>
			<ul>
				{diveSites.map(([key, site]: [string, any]) => (
					<li key={key} style={{ marginBottom: '2rem' }}>
						<h3>{site.name}</h3>
						<p>{site.overview}</p>
						{site.images && site.images.length > 0 && (
							<img src={site.images[0]} alt={site.name} style={{ maxWidth: '300px', display: 'block' }} />
						)}
						<ul>
							<li><strong>Depth:</strong> {site.quickFacts?.depth}</li>
							<li><strong>Difficulty:</strong> {site.quickFacts?.difficulty}</li>
							<li><strong>Location:</strong> {site.quickFacts?.location}</li>
							<li><strong>Best Time:</strong> {site.quickFacts?.bestTime}</li>
						</ul>
						<div>
							<strong>What you can see:</strong> {site.whatYouCanSee?.join(', ')}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default DiveSites;
