import React, { useState } from 'react';
import { Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CourseRecommender from './CourseRecommender';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Courses = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isDutch = i18n.language.startsWith('nl');

  const parsePriceMajor = (priceLabel: string) => {
    const digits = priceLabel.replace(/[^\d]/g, '');
    return digits ? Number(digits) : 0;
  };

  const courses = [
    {
      key: 'openWater',
      path: '/courses/open-water',
      title: t('courses.openWater.title'),
      level: t('courses.openWater.level'),
      duration: t('courses.openWater.duration'),
      maxDepth: t('courses.openWater.maxDepth'),
      price: t('courses.openWater.price'),
      description: t('courses.openWater.description'),
      fullDescription: t('courses.openWater.fullDescription'),
      includes: t('courses.openWater.includes', { returnObjects: true }),
      whatsNext: t('courses.openWater.whatsNext'),
      courseImages: t('courses.openWater.courseImages', { returnObjects: true }),
      icon: "🤿",
      depositMajor: 2000,
      depositCurrency: 'THB'
    },
    {
      key: 'advanced',
      path: '/courses/advanced',
      title: t('courses.advanced.title'),
      level: t('courses.advanced.level'),
      duration: t('courses.advanced.duration'),
      maxDepth: t('courses.advanced.maxDepth'),
      price: t('courses.advanced.price'),
      description: t('courses.advanced.description'),
      fullDescription: t('courses.advanced.fullDescription'),
      includes: t('courses.advanced.includes', { returnObjects: true }),
      courseImages: t('courses.advanced.courseImages', { returnObjects: true }),
      icon: "🌊",
      depositMajor: 2500,
      depositCurrency: 'THB'
    },
    {
      key: 'efr',
      path: '/courses/efr',
      title: t('courses.efr.title'),
      level: t('courses.efr.level'),
      duration: t('courses.efr.duration'),
      maxDepth: t('courses.efr.maxDepth'),
      price: t('courses.efr.price'),
      description: t('courses.efr.description'),
      fullDescription: t('courses.efr.fullDescription'),
      includes: t('courses.efr.includes', { returnObjects: true }),
      courseImages: t('courses.efr.courseImages', { returnObjects: true }),
      icon: "🏥",
      depositMajor: 500,
      depositCurrency: 'THB'
    },
    {
      key: 'rescue',
      path: '/courses/rescue',
      title: t('courses.rescue.title'),
      level: t('courses.rescue.level'),
      duration: t('courses.rescue.duration'),
      maxDepth: t('courses.rescue.maxDepth'),
      price: t('courses.rescue.price'),
      description: t('courses.rescue.description'),
      fullDescription: t('courses.rescue.fullDescription'),
      includes: t('courses.rescue.includes', { returnObjects: true }),
      courseImages: t('courses.rescue.courseImages', { returnObjects: true }),
      icon: "🚨",
      depositMajor: 3000,
      depositCurrency: 'THB'
    },
    {
      key: 'divemaster',
      path: '/courses/divemaster',
      title: t('courses.divemaster.title'),
      level: t('courses.divemaster.level'),
      duration: t('courses.divemaster.duration'),
      maxDepth: t('courses.divemaster.maxDepth'),
      price: t('courses.divemaster.price'),
      description: t('courses.divemaster.description'),
      fullDescription: t('courses.divemaster.fullDescription'),
      includes: t('courses.divemaster.includes', { returnObjects: true }),
      courseImages: t('courses.divemaster.courseImages', { returnObjects: true }),
      icon: "👨‍🏫",
      depositMajor: 5000,
      depositCurrency: 'THB'
    },
    {
      key: 'instructor',
      path: '/courses/instructor',
      title: t('courses.instructor.title'),
      level: t('courses.instructor.level'),
      duration: t('courses.instructor.duration'),
      maxDepth: t('courses.instructor.maxDepth'),
      price: t('courses.instructor.price'),
      description: t('courses.instructor.description'),
      fullDescription: t('courses.instructor.fullDescription'),
      includes: t('courses.instructor.includes', { returnObjects: true }),
      courseImages: t('courses.instructor.courseImages', { returnObjects: true }),
      icon: "🎓",
      depositMajor: 10000,
      depositCurrency: 'THB'
    },
    {
      key: 'discoverScuba',
      path: '/courses/discover-scuba',
      title: isDutch ? 'Discover Scuba Diving (DSD)' : 'Discover Scuba Diving (DSD)',
      level: isDutch ? 'Beginner' : 'Beginner',
      duration: isDutch ? '1 dag' : '1 day',
      maxDepth: '12m',
      price: '฿2,500',
      description: isDutch
        ? 'Geen brevet nodig. De ideale eerste stap om veilig kennis te maken met duiken.'
        : 'No certification required. The perfect first step to experience scuba diving safely.',
      fullDescription: isDutch
        ? 'Discover Scuba Diving is ontworpen voor beginners. Je leert basisvaardigheden in een veilige omgeving en maakt daarna je eerste buitenwaterduik met een professional.'
        : 'Discover Scuba Diving is designed for beginners. You learn core skills in a safe environment and then complete your first open water dive with a professional.',
      includes: isDutch
        ? ['Gecertificeerde duikprofessional', 'Alle uitrusting inbegrepen', 'Kleine groepen (max 4)', 'Extra duiken mogelijk']
        : ['Certified scuba dive professional', 'All equipment included', 'Small groups (max 4)', 'Additional dives available'],
      courseImages: ['photo-1659518893171-b15e20a8e201.avif'],
      icon: '🐠',
      depositMajor: 1000,
      depositCurrency: 'THB',
      bookingType: 'dive'
    },
    {
      key: 'discoverScubaDeluxe',
      path: '/courses/discover-scuba-deluxe',
      title: isDutch ? 'Discover Scuba Diving Deluxe' : 'Discover Scuba Diving Deluxe',
      level: isDutch ? 'Beginner' : 'Beginner',
      duration: isDutch ? '1-2 dagen' : '1-2 days',
      maxDepth: '12m',
      price: '฿5,000',
      description: isDutch
        ? 'Uitgebreide DSD met 3 duiken voor meer onderwatertijd en een relaxter tempo.'
        : 'Extended DSD with 3 dives for more underwater time and a more relaxed pace.',
      fullDescription: isDutch
        ? 'DSD Deluxe bevat zwembad/confined training plus een kustduik en twee bootduiken rond Koh Tao. Perfect als je meer ervaring wilt voordat je beslist over Open Water.'
        : 'DSD Deluxe includes confined training plus one shore dive and two boat dives around Koh Tao. Ideal if you want more experience before deciding on Open Water.',
      includes: isDutch
        ? ['3 begeleide duiken', 'Alle uitrusting inbegrepen', 'Gecertificeerde instructeur', 'Kleine groepen (max 4)']
        : ['3 guided dives', 'All equipment included', 'Certified instructor', 'Small groups (max 4)'],
      courseImages: ['photo-1682687982423-295485af248a.avif'],
      icon: '🌊',
      depositMajor: 1500,
      depositCurrency: 'THB',
      bookingType: 'dive'
    }
  ];

  const getLevelColor = (level: string) => {
    const levelColors: { [key: string]: string } = {
      [t('courses.openWater.level')]: 'bg-green-100 text-green-800 border-green-200',
      [t('courses.advanced.level')]: 'bg-blue-100 text-blue-800 border-blue-200',
      [t('courses.efr.level')]: 'bg-pink-100 text-pink-800 border-pink-200',
      [t('courses.rescue.level')]: 'bg-orange-100 text-orange-800 border-orange-200',
      [t('courses.divemaster.level')]: 'bg-purple-100 text-purple-800 border-purple-200',
      [t('courses.instructor.level')]: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return levelColors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <section id="courses" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 sm:px-[24px]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('courses.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        <CourseRecommender />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {courses.map((course, index) => (
            <div
              key={index}
              id={`course-${course.key}`}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 scroll-mt-20"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{course.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{course.price}</div>
                  <div className="text-sm text-gray-500">{t('courses.perPerson')}</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  {t('courses.duration')}: {course.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="h-4 w-4 mr-2 text-blue-600 font-bold">📏</div>
                  {t('courses.maxDepth')}: {course.maxDepth}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t('courses.courseIncludes')}:</h4>
                <ul className="space-y-2">
                  {(course.includes as string[]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {course.fullDescription && (
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="details" className="border-blue-200">
                    <AccordionTrigger className="text-blue-600 hover:text-blue-700 hover:no-underline">
                      {t('courses.readMore', 'Read more about this course')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-600 space-y-4 pt-2">
                        {(course.fullDescription as string).split('\n\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                        {course.courseImages && (course.courseImages as string[]).length > 0 && (
                          <div className="my-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {(course.courseImages as string[]).map((image, idx) => (
                                <img
                                  key={idx}
                                  src={`/images/${image}`}
                                  alt={`${course.title} - underwater scene ${idx + 1}`}
                                  className="rounded-lg object-cover h-40 w-full"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {course.whatsNext && (
                          <p className="text-blue-600 font-semibold italic mt-4">
                            {course.whatsNext}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Link to={course.path} className="flex-1">
                    <Button variant="outline" className="w-full">{t('courses.viewCourse', 'View course')}</Button>
                  </Link>
                  <button
                    onClick={() => navigate(`/booking?item=${encodeURIComponent(course.title)}&type=${course.bookingType || 'course'}&price=${parsePriceMajor(course.price)}&currency=${course.depositCurrency}`)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    {t('courses.bookButton')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">{t('courses.specialOffers.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-blue-700 rounded-lg p-6">
              <h4 className="font-bold text-xl mb-2">{t('courses.specialOffers.combo.title')}</h4>
              <p className="text-blue-200 mb-3">{t('courses.specialOffers.combo.description')}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{t('courses.specialOffers.combo.price')}</span>
                <span className="text-blue-300 line-through">{t('courses.specialOffers.combo.originalPrice')}</span>
              </div>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h4 className="font-bold text-xl mb-2">{t('courses.specialOffers.group.title')}</h4>
              <p className="text-blue-200 mb-3">{t('courses.specialOffers.group.description')}</p>
              <div className="text-2xl font-bold">{t('courses.specialOffers.group.discount')}</div>
            </div>
          </div>
        </div>
      </div>

        {/* Booking now handled on dedicated /booking page */}
    </section>
  );
};

export default Courses;
