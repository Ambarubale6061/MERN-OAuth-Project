import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import API from "./api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import TopBanner from "./components/TopBanner";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login check
    API.get("/auth/user")
      .then((r) => {
        setUser(r.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await API.get("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌟 Navbar */}
      <nav className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg text-blue-600">
            🖼️ ImageSearch
          </Link>
          {user && (
            <Link
              to="/history"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              History
            </Link>
          )}
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
              )}
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* 🌍 Top Searches Banner */}
      <TopBanner />

      {/* 🧭 Page Routes */}
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
