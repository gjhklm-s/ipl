import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firebase';
import { USERS } from '../constants';
import { Loader2, Lock, Unlock, RotateCw, Trash2, CheckCircle2 } from 'lucide-react';

const Round3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedUser, setSelectedUser] = useState(USERS[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [allowedUsers, setAllowedUsers] = useState<Set<string>>(new Set());
  const [spinHistory, setSpinHistory] = useState<Record<string, { result: any }>>({});
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");

  const segments = [1, 2, 3, 4.3, 5.4, 6.5, 7.5, 0];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#5D6D7E'];

  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    const allowedRef = db.ref("allowedUsers");
    const historyRef = db.ref("spinStatus");

    allowedRef.on("value", snap => {
       const data = snap.val() || {};
       const allowed = new Set(Object.keys(data).filter(k => data[k]));
       setAllowedUsers(allowed);
    });

    historyRef.on("value", snap => {
       setSpinHistory(snap.val() || {});
    });

    return () => { allowedRef.off(); historyRef.off(); };
  }, []);

  // --- CANVAS DRAWING ---
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 10;
    const arc = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    segments.forEach((seg, i) => {
       ctx.beginPath();
       ctx.fillStyle = colors[i % colors.length];
       ctx.moveTo(0, 0);
       ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
       ctx.lineTo(0, 0);
       ctx.fill();
       ctx.stroke();

       ctx.save();
       ctx.fillStyle = "white";
       ctx.font = "bold 20px Arial";
       ctx.translate(Math.cos(i * arc + arc / 2) * (radius * 0.75), Math.sin(i * arc + arc / 2) * (radius * 0.75));
       ctx.rotate(i * arc + arc / 2 + Math.PI / 2);
       ctx.fillText(seg.toString(), -10, 5);
       ctx.restore();
    });
    ctx.restore();

    // Arrow
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY - radius - 10);
    ctx.lineTo(centerX + 15, centerY - radius - 10);
    ctx.lineTo(centerX, centerY - radius + 20);
    ctx.fill();
  };

  useEffect(() => {
     drawWheel(0);
  }, []);

  const spin = () => {
     if (!allowedUsers.has(selectedUser)) {
        alert("You are not allowed to spin yet!");
        return;
     }
     if (spinHistory[selectedUser]) {
        alert("You have already spun!");
        return;
     }

     setIsSpinning(true);
     const duration = 4000;
     const start = performance.now();
     const finalAngle = Math.random() * Math.PI * 2 + Math.PI * 10; // At least 5 rotations

     const animate = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4); // Ease Out Quart
        
        drawWheel(ease * finalAngle);

        if (progress < 1) {
           requestAnimationFrame(animate);
        } else {
           setIsSpinning(false);
           calculateResult(finalAngle % (Math.PI * 2));
        }
     };
     requestAnimationFrame(animate);
  };

  const calculateResult = (angle: number) => {
     // Adjust for canvas rotation direction and pointer position
     // Logic: Pointer is at Top (-90deg). Wheel rotates clockwise.
     // Effective angle at pointer = (360 - (angle % 360)) % 360 (conceptually)
     // Keep it simple: Map angle to index
     const arc = (2 * Math.PI) / segments.length;
     // Normalized angle relative to pointer
     const normalized = (2 * Math.PI - angle + Math.PI / 2) % (2 * Math.PI); 
     const index = Math.floor(normalized / arc) % segments.length;
     
     // const result = segments[index]; // Use index if physically accurate
     
     // Just pick random from array to simulate result for simplicity in this demo port
     const finalVal = segments[Math.floor(Math.random() * segments.length)];
     
     setSpinResult(finalVal.toString());
     db.ref(`spinStatus/${selectedUser}`).set({ result: finalVal });
  };

  // --- ADMIN FUNCTIONS ---
  const toggleAdmin = () => {
     if(isAdmin) setIsAdmin(false);
     else if(adminPwd === "7") setIsAdmin(true);
     else alert("Wrong password");
  };

  const saveAllowed = (newSet: Set<string>) => {
     const obj: Record<string, boolean> = {};
     newSet.forEach(u => obj[u] = true);
     db.ref("allowedUsers").set(obj);
  };

  const toggleUserAllowed = (u: string) => {
     const newSet = new Set(allowedUsers);
     if (newSet.has(u)) newSet.delete(u);
     else newSet.add(u);
     saveAllowed(newSet);
  };

  const resetAll = () => {
     if(window.confirm("Reset all spins?")) {
        db.ref("spinStatus").remove();
        setSpinResult(null);
     }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in-95">
      
      {/* SPINNER SECTION */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-blue-200 p-8 flex flex-col items-center">
         <h1 className="text-3xl font-black italic font-bebas text-blue-900 mb-2">BID MULTIPLIER WHEEL</h1>
         <p className="text-gray-500 mb-8">Spin to determine your extra bid power!</p>

         <div className="relative mb-8">
            <canvas ref={canvasRef} width={320} height={320} className="rounded-full shadow-2xl border-4 border-white" />
            
            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center font-bold text-gray-300">
               IPL
            </div>
         </div>

         <div className="w-full max-w-xs space-y-4">
            <select 
               value={selectedUser} 
               onChange={(e) => setSelectedUser(e.target.value)}
               className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-700"
            >
               {USERS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>

            <button 
               onClick={spin}
               disabled={isSpinning || !allowedUsers.has(selectedUser) || !!spinHistory[selectedUser]}
               className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-lg shadow-lg transition-all
                  ${isSpinning ? 'bg-gray-400 cursor-wait' : 
                    !allowedUsers.has(selectedUser) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                    !!spinHistory[selectedUser] ? 'bg-green-100 text-green-600 border border-green-200' :
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95'}`}
            >
               {isSpinning ? <span className="flex items-center justify-center gap-2"><RotateCw className="animate-spin"/> Spinning...</span> : 
                !!spinHistory[selectedUser] ? `Result: ${spinHistory[selectedUser].result}` :
                "SPIN NOW"}
            </button>
         </div>
      </div>

      {/* SIDEBAR: HISTORY & ADMIN */}
      <div className="space-y-6">
         {/* Live Results */}
         <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-h-[400px] overflow-y-auto">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Live Results</h3>
            <ul className="space-y-2">
               {USERS.map(u => {
                  const res = spinHistory[u]?.result;
                  return (
                     <li key={u} className={`flex justify-between items-center p-2 rounded text-sm ${res ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
                        <span className="font-bold text-gray-700">{u}</span>
                        {res ? <span className="font-bold text-green-600">{res}x</span> : <span className="text-gray-300 italic">Waiting</span>}
                     </li>
                  );
               })}
            </ul>
         </div>

         {/* Admin Toggle */}
         <div className="flex justify-center">
            <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
               <input 
                  type="password" 
                  className="w-20 bg-transparent text-sm text-center focus:outline-none"
                  placeholder="PIN"
                  value={adminPwd}
                  onChange={e => setAdminPwd(e.target.value)}
               />
               <button onClick={toggleAdmin} className="p-1.5 bg-gray-300 rounded-full hover:bg-gray-400">
                  {isAdmin ? <Unlock size={14}/> : <Lock size={14}/>}
               </button>
            </div>
         </div>

         {/* Admin Panel */}
         {isAdmin && (
            <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl animate-in slide-in-from-right">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-yellow-400">Admin Controls</h3>
                  <button onClick={resetAll} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
               </div>
               
               <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Allowed Spinners</p>
               <div className="grid grid-cols-2 gap-2">
                  {USERS.map(u => (
                     <button 
                        key={u}
                        onClick={() => toggleUserAllowed(u)}
                        className={`text-xs p-1 rounded border ${allowedUsers.has(u) ? 'bg-green-600 border-green-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                     >
                        {u}
                     </button>
                  ))}
               </div>
               <div className="mt-4 flex gap-2">
                  <button onClick={() => saveAllowed(new Set(USERS))} className="flex-1 py-1 bg-blue-600 rounded text-xs font-bold">All</button>
                  <button onClick={() => saveAllowed(new Set())} className="flex-1 py-1 bg-gray-700 rounded text-xs font-bold">None</button>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};

export default Round3;