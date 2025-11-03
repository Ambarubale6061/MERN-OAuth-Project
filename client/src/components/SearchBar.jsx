import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    onSearch(term.trim());
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Search images..." className="flex-1 p-2 border rounded" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </form>
  );
}
