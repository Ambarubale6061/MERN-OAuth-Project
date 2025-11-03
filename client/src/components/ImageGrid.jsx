import React from 'react';

export default function ImageGrid({ results = [], selected = {}, onToggle }){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
      {results.map(img => (
        <div key={img.id} className="relative bg-gray-100 rounded overflow-hidden">
          <img src={img.thumb} alt={img.alt} className="w-full h-48 object-cover" />
          <label className="absolute top-2 left-2 bg-white/80 p-1 rounded">
            <input type="checkbox" checked={!!selected[img.id]} onChange={()=>onToggle(img.id)} />
          </label>
        </div>
      ))}
    </div>
  );
}
