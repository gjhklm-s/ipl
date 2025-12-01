import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { Eye, EyeOff, Gavel, Clock, Trophy, Lock, Play, Pause, RotateCcw } from 'lucide-react';

const Round1 = () => {
  const [view, setView] = useState<'reveal' | 'bidding'>('reveal');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // --- STATE FOR HIDE & SEEK ---
  const [playerSet, setPlayerSet] = useState(1);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Data from your HTML
  const playersSet1 = [
    { name: "Jos Buttler", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201257.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/jos_silhouette.png", clue: "The explosive wicketkeeper-batsman! Role: WK Batsman, Nation: England", password: "p" },
    { name: "Deepak Chahar", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201626.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/deep11.png", clue: "Role: Fast Bowling Batsman", password: "pa" },
    { name: "Krishnappa Gowtham", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200239.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/gowthan11.png", clue: "Role: Off spinning batsman", password: "pas" },
    { name: "Sunil Narine", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193027.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/sunil11.png", clue: "Role: Spinner and Batsman", password: "pass" },
    { name: "T. Natarajan", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201334.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/tnat11.png", clue: "Role: Bowler, Style: Yorker King", password: "passi" },
    { name: "David Warner", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183648.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/war11.png", clue: "Role: Batsman, Nation: Australia", password: "passin" },
    { name: "Venkatesh Iyer", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193524.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/yer11.png", clue: "Role: All-Rounder, Style: LHB", password: "passing" },
    { name: "Mohammad Siraj", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201314.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/siraj11.png", clue: "Role: Right Arm Fast, Nation: India", password: "passing1" },
    { name: "Matheesha Pathirana", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201013.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/pathi11.png", clue: "Role: Right Arm Fast, Action: Sling", password: "pass2" },
    { name: "Ravi Bishnoi", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195806.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/ravi11.png", clue: "Role: Leg Spinner", password: "pass3" },
  ];

  const playersSet2 = [
    { name: "Daryl Mitchell", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183745.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/daral.png", clue: "Identify the player from the silhouette.", password: "a" },
    { name: "KS Bharat", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141736.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/ks.png", clue: "Identify the player from the silhouette.", password: "s" },
    { name: "Mayank Markande", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200014.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/markanda.png", clue: "Identify the player from the silhouette.", password: "w" },
    { name: "Mayank Agarwal", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204108.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/mayank.png", clue: "Identify the player from the silhouette.", password: "aswa" },
    { name: "Rahul Tewatia", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193422.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/tewata.png", clue: "Identify the player from the silhouette.", password: "t" },
    { name: "Tim David", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185037.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/tim.png", clue: "Identify the player from the silhouette.", password: "h" },
    { name: "Travis Head", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184945.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/head.png", clue: "Identify the player from the silhouette.", password: "b" },
    { name: "Rahul Chahar", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195905.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/rahul.png", clue: "Identify the player from the silhouette.", password: "r" },
    { name: "Mohammad Rizwan", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183808.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-17.215258.png", clue: "Identify the player from the silhouette.", password: "o" },
    { name: "Rinku Singh", image: "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185434.png", silhouette: "https://github.com/gjhklm-s/advance/releases/download/qdk/rinku.png", clue: "Identify the player from the silhouette.", password: "hi" },
  ];

  const currentList = playerSet === 1 ? playersSet1 : playersSet2;
  const currentPlayer = currentList[playerIndex];

  const handleReveal = () => {
    if (passwordInput === currentPlayer.password) {
      setIsRevealed(true);
    } else {
      alert("Incorrect Password!");
    }
  };

  const handleNext = () => {
    if (playerIndex < currentList.length - 1) {
      setPlayerIndex(prev => prev + 1);
      setIsRevealed(false);
      setPasswordInput("");
    }
  };

  const handlePrev = () => {
    if (playerIndex > 0) {
      setPlayerIndex(prev => prev - 1);
      setIsRevealed(false);
      setPasswordInput("");
    }
  };

  // --- STATE FOR BIDDING ---
  const [currentUser, setCurrentUser] = useState("Karan");
  const [currentBid, setCurrentBid] = useState(0);
  const [totalBid, setTotalBid] = useState(0);
  const [lastBidder, setLastBidder] = useState("None");
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [activeTimers, setActiveTimers] = useState<Record<string, boolean>>({});

  const users = [
    "Karan", "Selva", "Koushik", "Manoj", "Avenash", "Shanio", "Rohit", 
    "Abdul", "Aswath", "Varshan", "rrk", "Gokul", "Jerwin"
  ];

  useEffect(() => {
    const bidRef = db.ref('auction');
    bidRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentBid(data.currentBid || 0);
        setTotalBid(data.totalBid || 0);
        setLastBidder(data.lastBidder || "None");
      }
    });
    return () => bidRef.off();
  }, []);

  const startTimer = (user: string) => {
    if (activeTimers[user]) return;
    
    // Random duration between 2 and 5 seconds
    const duration = Math.floor(Math.random() * 4) + 2; 
    setTimers(prev => ({ ...prev, [user]: duration }));
    setActiveTimers(prev => ({ ...prev, [user]: true }));

    const interval = setInterval(() => {
      setTimers(prev => {
        const newVal = prev[user] - 1;
        if (newVal <= 0) {
          clearInterval(interval);
          setActiveTimers(prevActive => ({ ...prevActive, [user]: false }));
          return { ...prev, [user]: 0 };
        }
        return { ...prev, [user]: newVal };
      });
    }, 1000);
  };

  const placeBid = (amount: number) => {
    if (activeTimers[currentUser]) {
      alert("⏳ Cooldown active!");
      return;
    }

    const newTotal = parseFloat((totalBid + amount).toFixed(2));
    
    db.ref('auction').update({
      currentBid: amount,
      totalBid: newTotal,
      lastBidder: currentUser
    });

    startTimer(currentUser);
  };

  const resetAuction = () => {
    const pwd = prompt("Enter Admin Password to Reset:");
    const passwords = ["our", "s", "play", "183"]; // From your HTML
    
    if (passwords.includes(pwd || "")) {
      alert(`🎉 SOLD to ${lastBidder} for ₹${totalBid} Cr!`);
      db.ref('auction').update({
        currentBid: 0,
        totalBid: 0,
        lastBidder: "None"
      });
    } else {
      alert("Incorrect Password");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
      
      {/* LEFT COLUMN: PLAYER REVEAL (HIDE & SEEK) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border-2 border-purple-500 overflow-hidden relative">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <h2 className="text-xl font-black italic font-bebas tracking-wider flex items-center gap-2">
              <Eye size={24} /> Hide & Seek
            </h2>
            <div className="flex gap-2">
               <button onClick={() => setPlayerSet(1)} className={`px-3 py-1 rounded-full text-xs font-bold ${playerSet === 1 ? 'bg-white text-purple-700' : 'bg-purple-800 text-purple-300'}`}>Set 1</button>
               <button onClick={() => setPlayerSet(2)} className={`px-3 py-1 rounded-full text-xs font-bold ${playerSet === 2 ? 'bg-white text-purple-700' : 'bg-purple-800 text-purple-300'}`}>Set 2</button>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden shadow-inner flex items-center justify-center mb-6 border border-gray-200">
               {/* Image Display Logic */}
               {!isRevealed ? (
                  <img 
                    src={currentPlayer.silhouette || currentPlayer.image} 
                    className="h-full w-auto object-contain filter brightness-0 invert" // CSS filter to simulate silhouette if explicit silhouette image fails
                    alt="Hidden Player"
                  />
               ) : (
                  <img 
                    src={currentPlayer.image} 
                    className="h-full w-full object-cover object-top" 
                    alt="Revealed Player"
                  />
               )}
               
               {!isRevealed && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm text-white p-6 text-center">
                    <p className="text-lg font-bold mb-4">{currentPlayer.clue}</p>
                    <div className="flex gap-2">
                       <input 
                          type="password" 
                          placeholder="Password" 
                          className="px-3 py-2 rounded text-black text-center w-32"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                       />
                       <button onClick={handleReveal} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold">
                          Reveal
                       </button>
                    </div>
                 </div>
               )}
            </div>

            {/* Navigation & Info */}
            <div className="w-full flex justify-between items-center">
               <button onClick={handlePrev} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><RotateCcw size={20}/></button>
               <div className="text-center">
                  <h3 className="text-2xl font-black text-purple-700 font-bebas uppercase">
                     {isRevealed ? currentPlayer.name : "WHO IS THIS?"}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase">Player {playerIndex + 1} of {currentList.length}</p>
               </div>
               <button onClick={handleNext} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Play size={20}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AUCTION ROOM */}
      <div className="lg:col-span-7 space-y-6">
         {/* Auction Monitor */}
         <div className="bg-[#11141C] text-white rounded-xl shadow-2xl border-4 border-yellow-500 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Gavel size={120} /></div>
            
            <div className="grid grid-cols-2 gap-8 relative z-10">
               <div>
                  <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Current Bid</p>
                  <div className="text-5xl font-black font-bebas tracking-wide">₹{currentBid} <span className="text-2xl">Cr</span></div>
               </div>
               <div className="text-right">
                  <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Total Price</p>
                  <div className="text-5xl font-black font-bebas tracking-wide text-green-400">₹{totalBid.toFixed(1)} <span className="text-2xl">Cr</span></div>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-end">
               <div>
                  <p className="text-gray-400 text-xs font-bold uppercase mb-1">Leading Bidder</p>
                  <div className="text-2xl font-bold flex items-center gap-2">
                     <Trophy className="text-yellow-400" size={24} />
                     {lastBidder}
                  </div>
               </div>
               <button 
                  onClick={resetAuction}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-red-500/50 transition-all"
               >
                  <Gavel size={20} /> SOLD
               </button>
            </div>
         </div>

         {/* Bidding Controls */}
         <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={20} className="text-blue-500"/> Bidder Controls</h3>
               <select 
                  className="bg-gray-100 border-none rounded-lg px-4 py-2 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
               >
                  {users.map(u => <option key={u} value={u}>{u}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
               {[0.2, 0.5, 1.0, 2.0, 5.0].map((amt) => (
                  <button
                     key={amt}
                     onClick={() => placeBid(amt)}
                     disabled={activeTimers[currentUser]}
                     className={`py-4 rounded-xl font-black text-xl shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all
                        ${activeTimers[currentUser] 
                           ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                           : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-300 hover:from-blue-100 hover:to-blue-200'
                        }`}
                  >
                     +{amt} <span className="text-sm font-normal">Cr</span>
                  </button>
               ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Status:</span>
                  {activeTimers[currentUser] ? (
                     <span className="text-orange-500 font-bold flex items-center gap-1">
                        <Clock size={14} className="animate-spin" /> Cooldown ({timers[currentUser]}s)
                     </span>
                  ) : (
                     <span className="text-green-600 font-bold flex items-center gap-1">
                        <Play size={14} /> Ready to Bid
                     </span>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Round1;