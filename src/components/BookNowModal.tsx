import React, { useState } from 'react';
import BookNowForm from '@/components/BookNowForm';

const BookNowModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 540,
          width: '100%',
          minWidth: 320,
          padding: '2.5rem 2rem',
          position: 'relative',
          boxShadow: '0 4px 32px #0003',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#888' }}
          aria-label="Close"
        >
          ×
        </button>
        <BookNowForm />
      </div>
    </div>
  );
};

export default BookNowModal;
