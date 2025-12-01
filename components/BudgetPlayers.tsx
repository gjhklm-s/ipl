import React, { useState } from 'react';
import { Lock, Unlock, DollarSign } from 'lucide-react';

const BudgetPlayers = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");

  const playerPoints: Record<string, number> = {
    "Shai Hope": 6, "Shahbaz Ahmed":7, "Rahmanullah Gurbaz": 7,
    "Anuj Rawat": 7, "Kane Williamson": 6, "Lalit Yadav":6,
    "Devdutt Padikkal": 7, "Kedar Jadhav": 6, "Manish Pandey": 7,
    "Harshal Patel": 8, "Ayush Badoni": 7, "Abdul Samad": 7,
    "Sarfaraz Khan": 6, "Nitish Rana": 6, "Yash Dayal": 8,
    "Kyle Mayers": 7, "Harry Brook":7, "Lockie Ferguson":6, 
    "Nuwan Thushara":7, "Khaleel Ahmed":7
  };

  const playerPrice: Record<string, number> = {
    "Shai Hope": 1, "Shahbaz Ahmed":1.5, "Rahmanullah Gurbaz": 2.25,
    "Anuj Rawat": 2.5, "Kane Williamson": 1, "Lalit Yadav":0.50,
    "Devdutt Padikkal": 2, "Kedar Jadhav": 0.25, "Manish Pandey": 2.25,
    "Harshal Patel": 3, "Ayush Badoni": 1.5, "Abdul Samad": 2,
    "Sarfaraz Khan": 0.75, "Nitish Rana": 1, "Yash Dayal": 3.25,
    "Kyle Mayers": 2, "Harry Brook":1.50, "Lockie Ferguson":0.50, 
    "Nuwan Thushara":2, "Khaleel Ahmed":2
  };

  const unlock = () => {
    if (pwd === "77") setIsUnlocked(true);
    else alert("Incorrect Password");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-8 min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic text-[#11141C] font-bebas tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
          BUDGET PICKS
        </h1>
        <p className="text-gray-500">High value, low cost. The secret weapon for smart teams.</p>
      </div>

      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <Lock size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-4">Content Locked</h3>
          <div className="flex gap-2">
            <input 
              type="password" 
              className="border border-gray-300 rounded px-3 py-2 text-center"
              placeholder="Admin PIN"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
            />
            <button onClick={unlock} className="bg-teal-600 text-white px-4 py-2 rounded font-bold hover:bg-teal-700">Unlock</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.keys(playerPoints).map((name) => (
            <div key={name} className="bg-white rounded-xl shadow-md border border-teal-100 p-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded">
                  {playerPoints[name]} Pts
                </div>
                {playerPrice[name] <= 1 && <div className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">STEAL</div>}
              </div>
              <h3 className="font-bold text-gray-800 leading-tight mb-2 h-10 flex items-center">{name}</h3>
              <div className="border-t border-gray-100 pt-2 flex items-center gap-1 text-lg font-black text-teal-600">
                <DollarSign size={16} /> {playerPrice[name]} <span className="text-xs font-normal text-gray-400">Cr</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetPlayers;