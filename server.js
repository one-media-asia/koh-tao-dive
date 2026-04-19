// Production Express server for serving Vite build and API
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API routes (add your API endpoints here)
// Example: app.use('/api', require('./api'));

// Fallback: serve index.html for any unknown route (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
