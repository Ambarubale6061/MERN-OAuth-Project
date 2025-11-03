import React, { useEffect, useState } from 'react';
import API from '../api';

const History = ({ user }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;
    API.get('/history').then(r => setHistory(r.data)).catch(() => {});
  }, [user]);

  if (!user) return <div className="text-center mt-12">Please login to see history.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Your search history</h3>
      <ul className="mt-3">
        {history.map((h, i) => (
          <li key={i} className="flex justify-between border-b py-2">
            <span>{h.term}</span>
            <span className="text-xs text-gray-500">{new Date(h.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
