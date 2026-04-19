const coursePrices = {
  'Open Water': '฿14,900',
  'Advanced Open Water': '฿12,900',
  'Rescue Diver': '฿13,900',
  'Divemaster': '฿35,000',
  'Fun Dive': '฿2,500',
};
function updatePrice() {
  const course = document.getElementById('course_title').value.trim();
  const price = coursePrices[course] || 'Contact us for a quote';
  document.getElementById('display-price').textContent = price;
  const depositSection = document.getElementById('deposit-section');
  const depositAmount = document.getElementById('deposit-amount');
  const paypalLink = document.getElementById('paypal-link');
  if (price.startsWith('฿')) {
    // Extract numeric value
    const numeric = parseInt(price.replace(/[^\d]/g, ''), 10);
    const deposit = Math.round(numeric * 0.2);
    depositAmount.textContent = `฿${deposit}`;
    paypalLink.href = `https://paypal.me/prodivingasia/${deposit}THB`;
    depositSection.style.display = '';
  } else {
    depositSection.style.display = 'none';
  }
}

// Attach event listeners for dynamic price/deposit update
window.addEventListener('DOMContentLoaded', () => {
  const courseSelect = document.getElementById('course_title');
  if (courseSelect) {
    courseSelect.addEventListener('change', updatePrice);
    updatePrice();
  }
});

<div>
  <strong>Course Price:</strong> <span id="display-price"></span>
</div>
<div id="deposit-section" style="display:none;">
  <strong>Deposit (20%):</strong> <span id="deposit-amount"></span>
  <a id="paypal-link" href="#" target="_blank" rel="noopener">Pay Deposit via PayPal</a>
</div>
