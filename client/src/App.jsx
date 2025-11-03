import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import API from './api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/auth/user').then(r => setUser(r.data)).catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await API.get('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold">ImageSearch</Link>
          {user && <Link to="/history" className="text-sm text-gray-600">History</Link>}
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.profilePic} alt="avatar" className="w-8 h-8 rounded-full" />
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-blue-600 text-white rounded">Login</Link>
          )}
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </div>
  );
}
