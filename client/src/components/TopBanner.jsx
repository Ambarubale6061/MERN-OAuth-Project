import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const TopBanner = ({ onSelectTerm }) => {
  const [topSearches, setTopSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-white rounded-2xl p-4 mt-6 shadow-md text-center animate-pulse"
      >
        Loading trending searches...
      </motion.div>
    );

  if (!topSearches.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl mt-6 shadow-lg text-white"
    >
      {/* ✨ Animated Gradient Background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-[length:200%_200%]"
      />

      {/* ✨ Content */}
      <div className="relative z-10 p-5 text-center">
        <h2 className="text-lg font-semibold mb-3 tracking-wide drop-shadow">
          🔥 Trending Searches
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {topSearches.map((item, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTerm && onSelectTerm(item.term)}
              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm hover:bg-white/30 cursor-pointer transition-transform select-none"
            >
              #{item.term}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopBanner;
