import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Shuffle, Lock } from 'lucide-react';

const Round5 = () => {
  const [idx, setIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [password, setPassword] = useState("");

  const playerImages = [
    'https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193540.png',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_490088569_18001456439768695_4525524293351048898_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_491430393_18001350290768695_2259477103484753254_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_491868918_18002653538768695_1537377626173611678_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_494104229_718105027411928_1050521256886679844_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_494194673_718733947349036_8444252273805831546_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_495058932_723979163491181_5023005265842702707_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_495345737_723341460221618_2290953967261833396_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_495459308_725239050031859_1977130515977294903_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_495501638_18003666383768695_6396392288391071777_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_497537237_18004504490768695_134540762528890572_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_498511639_732839742605123_8884648248905144452_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_499008805_18004852319768695_3609647215273893741_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_499934632_736385015583929_4730952259199687634_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_500737441_737286205493810_4518490242979078069_n.jpg',
    'https://github.com/gjhklm-s/advance/releases/download/qdk/SaveInta.com_502085932_18006357662768695_8591648716050253796_n.jpg'
  ];

  const reveal = () => {
    if (password === "7") {
      setIsRevealed(true);
      setPassword("");
    } else {
      alert("Incorrect Password");
    }
  };

  const next = () => {
    setIdx((prev) => (prev + 1) % playerImages.length);
    setIsRevealed(false);
  };

  const prev = () => {
    setIdx((prev) => (prev - 1 + playerImages.length) % playerImages.length);
    setIsRevealed(false);
  };

  const shuffle = () => {
    setIdx(Math.floor(Math.random() * playerImages.length));
    setIsRevealed(false);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-in zoom-in-95">
      
      {/* Left Panel - Main Viewer */}
      <div className="flex-1 bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-20 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black italic text-emerald-400 font-bebas tracking-wide">FIND WHO?</h2>
            <p className="text-slate-400 text-sm">Player #{idx + 1}</p>
          </div>
          <button onClick={shuffle} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white">
            <Shuffle size={20} />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center bg-radial-gradient from-emerald-900/20 to-[#0f172a] p-8">
          <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center">
            {/* Image */}
            <img 
              src={playerImages[idx]} 
              alt="Mystery Player"
              className={`max-h-full max-w-full object-contain transition-all duration-700 ease-in-out
                ${isRevealed ? 'filter-none scale-100' : 'filter brightness-0 contrast-200 opacity-30 scale-95 blur-sm'}`}
            />
            
            {/* Overlay if hidden */}
            {!isRevealed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center gap-4">
                  <Lock size={32} className="text-emerald-400" />
                  <p className="text-white font-bold">LOCKED</p>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="PIN" 
                      className="w-20 bg-white/10 border border-white/20 rounded px-3 py-2 text-center text-white focus:outline-none focus:border-emerald-500"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button 
                      onClick={reveal} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-bold transition-colors"
                    >
                      Reveal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/5 border-t border-white/10 p-4 flex justify-between items-center">
          <button onClick={prev} className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
            <ArrowLeft />
          </button>
          <div className="text-center">
            <h3 className={`text-2xl font-black font-bebas tracking-wider transition-all duration-500 ${isRevealed ? 'text-white' : 'text-transparent bg-clip-text bg-white/20'}`}>
              {isRevealed ? "PLAYER REVEALED" : "????????"}
            </h3>
          </div>
          <button onClick={next} className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white">
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Right Panel - Grid */}
      <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-gray-700 mb-4 px-2">Gallery</h3>
        <div className="grid grid-cols-2 gap-3">
          {playerImages.map((src, i) => (
            <button 
              key={i}
              onClick={() => { setIdx(i); setIsRevealed(false); }}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative group
                ${idx === i ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={src} className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black font-bebas text-lg opacity-50 group-hover:opacity-100">#{i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Round5;