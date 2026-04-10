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
          color: '#222',
          borderRadius: 18,
          maxWidth: 700,
          width: '100%',
          minWidth: 340,
          padding: '3rem 2.5rem',
          position: 'relative',
          boxShadow: '0 4px 32px #0003',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', color: '#888' }}
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
