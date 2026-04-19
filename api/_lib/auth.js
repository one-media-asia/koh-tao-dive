// Minimal requireAdmin for local development
// Always returns a mock admin user object

async function requireAdmin(req, res) {
  // In production, add real authentication logic here
  return { id: 'local-admin', email: 'admin@localhost', role: 'admin' };
}

module.exports = { requireAdmin };