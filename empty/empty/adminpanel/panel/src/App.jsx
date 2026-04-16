import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Counter from './Counter.jsx';
import Bookings from './Bookings.jsx';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: 200, background: '#f4f4f4', padding: 24 }}>
          <h2>Admin</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bookings">Bookings</Link></li>
            <li><Link to="/counter">Counter</Link></li>
          </ul>
        </nav>
        <main style={{ flex: 1, padding: 32 }}>
          <Routes>
            <Route path="/" element={
              <>
                <h1>Admin Panel</h1>
                <p>Welcome to your basic React admin panel. Start building your dashboard here!</p>
              </>
            } />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/counter" element={<Counter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
