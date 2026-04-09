// booking-modal.js
// Simple modal logic for all 'Book Now' and 'Inquiry' buttons

function openBookingModal() {
  document.getElementById('booking-modal').style.display = 'block';
}

function closeBookingModal() {
  document.getElementById('booking-modal').style.display = 'none';
}

// Attach to all relevant buttons
document.addEventListener('DOMContentLoaded', function() {
  var triggers = document.querySelectorAll('.book-now-btn, .inquiry-btn');
  triggers.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openBookingModal();
    });
  });
  // Close modal on background or close button
  document.getElementById('booking-modal-close').addEventListener('click', closeBookingModal);
  document.getElementById('booking-modal').addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
  });
});
