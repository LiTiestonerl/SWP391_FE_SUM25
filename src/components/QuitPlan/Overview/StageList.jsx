import React from 'react';

const StageList = ({ stages }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <h3 className="font-semibold text-emerald-700 mb-4">Stages</h3>
    {stages?.length ? (
      <ul className="space-y-2 text-sm">
        {stages.map((s,i)=>(
          <li key={i} className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium text-gray-800">{s.name}</div>
              <div className="text-xs text-gray-500">{s.start} ➜ {s.end}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${s.status==='Done'?'bg-emerald-100 text-emerald-700':'bg-yellow-100 text-yellow-700'}`}>
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    ) : <p className="text-sm text-gray-500">No stages yet.</p>}
  </div>
);
export default StageList;
