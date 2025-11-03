import React, { useEffect, useState } from "react";
import axios from "axios";

const TopBanner = () => {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001"; // ✅ Correct backend port

  useEffect(() => {
    const fetchTopSearches = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/top-searches`, {
          withCredentials: true,
        });
        setTopSearches(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching top searches:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSearches();
  }, []);

  if (loading)
    return (
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mt-6 shadow-md text-center animate-pulse">
        Loading trending searches...
      </div>
    );

  if (!topSearches.length) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-center">
        🔥 Trending Searches
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {topSearches.map((item, index) => (
          <span
            key={index}
            className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 cursor-pointer transition"
          >
            {item.term}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;
