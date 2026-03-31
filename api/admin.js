// Combined admin handler for /api/admin
export default async function handler(req, res) {
  const { action } = req.query;

  if (action === 'reset-password') {
    // TODO: Move logic from /api/admin/reset-password.js here
    return res.status(200).json({ message: 'Password reset' });
  }
  if (action === 'user-roles') {
    // TODO: Move logic from /api/admin/user-roles.js here
    return res.status(200).json({ message: 'User roles' });
  }
  res.status(400).json({ error: 'Unknown admin action' });
}
