// Shared modal state for Book Now buttons
import React, { useState } from 'react';
import BookNowModal from '@/components/BookNowModal';

export function useBookNowModal() {
  const [showBookNow, setShowBookNow] = useState(false);
  const [initialCourseTitle, setInitialCourseTitle] = useState<string | undefined>(undefined);
  const openBookNow = (courseTitle?: string) => {
    setInitialCourseTitle(courseTitle);
    setShowBookNow(true);
  };
  const BookNowModalComponent = (
    <BookNowModal open={showBookNow} onClose={() => setShowBookNow(false)} initialCourseTitle={initialCourseTitle} />
  );
  return { showBookNow, setShowBookNow, openBookNow, BookNowModalComponent };
}
