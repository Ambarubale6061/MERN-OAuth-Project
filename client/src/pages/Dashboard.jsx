import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBanner from "../components/TopBanner";

const Dashboard = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const [user, setUser] = useState(null);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/user`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.warn("User not logged in, redirecting...");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // ✅ Logout user
  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Search Unsplash images
  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/api/search`,
        { term: searchTerm },
        { withCredentials: true }
      );
      setResults(res.data.results || []);
      setSelected([]);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(term);
  };

  // ✅ Handle trending term click
  const handleSelectTerm = (selectedTerm) => {
    setTerm(selectedTerm);
    performSearch(selectedTerm);
  };

  // ✅ Select/unselect image
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl text-gray-700 animate-pulse">
          Loading user info...
        </h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <h2 className="font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {user.oauthProvider}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <TopBanner onSelectTerm={handleSelectTerm} />

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 max-w-2xl mx-auto mt-6"
        >
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for stunning Unsplash images..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Selected Count */}
        {selected.length > 0 && (
          <div className="text-center mt-4 text-blue-600 font-medium">
            ✅ Selected: {selected.length} images
          </div>
        )}

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center mt-12 text-gray-600 animate-pulse">
            Loading results...
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
            {results.map((img) => (
              <div
                key={img.id}
                className="relative group cursor-pointer"
                onClick={() => toggleSelect(img.id)}
              >
                <img
                  src={img.urls.small}
                  alt={img.alt_description || "unsplash"}
                  className={`rounded-lg shadow-md w-full h-48 object-cover transition border-2 ${
                    selected.includes(img.id)
                      ? "border-blue-500 scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                />
                {selected.includes(img.id) && (
                  <div className="absolute inset-0 bg-blue-600/30 rounded-lg" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-500">
            Try searching for something like <b>mountains</b> or <b>cats</b> 🏞️
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
