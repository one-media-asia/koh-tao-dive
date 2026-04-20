import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      onLogin(data.token);
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Login</button>
    </form>
  );
};

const AdminPanel = () => {
  const [token, setToken] = useState(null);

  if (!token) {
    return <AdminLogin onLogin={setToken} />;
  }

  // Placeholder for admin dashboard
  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p>Welcome, admin!</p>
      {/* Add bookings/pages management UI here */}
      <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={() => setToken(null)}>Logout</button>
    </div>
  );
};

export default AdminPanel;