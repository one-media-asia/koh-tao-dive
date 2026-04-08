import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tryAutoScroll } from '@/lib/scroll';
import Hero from '../components/Hero';
import DiveSites from '../components/DiveSites';
import Courses from '../components/Courses';
import Gallery from '../components/Gallery';
import About from '../components/About';
// import BookingInquiryForm from '../components/BookingInquiryForm';
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
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
						{/* Contact Info Left */}
						<div>
							<h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
							<p className="text-xl text-gray-300 mb-8">Ready to explore the underwater world? Contact Bas to book your diving adventure on Koh Tao.</p>
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<span className="inline-block h-6 w-6 text-blue-400 mt-1">📍</span>
									<div>
										<h4 className="font-semibold text-lg">Location</h4>
										<p className="text-gray-300">Sairee Beach, Koh Tao<br />Surat Thani 84360, Thailand</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<span className="inline-block h-6 w-6 text-blue-400 mt-1">📞</span>
									<div>
										<h4 className="font-semibold text-lg">Phone</h4>
										<p className="text-gray-300">+66 77 456 789</p>
										<p className="text-gray-300">+66 89 123 4567</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<span className="inline-block h-6 w-6 text-blue-400 mt-1">✉️</span>
									<div>
										<h4 className="font-semibold text-lg">Email</h4>
										<p className="text-gray-300">contact@divinginasia.com</p>
									</div>
								</div>
								<div className="flex items-start space-x-4">
									<span className="inline-block h-6 w-6 text-blue-400 mt-1">⏰</span>
									<div>
										<h4 className="font-semibold text-lg">Opening Hours</h4>
										<p className="text-gray-300">Daily: 07:00 - 19:00</p>
										<p className="text-gray-300">Emergency: 24/7</p>
									</div>
								</div>
							</div>
							<div className="mt-8">
								<h4 className="font-semibold text-lg mb-4">Follow Us</h4>
								<div className="flex space-x-4">
									<a href="https://www.facebook.com/divegoprobybas/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook" className="text-blue-400 hover:text-blue-300 transition-colors text-2xl">&#x1F426;</a>
									<a href="https://www.instagram.com/pro_diving_asia/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="text-pink-400 hover:text-pink-300 transition-colors text-2xl">&#x1F33A;</a>
									<a href="https://wa.me/66612345678" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp" className="text-green-400 hover:text-green-300 transition-colors text-2xl">&#x1F4AC;</a>
								</div>
							</div>
						</div>
						{/* Contact Form Right */}
						<div className="bg-white rounded-lg p-8 shadow-lg" style={{ color: '#222' }}>
							<h3 className="text-2xl font-bold mb-6 text-center">Booking / Inquiry Form</h3>
							<form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
								<input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
								<label htmlFor="name" className="block font-semibold">Name</label>
								<input type="text" id="name" name="name" required className="w-full border border-gray-300 rounded px-3 py-2" />

								<label htmlFor="email" className="block font-semibold">Email</label>
								<input type="email" id="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2" />

								<label htmlFor="phone" className="block font-semibold">Phone</label>
								<input type="text" id="phone" name="phone" className="w-full border border-gray-300 rounded px-3 py-2" />

								<label htmlFor="course_title" className="block font-semibold">Course / Package</label>
								<input type="text" id="course_title" name="course_title" className="w-full border border-gray-300 rounded px-3 py-2" />

								<label htmlFor="preferred_date" className="block font-semibold">Preferred Date</label>
								<input type="date" id="preferred_date" name="preferred_date" className="w-full border border-gray-300 rounded px-3 py-2" />

								<label htmlFor="experience_level" className="block font-semibold">Experience Level</label>
								<select id="experience_level" name="experience_level" className="w-full border border-gray-300 rounded px-3 py-2">
									<option value="">Select...</option>
									<option value="beginner">Beginner</option>
									<option value="intermediate">Intermediate</option>
									<option value="professional">Professional</option>
								</select>

								<label htmlFor="message" className="block font-semibold">Comments / Questions</label>
								<textarea id="message" name="message" rows={4} required className="w-full border border-gray-300 rounded px-3 py-2"></textarea>

								<button type="submit" className="w-full mt-4 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition">Send Booking</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Index;
