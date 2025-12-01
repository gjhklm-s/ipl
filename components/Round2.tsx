import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { Eye, EyeOff, Send, Trash2, Lock, Unlock, AlertCircle } from 'lucide-react';
import { USERS } from '../constants';

const Round2 = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  // User Mode State
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [lastTrigger, setLastTrigger] = useState(0);

  // Admin Mode State
  const [allAmounts, setAllAmounts] = useState<Record<string, { amount: number }>>({});

  // Fetch Current User from Firebase (if strictly needed, otherwise local select)
  useEffect(() => {
    const userRef = db.ref("currentUser/username");
    userRef.on("value", snapshot => {
       if(snapshot.exists()) setSelectedUser(snapshot.val());
    });
    
    // Listen for "Show All" trigger
    const triggerRef = db.ref("showAllTrigger");
    triggerRef.on("value", snapshot => {
       if (snapshot.exists()) {
          const val = snapshot.val();
          if (val.timestamp > lastTrigger) {
             setLastTrigger(val.timestamp);
             alert(val.message); // Native alert as per original requirement, or custom UI
          }
       }
    });

    return () => { userRef.off(); triggerRef.off(); };
  }, [lastTrigger]);

  // Admin Listener
  useEffect(() => {
     if (!isAdmin) return;
     const amountsRef = db.ref("amounts");
     amountsRef.on("value", snapshot => {
        if(snapshot.exists()) setAllAmounts(snapshot.val());
        else setAllAmounts({});
     });
     return () => amountsRef.off();
  }, [isAdmin]);

  const handleSubmit = async () => {
    if (!selectedUser || !amount) {
       alert("Please select a user and enter an amount.");
       return;
    }
    const val = parseFloat(amount);
    if (val <= 0) {
       alert("Enter a valid amount.");
       return;
    }

    try {
       // Check existing
       const snap = await db.ref("amounts").once("value");
       const data = snap.val() || {};
       
       if (data[selectedUser]) {
          alert("You have already submitted!");
          return;
       }
       if (Object.values(data).some((e: any) => e.amount === val)) {
          alert("This amount is already taken! Choose another.");
          return;
       }

       await db.ref(`amounts/${selectedUser}`).set({ amount: val });
       alert("Amount submitted successfully!");
       setAmount("");
    } catch (e) {
       console.error(e);
    }
  };

  const toggleAdmin = () => {
     if (isAdmin) {
        setIsAdmin(false);
        setAdminPassword("");
     } else {
        if (adminPassword === "7") setIsAdmin(true);
        else alert("Wrong Password");
     }
  };

  const broadcastResults = () => {
     const sorted = Object.entries(allAmounts).sort((a, b) => b[1].amount - a[1].amount);
     if (sorted.length === 0) return;

     const msg = `🏆 WINNER: ${sorted[0][0]} (₹${sorted[0][1].amount})\n\n` + 
                 sorted.map(([u, d]) => `${u}: ₹${d.amount}`).join("\n");
     
     db.ref("showAllTrigger").set({
        message: msg,
        timestamp: Date.now()
     });
  };

  const clearData = () => {
     if (window.confirm("Delete ALL submissions?")) {
        db.ref("amounts").remove();
     }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
         <h1 className="text-4xl font-black italic font-bebas text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            HIDDEN PRICE CHALLENGE
         </h1>
         <p className="text-gray-500">Submit your secret bid. Unique highest bid wins!</p>
      </div>

      {/* SUBMISSION CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-yellow-500"></div>
         <div className="p-8 md:p-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="block font-bold text-gray-700">Select Your Identity</label>
                  <select 
                     value={selectedUser}
                     onChange={(e) => setSelectedUser(e.target.value)}
                     className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:border-pink-500 focus:ring-0 transition-colors"
                  >
                     <option value="">-- Choose User --</option>
                     {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
               </div>

               <div className="space-y-4">
                  <label className="block font-bold text-gray-700">Your Hidden Amount (Cr)</label>
                  <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="e.g. 8.5"
                     className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:border-pink-500 focus:ring-0 transition-colors"
                  />
               </div>
            </div>

            <button 
               onClick={handleSubmit}
               className="w-full mt-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
               <Send size={20} /> Submit Secret Bid
            </button>

         </div>
      </div>

      {/* ADMIN TOGGLE */}
      <div className="flex justify-center mt-12">
         <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
            <input 
               type="password" 
               placeholder="Admin PIN" 
               className="bg-transparent border-none focus:ring-0 text-sm w-24 text-center"
               value={adminPassword}
               onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button 
               onClick={toggleAdmin}
               className={`p-2 rounded-full text-white transition-colors ${isAdmin ? 'bg-green-500' : 'bg-gray-400'}`}
            >
               {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
         </div>
      </div>

      {/* ADMIN PANEL */}
      {isAdmin && (
         <div className="bg-gray-900 text-white rounded-xl p-6 border border-gray-700 animate-in fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
               <h3 className="font-bold text-lg flex items-center gap-2 text-pink-400"><Eye size={20} /> Live Submissions</h3>
               <div className="flex gap-2">
                  <button onClick={broadcastResults} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-xs font-bold uppercase">Broadcast Winner</button>
                  <button onClick={clearData} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-xs font-bold uppercase flex items-center gap-1"><Trash2 size={14}/> Clear</button>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {Object.entries(allAmounts)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([user, data], idx) => (
                  <div key={user} className={`p-3 rounded border ${idx === 0 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-gray-800 border-gray-700'}`}>
                     <div className="text-xs text-gray-400 uppercase font-bold">{idx + 1}. {user}</div>
                     <div className="text-xl font-mono font-bold text-white">₹{data.amount}</div>
                  </div>
               ))}
               {Object.keys(allAmounts).length === 0 && <p className="text-gray-500 italic col-span-full">No submissions yet.</p>}
            </div>
         </div>
      )}

    </div>
  );
};

export default Round2;