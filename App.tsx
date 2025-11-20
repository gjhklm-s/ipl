
import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove as firebaseRemove } from 'firebase/database';
import { db } from './services/firebase';
import { USERS, PLAYERS_DB, ROLE_MAPPING } from './constants';
import { FirebaseTeamData, EnrichedPlayer, PlayerRole } from './types';
import { Search, Trophy, ExternalLink, Plane, User, Shield, PlusCircle, MinusCircle, Users, ChevronUp, ChevronDown, TrendingUp, BarChart3, DollarSign, Award, Share2, Trash2, Table as TableIcon } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTeamName, setSelectedTeamName] = useState<string>(USERS[0]);
  const [teamData, setTeamData] = useState<FirebaseTeamData | null>(null);
  const [allTeams, setAllTeams] = useState<Record<string, FirebaseTeamData>>({});
  const [players, setPlayers] = useState<EnrichedPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'squad' | 'results' | 'news' | 'table'>('squad');

  // Fetch Selected Team Data
  useEffect(() => {
    if (!selectedTeamName) return;

    setLoading(true);
    const teamRef = ref(db, `teams/${selectedTeamName}`);
    
    const unsubscribe = onValue(teamRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeamData(data);
        const rawPlayers = data.players || [];
        
        // Enrich player data with images and roles
        const enriched: EnrichedPlayer[] = rawPlayers.map((p: any) => {
          const dbEntry = PLAYERS_DB[p.player];
          const originalCategory = dbEntry?.category || 'Players';
          const role = ROLE_MAPPING[originalCategory] || 'Batter';
          
          return {
            ...p,
            image: dbEntry?.image || null,
            role: role,
            isOverseas: originalCategory === 'ForeignPlayers',
            isWicketKeeper: originalCategory === 'Wicketkeepers',
            isCaptain: false // Logic for captain could be added if data exists
          };
        });

        setPlayers(enriched);
      } else {
        setTeamData(null);
        setPlayers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedTeamName]);

  // Fetch ALL Teams Data for News/Stats
  useEffect(() => {
    const allTeamsRef = ref(db, 'teams');
    const unsubscribe = onValue(allTeamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAllTeams(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Remove Player Functionality
  const handleRemovePlayer = async (playerToRemove: EnrichedPlayer) => {
    if (!teamData || !selectedTeamName) return;

    const confirmDelete = window.confirm(`Are you sure you want to remove ${playerToRemove.player} from ${selectedTeamName}?`);
    if (!confirmDelete) return;

    try {
       // Filter out the player
       const newPlayersList = teamData.players.filter(p => p.player !== playerToRemove.player);
       
       // Recalculate financials
       const priceToRemove = parseFloat(playerToRemove.price.toString());
       const newTotalSpent = (teamData.totalSpent || 0) - priceToRemove;
       // Assuming budget is fixed at 150, but let's just add back the price to remaining
       const newRemainingBudget = (teamData.remainingBudget || 0) + priceToRemove;

       // Prepare updates for Firebase
       const updates: any = {};
       updates[`teams/${selectedTeamName}/players`] = newPlayersList;
       updates[`teams/${selectedTeamName}/totalSpent`] = newTotalSpent;
       updates[`teams/${selectedTeamName}/remainingBudget`] = newRemainingBudget;
       
       // Also remove from the global auctions node if it exists there (based on previous app logic)
       updates[`auctions/${playerToRemove.player}`] = null;

       await update(ref(db), updates);
       // alert(`Removed ${playerToRemove.player} successfully.`);
    } catch (error) {
       console.error("Error removing player:", error);
       alert("Failed to remove player. Please check console.");
    }
  };

  // Categorize Players for Squad View
  const batters = players.filter(p => p.role === 'Batter');
  const bowlers = players.filter(p => p.role === 'Bowler');
  const allRounders = players.filter(p => p.role === 'All-Rounder');

  // Calculate Team Stats
  const totalPoints = players.reduce((sum, p) => sum + (p.points || 0), 0);
  const totalSpent = teamData?.totalSpent || 0;
  const remainingBudget = teamData?.remainingBudget || 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      
      {/* Header - IPL Style */}
      <header className="bg-[#11141C] text-white h-20 flex items-center px-6 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-8 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
             <img src="https://www.iplt20.com/assets/images/ipl-logo-new-old.png" alt="Logo" className="h-12 w-auto" />
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-bold tracking-wider uppercase">
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Matches</span>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Points Table</span>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Videos</span>
            <span 
              className={`cursor-pointer transition-colors ${activeTab === 'squad' || activeTab === 'results' || activeTab === 'table' ? 'text-white border-b-2 border-orange-500 pb-7 pt-7' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('squad')}
            >
              Teams
            </span>
            <span 
              className={`cursor-pointer transition-colors ${activeTab === 'news' ? 'text-white border-b-2 border-orange-500 pb-7 pt-7' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('news')}
            >
              Analysis
            </span>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Stats</span>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">More</span>
          </nav>

          <div className="ml-auto flex items-center gap-4">
             <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center">?</span>
                <span>Fan Poll</span>
             </div>
             <Search className="w-6 h-6 text-white cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Team Selector Bar (Only show if NOT in News tab) */}
      {activeTab !== 'news' && (
        <div className="bg-[#19398a] py-4 shadow-inner overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-6 max-w-[1400px] mx-auto min-w-max">
            {USERS.map((user) => {
               const isActive = selectedTeamName === user;
               const colors = ['bg-yellow-400', 'bg-red-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-400', 'bg-pink-500'];
               const colorIndex = user.length % colors.length;
               
               return (
                <button
                  key={user}
                  onClick={() => {
                    setSelectedTeamName(user);
                    setActiveTab('squad'); // Reset to squad view on team change
                  }}
                  className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 group ${isActive ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 ${isActive ? 'border-white' : 'border-transparent'} ${colors[colorIndex]}`}>
                    {user.charAt(0)}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-blue-200'}`}>
                    {user}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero Section - Conditional based on Tab */}
      <div className="bg-gradient-to-r from-[#004BA0] to-[#19398a] text-white relative overflow-hidden min-h-[280px] flex items-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-[1400px] mx-auto w-full px-6 py-8 z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {activeTab === 'news' ? (
             <div className="w-full flex flex-col items-center md:items-start">
                <div className="flex items-center gap-4 mb-4">
                   <BarChart3 className="w-12 h-12 text-orange-500" />
                   <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Auction Analysis</h1>
                </div>
                <p className="text-blue-200 text-lg max-w-2xl">Real-time statistical breakdown of the auction. Track team budgets, points leaders, and record-breaking signings.</p>
             </div>
          ) : (
            <>
              {/* Big Team Logo */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 shadow-2xl border-4 border-orange-500 flex items-center justify-center text-[#004BA0] text-4xl font-bebas shrink-0">
                {selectedTeamName.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">{selectedTeamName} Super Kings</h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                   <div className="bg-blue-800/50 px-4 py-2 rounded-lg flex items-center gap-2 border border-blue-600">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">2024, 2025 Winners</span>
                   </div>
                   <a href="#" className="bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm uppercase shadow-lg">
                      Official Team Site <ExternalLink className="w-4 h-4" />
                   </a>
                </div>

                {/* User Stats Display - Below Team Name */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[140px] text-center md:text-left transition-all hover:bg-black/30">
                        <div className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-1">Remaining Budget</div>
                        <div className="text-2xl font-bold text-yellow-400">₹{remainingBudget.toFixed(2)} Cr</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[140px] text-center md:text-left transition-all hover:bg-black/30">
                        <div className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-1">Total Spent</div>
                        <div className="text-2xl font-bold text-white">₹{totalSpent.toFixed(2)} Cr</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[140px] text-center md:text-left transition-all hover:bg-black/30">
                        <div className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-1">Total Points</div>
                        <div className="text-2xl font-bold text-green-400">{totalPoints}</div>
                    </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter / View Bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 sticky top-20 z-40 shadow-sm">
         <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
               <button 
                  onClick={() => setActiveTab('squad')}
                  className={`px-6 py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'squad' ? 'bg-[#11141C] text-white' : 'text-gray-500 hover:text-[#11141C] hover:bg-gray-100'}`}
               >
                 Squad
               </button>
               <button 
                  onClick={() => setActiveTab('results')}
                  className={`px-6 py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'results' ? 'bg-[#11141C] text-white' : 'text-gray-500 hover:text-[#11141C] hover:bg-gray-100'}`}
               >
                 Results
               </button>
               <button 
                  onClick={() => setActiveTab('news')}
                  className={`px-6 py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'news' ? 'bg-[#11141C] text-white' : 'text-gray-500 hover:text-[#11141C] hover:bg-gray-100'}`}
               >
                  Analysis
               </button>
               <button 
                  onClick={() => setActiveTab('table')}
                  className={`px-6 py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'table' ? 'bg-[#11141C] text-white' : 'text-gray-500 hover:text-[#11141C] hover:bg-gray-100'}`}
               >
                  Table
               </button>
            </div>
            <div className="hidden md:block">
               <select className="bg-gray-100 border-none rounded px-4 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500">
                  <option>Season 2025</option>
                  <option>Season 2024</option>
               </select>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-6 py-12 max-w-[1400px] mx-auto w-full space-y-12">
        
        {activeTab === 'news' ? (
           <NewsDashboard allTeams={allTeams} />
        ) : loading ? (
           <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
           </div>
        ) : players.length === 0 ? (
           <div className="text-center py-20 text-gray-400">
              <User className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold text-gray-500">No Players Purchased Yet</h2>
              <p>Select a different team or go to the auction.</p>
           </div>
        ) : (
           <>
             {activeTab === 'squad' && (
               <div className="space-y-12 animate-in fade-in duration-500">
                 {/* Batters Section */}
                 {batters.length > 0 && (
                   <section>
                     <h2 className="text-3xl font-bold text-[#11141C] mb-6 pb-2 border-b border-gray-300 flex items-center gap-2">
                        <img src="https://www.iplt20.com/assets/images/teams-batter-icon.svg" alt="" className="w-8 h-8 opacity-60" />
                        Batters
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                       {batters.map((p, idx) => <PlayerCard key={idx} player={p} teamColor="#F2C94C" />)}
                     </div>
                   </section>
                 )}

                 {/* All Rounders Section */}
                 {allRounders.length > 0 && (
                   <section>
                     <h2 className="text-3xl font-bold text-[#11141C] mb-6 pb-2 border-b border-gray-300 flex items-center gap-2">
                        <img src="https://www.iplt20.com/assets/images/teams-all-rounder-icon.svg" alt="" className="w-8 h-8 opacity-60" />
                        All Rounders
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                       {allRounders.map((p, idx) => <PlayerCard key={idx} player={p} teamColor="#27AE60" />)}
                     </div>
                   </section>
                 )}

                 {/* Bowlers Section */}
                 {bowlers.length > 0 && (
                   <section>
                     <h2 className="text-3xl font-bold text-[#11141C] mb-6 pb-2 border-b border-gray-300 flex items-center gap-2">
                        <img src="https://www.iplt20.com/assets/images/teams-bowler-icon.svg" alt="" className="w-8 h-8 opacity-60" />
                        Bowlers
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                       {bowlers.map((p, idx) => <PlayerCard key={idx} player={p} teamColor="#2F80ED" />)}
                     </div>
                   </section>
                 )}
               </div>
             )}

             {activeTab === 'results' && (
               <TeamBuilder players={players} teamName={selectedTeamName} />
             )}

             {activeTab === 'table' && (
               <div className="animate-in fade-in duration-500 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-[#19398a] text-white px-6 py-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <TableIcon size={20} />
                        <h3 className="text-xl font-bold font-bebas tracking-wider uppercase">Squad List</h3>
                     </div>
                     <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">Total: {players.length} Players</span>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-gray-50 text-xs uppercase text-gray-600 font-bold border-b border-gray-200">
                              <th className="px-6 py-4 w-16 text-center">S.No</th>
                              <th className="px-6 py-4">Player Name</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4 text-right">Price (Cr)</th>
                              <th className="px-6 py-4 text-center">Points</th>
                              <th className="px-6 py-4 text-center">Remove</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                           {players.map((player, index) => (
                              <tr key={player.player} className="hover:bg-blue-50/50 transition-colors group">
                                 <td className="px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                                 <td className="px-6 py-4 font-bold text-[#11141C] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                                       <img 
                                          src={player.image || "https://www.iplt20.com/assets/images/default-headshot.png"} 
                                          alt={player.player} 
                                          className="w-full h-full object-cover object-top"
                                       />
                                    </div>
                                    {player.player}
                                 </td>
                                 <td className="px-6 py-4 text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                       ${player.role === 'Batter' ? 'bg-yellow-100 text-yellow-700' : 
                                         player.role === 'Bowler' ? 'bg-blue-100 text-blue-700' : 
                                         'bg-green-100 text-green-700'}`}>
                                       {player.role}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right font-bold text-[#19398a]">₹{player.price}</td>
                                 <td className="px-6 py-4 text-center font-semibold text-gray-700">{player.points}</td>
                                 <td className="px-6 py-4 text-center">
                                    <button 
                                       onClick={() => handleRemovePlayer(player)}
                                       className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                                       title="Remove Player"
                                    >
                                       <Trash2 size={18} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                           {/* Total Row */}
                           <tr className="bg-gray-50 font-bold text-[#11141C] border-t-2 border-gray-200">
                              <td colSpan={3} className="px-6 py-4 text-right uppercase tracking-wider">Total</td>
                              <td className="px-6 py-4 text-right text-[#19398a]">₹{totalSpent.toFixed(2)}</td>
                              <td className="px-6 py-4 text-center text-green-600">{totalPoints}</td>
                              <td></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
             )}
           </>
        )}

      </main>

      <footer className="bg-[#11141C] text-gray-400 py-8 text-center text-sm mt-auto">
         <p>&copy; 2025 IPL Auction Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- NEWS & STATS DASHBOARD COMPONENT ---
const NewsDashboard: React.FC<{ allTeams: Record<string, FirebaseTeamData> }> = ({ allTeams }) => {
   // Process data for Leaderboards
   const stats = Object.entries(allTeams).map(([user, data]) => {
      const playerList = data.players || [];
      const totalPoints = playerList.reduce((acc: number, p: any) => acc + (p.points || 0), 0);
      return {
         user,
         totalPoints,
         remainingBudget: data.remainingBudget || 0,
         playerCount: playerList.length,
         players: playerList
      };
   });

   // 1. Points Leaderboard (Descending)
   const pointsLeaderboard = [...stats].sort((a, b) => b.totalPoints - a.totalPoints);

   // 2. Budget Analysis
   const budgetLeaderboard = [...stats].sort((a, b) => b.remainingBudget - a.remainingBudget);
   const richest = budgetLeaderboard[0];
   
   // 3. Top 3 Expensive Players
   let allPlayers: any[] = [];
   stats.forEach(team => {
      if(team.players) {
         team.players.forEach((p: any) => {
            allPlayers.push({
               ...p,
               owner: team.user,
               image: PLAYERS_DB[p.player]?.image
            });
         });
      }
   });
   const topPlayers = allPlayers.sort((a, b) => b.price - a.price).slice(0, 3);

   return (
      <div className="space-y-10 animate-in fade-in duration-700">
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* POINTS LEADERBOARD */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
               <div className="bg-[#11141C] text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     <TrendingUp className="text-green-400" />
                     Points Table
                  </h3>
                  <span className="text-xs uppercase text-gray-400 tracking-wider">Live Standings</span>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                           <th className="px-6 py-3">Rank</th>
                           <th className="px-6 py-3">User / Team</th>
                           <th className="px-6 py-3 text-center">Squad Size</th>
                           <th className="px-6 py-3 text-right">Total Points</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-sm">
                        {pointsLeaderboard.map((team, idx) => (
                           <tr key={team.user} className="hover:bg-blue-50/50 transition-colors group">
                              <td className="px-6 py-4 font-bold text-gray-400 group-hover:text-[#19398a]">#{idx + 1}</td>
                              <td className="px-6 py-4 font-bold text-[#11141C]">{team.user}</td>
                              <td className="px-6 py-4 text-center text-gray-600">{team.playerCount}</td>
                              <td className="px-6 py-4 text-right font-bold text-green-600 text-base">{team.totalPoints}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* BUDGET STATS */}
            <div className="space-y-6">
               <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 p-4">
                     <DollarSign size={100} />
                  </div>
                  <h4 className="text-emerald-100 uppercase text-xs font-bold tracking-wider mb-2">Highest Remaining Purse</h4>
                  {richest ? (
                     <>
                        <div className="text-4xl font-bold mb-1">₹{richest.remainingBudget.toFixed(2)} Cr</div>
                        <div className="text-xl font-medium text-emerald-100 flex items-center gap-2">
                           <User size={20} /> {richest.user}
                        </div>
                     </>
                  ) : (
                     <p className="text-lg">No Data</p>
                  )}
               </div>

               <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                     <BarChart3 size={18} className="text-blue-500" />
                     Budget Overview
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {budgetLeaderboard.slice(0, 5).map((team, idx) => (
                        <div key={team.user} className="flex justify-between items-center text-sm">
                           <span className="text-gray-600 font-medium">{idx + 1}. {team.user}</span>
                           <span className="font-bold text-[#19398a]">₹{team.remainingBudget.toFixed(2)} Cr</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* TOP 3 EXPENSIVE BUYS */}
         <div>
            <h3 className="text-2xl font-bold text-[#11141C] mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
               <Award className="text-orange-500" />
               Top Auction Buys
            </h3>
            
            {topPlayers.length === 0 ? (
               <p className="text-gray-500 italic">No players sold yet.</p>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topPlayers.map((player, idx) => (
                     <div key={`${player.player}-${idx}`} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden flex flex-col relative group hover:shadow-xl transition-all duration-300">
                        <div className={`absolute top-0 left-0 w-full h-1 ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-700'}`}></div>
                        <div className="absolute top-3 right-3 z-10">
                           <span className={`text-xs font-bold px-2 py-1 rounded text-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-500' : 'bg-orange-700'}`}>
                              #{idx + 1} Expensive
                           </span>
                        </div>

                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                           <img 
                              src={player.image || "https://www.iplt20.com/assets/images/default-headshot.png"} 
                              alt={player.player} 
                              className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                           />
                           <div className="absolute bottom-3 left-3 z-20 text-white">
                              <div className="text-2xl font-bebas tracking-wide">{player.player}</div>
                           </div>
                        </div>

                        <div className="p-4">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-500 text-xs uppercase font-bold">Sold To</span>
                              <span className="text-[#19398a] font-bold">{player.owner}</span>
                           </div>
                           <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                              <span className="text-gray-500 text-xs uppercase font-bold">Price</span>
                              <span className="text-xl font-black text-[#11141C]">₹{player.price} Cr</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

      </div>
   );
};

// Individual Player Card Component
const PlayerCard: React.FC<{ player: EnrichedPlayer, teamColor: string }> = ({ player, teamColor }) => {
   return (
     <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative border border-gray-100 flex flex-col h-full">
       
       {/* Top Badges */}
       <div className="absolute top-3 left-3 z-10 flex gap-2">
         {player.isOverseas && (
            <div className="bg-white/90 backdrop-blur p-1.5 rounded-full shadow-sm text-gray-700" title="Overseas Player">
               <Plane className="w-4 h-4" />
            </div>
         )}
         {player.isWicketKeeper && (
            <div className="bg-white/90 backdrop-blur p-1.5 rounded-full shadow-sm text-gray-700" title="Wicket Keeper">
               <Shield className="w-4 h-4" />
            </div>
         )}
       </div>

       {/* Image Container */}
       <div className="h-72 relative flex items-end justify-center bg-gradient-to-b from-gray-50 to-gray-200 overflow-hidden shrink-0">
         {/* Team stripe background effect */}
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent"></div>
         
         {player.image ? (
           <img 
             src={player.image} 
             alt={player.player} 
             className="h-full w-full object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500"
           />
         ) : (
           <div className="h-full w-full flex items-center justify-center text-gray-300">
             <User className="w-24 h-24" />
           </div>
         )}
         
         {/* Gradient Overlay at bottom of image for text readability */}
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
       </div>

       {/* Card Body - Yellow/Team Color Stripe */}
       <div className="bg-yellow-400 h-1.5 w-full relative z-10"></div>
       
       {/* Text Content */}
       <div className="p-4 bg-white relative flex-grow flex flex-col justify-between">
          <div>
              <h3 className="text-xl font-black text-[#11141C] uppercase leading-tight mb-1 font-bebas tracking-wide truncate">
                {player.player}
              </h3>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {player.role}
              </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
             <div className="text-sm font-bold text-[#19398a]">
                ₹{player.price} Cr
             </div>
             <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {player.points} Pts
             </div>
          </div>
       </div>
     </div>
   );
};

// Team Builder Component for Results Tab
const TeamBuilder: React.FC<{ players: EnrichedPlayer[], teamName: string }> = ({ players, teamName }) => {
  // Initialize playing 12 with top 12 most expensive players by default
  const [playing12, setPlaying12] = useState<EnrichedPlayer[]>([]);
  const [bench, setBench] = useState<EnrichedPlayer[]>([]);

  useEffect(() => {
    // Sort by price descending initially
    const sorted = [...players].sort((a, b) => b.price - a.price);
    setPlaying12(sorted.slice(0, 12));
    setBench(sorted.slice(12));
  }, [players]);

  const moveToBench = (player: EnrichedPlayer) => {
    setPlaying12(prev => prev.filter(p => p.player !== player.player));
    setBench(prev => [...prev, player]);
  };

  const moveToPlaying12 = (player: EnrichedPlayer) => {
    if (playing12.length >= 12) {
      alert("You can only have 12 players in the Playing XII!");
      return;
    }
    setBench(prev => prev.filter(p => p.player !== player.player));
    setPlaying12(prev => [...prev, player]);
  };

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === playing12.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...playing12];
    // Swap elements
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setPlaying12(newList);
  };

  const handleShare = () => {
    if (playing12.length === 0) {
        alert("Add players to your Playing XII first!");
        return;
    }

    let text = `🏏 *${teamName} Playing XII* 🏏\n\n`;
    playing12.forEach((p, i) => {
        text += `${i + 1}. ${p.player} (${p.role})\n`;
    });
    
    const totalPts = playing12.reduce((acc, p) => acc + (p.points || 0), 0);
    text += `\n📊 Total Points: ${totalPts}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-[#11141C] mb-2 flex items-center gap-2">
           <Users className="text-blue-600" /> 
           Construct Playing 12
        </h2>
        <p className="text-gray-500">Select your best 12 players for the match. Use the arrows to reorder players to specific positions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Playing XII Column */}
        <div className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-[#19398a] text-white p-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <h3 className="font-bebas text-2xl tracking-wide">Playing XII</h3>
                <button 
                  onClick={handleShare}
                  className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full transition-colors shadow-md"
                  title="Share via WhatsApp"
                >
                  <Share2 size={18} />
                </button>
             </div>
             <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{playing12.length} / 12</span>
          </div>
          
          <div className="p-4 flex-grow space-y-2 min-h-[400px]">
             {playing12.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic py-10">
                   <p>No players selected</p>
                </div>
             )}
             {playing12.map((p, index) => (
                <div key={p.player} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                   {/* Reordering Controls */}
                   <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => movePlayer(index, 'up')} 
                        disabled={index === 0}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                        title="Move Up"
                      >
                         <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => movePlayer(index, 'down')} 
                        disabled={index === playing12.length - 1}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                        title="Move Down"
                      >
                         <ChevronDown size={16} />
                      </button>
                   </div>

                   {/* Position Number */}
                   <div className="w-6 text-center font-mono text-lg font-bold text-blue-300/80 select-none">
                      {index + 1}
                   </div>

                   <img 
                      src={p.image || "https://www.iplt20.com/assets/images/default-headshot.png"} 
                      alt={p.player} 
                      className="w-12 h-12 object-cover object-top rounded-full border-2 border-white shadow-sm bg-gray-200"
                   />
                   <div className="flex-grow">
                      <h4 className="font-bold text-[#11141C] leading-none">{p.player}</h4>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                         <span>{p.role}</span>
                         <span className="text-blue-600 font-semibold">₹{p.price} Cr</span>
                      </div>
                   </div>
                   <button 
                      onClick={() => moveToBench(p)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
                      title="Move to Bench"
                   >
                      <MinusCircle className="w-6 h-6" />
                   </button>
                </div>
             ))}
          </div>
          
          <div className="bg-gray-50 p-4 border-t border-gray-200">
             <div className="flex justify-between text-sm font-bold text-gray-600">
                <span>Total Points:</span>
                <span className="text-[#19398a]">{playing12.reduce((acc, p) => acc + (p.points || 0), 0)}</span>
             </div>
          </div>
        </div>

        {/* Bench Column */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md flex flex-col">
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
             <h3 className="font-bebas text-2xl tracking-wide">Bench / Reserves</h3>
             <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{bench.length}</span>
          </div>
          
          <div className="p-4 flex-grow space-y-2 min-h-[400px]">
             {bench.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic py-10">
                   <p>Bench is empty</p>
                </div>
             )}
             {bench.map((p) => (
                <div key={p.player} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors opacity-90">
                   <img 
                      src={p.image || "https://www.iplt20.com/assets/images/default-headshot.png"} 
                      alt={p.player} 
                      className="w-12 h-12 object-cover object-top rounded-full border-2 border-white shadow-sm bg-gray-200 grayscale"
                   />
                   <div className="flex-grow">
                      <h4 className="font-bold text-gray-700 leading-none">{p.player}</h4>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                         <span>{p.role}</span>
                         <span className="text-gray-600 font-semibold">₹{p.price} Cr</span>
                      </div>
                   </div>
                   <button 
                      onClick={() => moveToPlaying12(p)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-100 p-2 rounded-full transition-colors"
                      title="Add to Playing 12"
                   >
                      <PlusCircle className="w-6 h-6" />
                   </button>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
