import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firebase';
import { USERS } from '../constants';
import { Timer, Gavel, User, AlertTriangle, Play, RefreshCw } from 'lucide-react';

const Round4 = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [auctionData, setAuctionData] = useState<any>({});
  const [adminPwd, setAdminPwd] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Players Data
  const players = [
    { name: "Tom Latham", points: 6 }, { name: "Sam Billings", points: 6 },
    { name: "Varun Chakravarthy", points: 9 }, { name: "Dwaine Pretorius", points: 6 },
    { name: "Ish Sodhi", points: 6 }, { name: "Kagiso Rabada", points: 9 },
    { name: "Shaheen Afridi", points: 7 }, { name: "Arshdeep Singh", points: 9 },
    { name: "Tom Curran", points: 6 }, { name: "Riyan Parag", points: 8 },
    { name: "Chris Woakes", points: 6 }, { name: "Mitchell Santner", points: 8 },
    { name: "Babar Azam", points: 7 }, { name: "Liam Livingstone", points: 8 },
    { name: "James Neesham", points: 6 }, { name: "Reeza Hendricks", points: 6 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with Firebase
  useEffect(() => {
    const ref = db.ref("dutchAuction/data");
    ref.on("value", snap => {
      const data = snap.val() || {};
      setAuctionData(data);
      if (data.soldTo) {
         setHistory(prev => {
            const entry = `✅ ${data.name} SOLD to ${data.soldTo} for ₹${data.soldPrice} Cr`;
            if(!prev.includes(entry)) return [entry, ...prev];
            return prev;
         });
      } else if (data.running === false && !data.soldTo && data.name) {
         setHistory(prev => {
            const entry = `❌ ${data.name} UNSOLD`;
            if(!prev.includes(entry)) return [entry, ...prev];
            return prev;
         });
      }
    });
    return () => ref.off();
  }, []);

  // Admin Start
  const startAuction = () => {
    if (adminPwd !== "7") {
      alert("Wrong Password");
      return;
    }
    setIsAdmin(true);
    runAuction(currentIndex);
  };

  const runAuction = (idx: number) => {
    if (idx >= players.length) {
      alert("Auction Finished!");
      return;
    }
    const player = players[idx];
    
    // Reset Data
    db.ref("dutchAuction/data").set({
      name: player.name,
      points: player.points,
      price: 25,
      soldTo: "",
      soldPrice: 0,
      running: true
    });

    // Clear previous timer if any
    if(timerRef.current) clearInterval(timerRef.current);

    // Start Decrement Timer
    timerRef.current = setInterval(() => {
      db.ref("dutchAuction/data").transaction((currentData) => {
        if (!currentData) return currentData;
        if (!currentData.running || currentData.soldTo) return currentData;
        
        if (currentData.price > 1) {
          return { ...currentData, price: currentData.price - 1 };
        } else {
          return { ...currentData, price: 0, running: false }; // Unsold
        }
      });
    }, 1500);
  };

  const handleBuy = () => {
    if (!currentUser) {
      alert("Select a user first!");
      return;
    }
    if (!auctionData.running || auctionData.soldTo) return;

    db.ref("dutchAuction/data").transaction((currentData) => {
      if (currentData && currentData.running && !currentData.soldTo) {
        return { ...currentData, soldTo: currentUser, soldPrice: currentData.price, running: false };
      }
      return currentData; // Already sold
    });
  };

  const nextPlayer = () => {
     if(timerRef.current) clearInterval(timerRef.current);
     const nextIdx = currentIndex + 1;
     setCurrentIndex(nextIdx);
     runAuction(nextIdx);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in">
      <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl shadow-2xl overflow-hidden text-white mb-8 border border-orange-500">
        <div className="p-8 text-center relative">
          <div className="absolute top-4 right-4 opacity-20"><Timer size={100}/></div>
          
          <h1 className="text-4xl md:text-6xl font-black italic font-bebas tracking-wide mb-2 drop-shadow-lg">
            DUTCH AUCTION
          </h1>
          <p className="text-orange-100 font-medium">Price drops every second. Be the first to buy!</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-orange-200 mb-2">Current Player</h2>
          <div className="text-5xl font-black mb-4">{auctionData.name || "WAITING..."}</div>
          <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm font-bold mb-8">
             {auctionData.points ? `${auctionData.points} Points` : "-"}
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
             <div className="text-center">
                <div className="text-sm font-bold uppercase text-orange-300 mb-1">Current Price</div>
                <div className={`text-7xl font-black font-bebas transition-all duration-300 ${auctionData.running ? 'text-white scale-110' : 'text-gray-400'}`}>
                   ₹{auctionData.price || 0} <span className="text-3xl">Cr</span>
                </div>
             </div>
          </div>

          <button
            onClick={handleBuy}
            disabled={!auctionData.running || !!auctionData.soldTo}
            className={`w-full max-w-md py-6 rounded-2xl font-black text-3xl uppercase tracking-widest shadow-xl transition-all transform
              ${!auctionData.running 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-white text-red-600 hover:scale-105 hover:shadow-white/20 active:scale-95'}`}
          >
            {auctionData.soldTo ? `SOLD TO ${auctionData.soldTo}` : "BUY NOW"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Controls */}
         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><User size={20}/> User Selection</h3>
            <select 
               className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-700 mb-4"
               value={currentUser}
               onChange={(e) => setCurrentUser(e.target.value)}
            >
               <option value="">-- Select User --</option>
               {USERS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>

            <div className="border-t border-gray-100 pt-4">
               <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Gavel size={20}/> Admin Controls</h3>
               {!isAdmin ? (
                  <div className="flex gap-2">
                     <input 
                        type="password" 
                        placeholder="PIN" 
                        className="flex-1 p-2 border border-gray-300 rounded"
                        value={adminPwd}
                        onChange={e => setAdminPwd(e.target.value)}
                     />
                     <button onClick={startAuction} className="bg-black text-white px-4 rounded font-bold">Start</button>
                  </div>
               ) : (
                  <div className="flex gap-2">
                     <button onClick={nextPlayer} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        <Play size={18} /> Next Player
                     </button>
                     <button onClick={() => runAuction(currentIndex)} className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300">
                        <RefreshCw size={18} />
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* History */}
         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 h-80 overflow-y-auto">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">Auction Feed</h3>
            <div className="space-y-2">
               {history.length === 0 && <p className="text-gray-400 italic text-sm">No history yet.</p>}
               {history.map((h, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm font-bold ${h.includes("SOLD") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                     {h}
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Round4;