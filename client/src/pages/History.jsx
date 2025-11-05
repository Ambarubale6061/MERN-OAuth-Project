import React, { useEffect, useState } from "react";
import { Clock, Search } from "lucide-react";
import API from "../api";

const History = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const res = await API.get("/history");
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-gray-300">
        <Search
          size={56}
          className="opacity-60 mb-4 text-purple-400 animate-pulse"
        />
        <p className="text-lg tracking-wide">
          Please log in to view your search history.
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="text-gray-300 animate-pulse text-xl">
          Fetching your data...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex justify-center items-center p-6">
      <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] p-8 overflow-hidden">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-blue-500 to-purple-600 opacity-30 blur-3xl animate-pulse -z-10" />

        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="text-purple-400" size={32} />
          Search History
        </h2>

        {history.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Search
              className="mx-auto mb-4 text-purple-300 opacity-70"
              size={40}
            />
            <p className="text-lg">No search history found.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((h, i) => (
              <li
                key={i}
                className="group relative flex justify-between items-center bg-white/5 border border-white/10 hover:border-purple-400/40 hover:bg-white/10 transition-all duration-300 p-4 rounded-xl cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
                <span className="font-medium text-white tracking-wide z-10">
                  {h.term}
                </span>
                <span className="text-xs text-gray-400 z-10">
                  {new Date(h.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default History;
