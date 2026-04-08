import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tryAutoScroll } from '@/lib/scroll';
import Hero from '../components/Hero';
import DiveSites from '../components/DiveSites';
import Courses from '../components/Courses';
import Gallery from '../components/Gallery';
import About from '../components/About';
import BookingInquiryForm from '../components/BookingInquiryForm';
import FunDiving from './FunDiving';
import CurrencyExchange from '../components/CurrencyExchange';

const Index = () => {
	const location = useLocation();

	useEffect(() => {
		// Scroll to anchor if hash is present
		if (location.hash) {
			const el = document.getElementById(location.hash.replace('#', ''));
			if (el) {
				el.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			window.scrollTo(0, 0);
		}
	}, [location]);

	return (
		<div className="min-h-screen bg-background">
			<Hero />
			<About />
			<CurrencyExchange />
			<DiveSites />
			<Courses />
			<FunDiving />
			<Gallery />
			<section id="contact" className="py-20 bg-gray-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<BookingInquiryForm />
				</div>
			</section>
		</div>
	);
};

export default Index;
