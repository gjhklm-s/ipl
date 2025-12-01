import React, { useState, useEffect } from 'react';
import { db } from './services/firebase';
import { USERS, PLAYERS_DB, ROLE_MAPPING, SPECIFIC_PLAYER_ROLES, KNOWN_OVERSEAS } from './constants';
import { FirebaseTeamData, EnrichedPlayer, PlayerRole } from './types';
import { Search, Trophy, ExternalLink, Plane, User, Shield, PlusCircle, MinusCircle, Users, ChevronUp, ChevronDown, TrendingUp, BarChart3, DollarSign, Award, Share2, Trash2, Table as TableIcon, PieChart, Activity, X, Wallet, Zap, Layers, Calculator, AlertTriangle, Gamepad2, Coins, Disc, LayoutGrid, ArrowRight } from 'lucide-react';

// Import New Game Components
import GameHub from './components/GameHub';
import Round1 from './components/Round1';
import Round2 from './components/Round2';
import Round3 from './components/Round3';
import Round4 from './components/Round4';
import Round5 from './components/Round5';
import RetiredPlayers from './components/RetiredPlayers';
import BudgetPlayers from './components/BudgetPlayers';

const App: React.FC = () => {
  const [selectedTeamName, setSelectedTeamName] = useState<string>(USERS[0]);
  const [teamData, setTeamData] = useState<FirebaseTeamData | null>(null);
  const [allTeams, setAllTeams] = useState<Record<string, FirebaseTeamData>>({});
  const [players, setPlayers] = useState<EnrichedPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Navigation State
  const [mainView, setMainView] = useState<'dashboard' | 'hub' | 'games'>('dashboard');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'squad' | 'results' | 'news' | 'table' | 'stats'>('squad');
  const [activeGameRound, setActiveGameRound] = useState<'round1' | 'round2' | 'round3' | 'round4' | 'round5' | 'retired' | 'budget'>('round1');

  const [selectedPlayerForModal, setSelectedPlayerForModal] = useState<EnrichedPlayer | null>(null);

  // Fetch Selected Team Data
  useEffect(() => {
    if (!selectedTeamName) return;

    setLoading(true);
    const teamRef = db.ref(`teams/${selectedTeamName}`);
    
    const handleSnapshot = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setTeamData(data);
        const rawPlayers = data.players || [];
        
        // Enrich player data with images and roles
        const enriched: EnrichedPlayer[] = rawPlayers.map((p: any) => {
          const dbEntry = PLAYERS_DB[p.player];
          const originalCategory = dbEntry?.category || 'Players';
          
          let role = SPECIFIC_PLAYER_ROLES[p.player] || ROLE_MAPPING[originalCategory] || 'Batter';
          const isOverseas = KNOWN_OVERSEAS.has(p.player);

          return {
            ...p,
            image: dbEntry?.image || null,
            role: role,
            isOverseas: isOverseas,
            isWicketKeeper: originalCategory === 'Wicketkeepers',
            isCaptain: false 
          };
        });

        setPlayers(enriched);
      } else {
        setTeamData(null);
        setPlayers([]);
      }
      setLoading(false);
    };

    teamRef.on('value', handleSnapshot);

    return () => {
      teamRef.off('value', handleSnapshot);
    };
  }, [selectedTeamName]);

  // Fetch ALL Teams Data
  useEffect(() => {
    const allTeamsRef = db.ref('teams');
    const handleSnapshot = (snapshot: any) => {
      const data = snapshot.val();
      if (data) setAllTeams(data);
    };
    allTeamsRef.on('value', handleSnapshot);
    return () => {
      allTeamsRef.off('value', handleSnapshot);
    };
  }, []);

  const handleRemovePlayer = async (playerToRemove: EnrichedPlayer) => {
    if (!teamData || !selectedTeamName) return;
    const confirmDelete = window.confirm(`Are you sure you want to remove ${playerToRemove.player} from ${selectedTeamName}?`);
    if (!confirmDelete) return;

    try {
       const newPlayersList = teamData.players.filter(p => p.player !== playerToRemove.player);
       const priceToRemove = parseFloat(playerToRemove.price.toString());
       const newTotalSpent = (teamData.totalSpent || 0) - priceToRemove;
       const newRemainingBudget = (teamData.remainingBudget || 0) + priceToRemove;

       const updates: any = {};
       updates[`teams/${selectedTeamName}/players`] = newPlayersList;
       updates[`teams/${selectedTeamName}/totalSpent`] = newTotalSpent;
       updates[`teams/${selectedTeamName}/remainingBudget`] = newRemainingBudget;
       updates[`auctions/${playerToRemove.player}`] = null;

       await db.ref().update(updates);
    } catch (error) {
       console.error("Error removing player:", error);
       alert("Failed to remove player. Please check console.");
    }
  };

  const handleGameSelect = (game: 'round1' | 'round2' | 'round3' | 'round4' | 'round5' | 'retired' | 'budget') => {
    setActiveGameRound(game);
    setMainView('games');
  };

  // Categorize Players
  const batters = players.filter(p => p.role === 'Batter');
  const bowlers = players.filter(p => p.role === 'Bowler');
  const allRounders = players.filter(p => p.role === 'All-Rounder');

  const totalPoints = players.reduce((sum, p) => sum + (p.points || 0), 0);
  const totalSpent = teamData?.totalSpent || 0;
  const remainingBudget = teamData?.remainingBudget || 0;
  const budgetPercent = Math.min(((totalSpent) / 150) * 100, 100);
  const maxPoints = Math.max(...players.map(p => p.points || 0), 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      
      {/* Header - Only visible in Dashboard View */}
      {mainView !== 'hub' && (
        <header className="bg-[#11141C] text-white h-20 flex items-center px-6 sticky top-0 z-50 shadow-lg border-b border-gray-800">
          <div className="flex items-center gap-8 w-full max-w-[1400px] mx-auto justify-between md:justify-start">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMainView('dashboard')}>
               <img src="https://www.iplt20.com/assets/images/ipl-logo-new-old.png" alt="Logo" className="h-10 md:h-12 w-auto" />
            </div>
            
            <nav className="hidden md:flex gap-6 text-sm font-bold tracking-wider uppercase items-center">
              <button 
                 onClick={() => setMainView('dashboard')}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${mainView === 'dashboard' ? 'bg-white/10 text-yellow-400' : 'text-gray-400 hover:text-white'}`}
              >
                 Dashboard
              </button>

              {mainView === 'dashboard' && (
                 <div className="flex gap-6 ml-4 border-l border-gray-700 pl-6">
                    <span className={`cursor-pointer transition-colors ${activeDashboardTab === 'squad' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveDashboardTab('squad')}>Squad</span>
                    <span className={`cursor-pointer transition-colors ${activeDashboardTab === 'results' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveDashboardTab('results')}>Playing XI</span>
                    <span className={`cursor-pointer transition-colors ${activeDashboardTab === 'stats' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveDashboardTab('stats')}>Stats</span>
                    <span className={`cursor-pointer transition-colors ${activeDashboardTab === 'news' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveDashboardTab('news')}>Analysis</span>
                    <span className={`cursor-pointer transition-colors ${activeDashboardTab === 'table' ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveDashboardTab('table')}>Table</span>
                 </div>
              )}

              {mainView === 'games' && (
                 <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <span className="text-white font-bold bg-purple-600 px-2 py-1 rounded text-xs">
                       {activeGameRound === 'round1' ? 'Auction' : 
                        activeGameRound === 'round2' ? 'Hidden Bid' : 
                        activeGameRound === 'round3' ? 'Spinner' :
                        activeGameRound === 'round4' ? 'Dutch Auction' :
                        activeGameRound === 'round5' ? 'Find Who' :
                        activeGameRound === 'retired' ? 'Hall of Fame' : 'Budget Picks'}
                    </span>
                    <button onClick={() => setMainView('hub')} className="text-xs underline text-gray-400 ml-2 hover:text-white">Change Game</button>
                 </div>
              )}
            </nav>

            <div className="flex items-center gap-4 ml-auto">
               <button 
                  onClick={() => setMainView('hub')}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-105"
               >
                  <Gamepad2 size={16} /> Auction Arena
               </button>
            </div>
          </div>
        </header>
      )}

      {/* --- GAME HUB (LOBBY) --- */}
      {mainView === 'hub' && (
         <GameHub onSelectGame={handleGameSelect} onBack={() => setMainView('dashboard')} />
      )}

      {/* --- DASHBOARD VIEW --- */}
      {mainView === 'dashboard' && (
         <>
            {activeDashboardTab !== 'news' && (
              <div className="bg-[#19398a] py-4 shadow-inner overflow-x-auto scrollbar-hide border-b border-[#0f255c]">
                <div className="flex gap-4 px-6 max-w-[1400px] mx-auto min-w-max">
                  {USERS.map((user) => {
                     const isActive = selectedTeamName === user;
                     const colors = ['bg-yellow-400', 'bg-red-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-400', 'bg-pink-500'];
                     const colorIndex = user.length % colors.length;
                     
                     return (
                      <button
                        key={user}
                        onClick={() => {
                          setSelectedTeamName(user);
                          setActiveDashboardTab('squad'); 
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white text-[#19398a] shadow-lg scale-105' : 'bg-[#234baf] text-blue-200 hover:bg-[#2d5ccf]'}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${colors[colorIndex]}`}>
                          {user.charAt(0)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {user}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-[#004BA0] text-white relative overflow-hidden min-h-[220px] flex items-center shadow-lg">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-[#004BA0] to-transparent"></div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-20"></div>
              
              <div className="max-w-[1400px] mx-auto w-full px-6 py-6 z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                
                {activeDashboardTab === 'news' ? (
                   <div className="w-full flex flex-col items-center md:items-start py-4">
                      <div className="flex items-center gap-4 mb-2">
                         <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <BarChart3 className="w-8 h-8 text-orange-400" />
                         </div>
                         <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter font-bebas">AUCTION CENTRE</h1>
                      </div>
                      <p className="text-blue-200 text-lg max-w-2xl font-light">Comprehensive real-time analysis, player valuations, and team standings.</p>
                   </div>
                ) : (
                  <>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1 shadow-[0_0_20px_rgba(0,0,0,0.3)] border-4 border-yellow-400 flex items-center justify-center text-[#004BA0] text-3xl font-bebas shrink-0 relative">
                      {selectedTeamName.slice(0, 2).toUpperCase()}
                      <div className="absolute -bottom-2 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Owner</div>
                    </div>

                    <div className="flex-1 text-center md:text-left w-full">
                      <div className="flex flex-col md:flex-row justify-between items-center w-full">
                          <div>
                              <h1 className="text-4xl md:text-6xl font-black mb-1 italic tracking-tighter font-bebas text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white drop-shadow-md">
                                  {selectedTeamName} <span className="text-white">SUPER KINGS</span>
                              </h1>
                              <div className="flex items-center justify-center md:justify-start gap-2 mb-4 text-blue-200 text-sm font-medium">
                                  <Trophy size={14} className="text-yellow-400" /> 
                                  <span>Auction Purse Tracker</span>
                              </div>
                          </div>
                          
                          {/* Next Page / Game Hub Button for mobile prominent */}
                          <div className="md:hidden mt-4 w-full">
                             <button onClick={() => setMainView('hub')} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg">
                                <Gamepad2 size={18}/> Go to Games
                             </button>
                          </div>
                      </div>

                      <div className="w-full max-w-2xl bg-black/30 rounded-full h-4 mb-4 relative overflow-hidden backdrop-blur-sm border border-white/10">
                          <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out relative"
                              style={{ width: `${budgetPercent}%` }}
                          >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[pulse_2s_linear_infinite]"></div>
                          </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 max-w-2xl">
                          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
                              <div className="text-blue-200 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                  <Wallet size={12} /> Remaining
                              </div>
                              <div className="text-2xl font-bebas text-yellow-400 tracking-wide">₹{remainingBudget.toFixed(2)} <span className="text-sm">Cr</span></div>
                          </div>
                          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
                               <div className="text-blue-200 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                  <Activity size={12} /> Spent
                              </div>
                              <div className="text-2xl font-bebas text-white tracking-wide">₹{totalSpent.toFixed(2)} <span className="text-sm">Cr</span></div>
                          </div>
                          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
                               <div className="text-blue-200 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                                  <Zap size={12} /> Total Points
                              </div>
                              <div className="text-2xl font-bebas text-green-400 tracking-wide">{totalPoints}</div>
                          </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="md:hidden bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm overflow-x-auto">
              <div className="flex min-w-max px-4">
                   {['squad', 'results', 'stats', 'news', 'table'].map((tab) => (
                     <button 
                        key={tab}
                        onClick={() => setActiveDashboardTab(tab as any)}
                        className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeDashboardTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
                     >
                       {tab}
                     </button>
                   ))}
              </div>
            </div>

            <main className="flex-grow px-4 md:px-6 py-8 max-w-[1400px] mx-auto w-full space-y-8">
              
              {activeDashboardTab === 'news' ? (
                 <NewsDashboard allTeams={allTeams} />
              ) : activeDashboardTab === 'stats' ? (
                 <TeamStats players={players} teamData={teamData} totalSpent={totalSpent} />
              ) : loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#19398a]"></div>
                 </div>
              ) : players.length === 0 ? (
                 <div className="text-center py-20 text-gray-400 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h2 className="text-xl font-bold text-gray-500">Your Squad is Empty</h2>
                    <p className="text-sm mt-2">Go to the Auction Room to start building your team.</p>
                 </div>
              ) : (
                 <>
                   {activeDashboardTab === 'squad' && (
                     <div className="space-y-12 animate-in fade-in duration-500">
                       {/* Batters */}
                       {batters.length > 0 && (
                         <section>
                           <h2 className="text-2xl font-black italic text-[#11141C] mb-4 pb-2 border-b-4 border-yellow-400 inline-block pr-12 font-bebas tracking-wide">
                              BATTERS <span className="text-gray-400 text-lg not-italic font-sans font-normal ml-2">({batters.length})</span>
                           </h2>
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                             {batters.map((p, idx) => (
                               <PlayerCard 
                                 key={idx} 
                                 player={p} 
                                 teamColor="#F2C94C" 
                                 isMVP={p.points === maxPoints && maxPoints > 0} 
                                 onClick={() => setSelectedPlayerForModal(p)} 
                               />
                             ))}
                           </div>
                         </section>
                       )}

                       {/* All Rounders */}
                       {allRounders.length > 0 && (
                         <section>
                           <h2 className="text-2xl font-black italic text-[#11141C] mb-4 pb-2 border-b-4 border-green-500 inline-block pr-12 font-bebas tracking-wide">
                              ALL ROUNDERS <span className="text-gray-400 text-lg not-italic font-sans font-normal ml-2">({allRounders.length})</span>
                           </h2>
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                             {allRounders.map((p, idx) => (
                               <PlayerCard 
                                 key={idx} 
                                 player={p} 
                                 teamColor="#27AE60" 
                                 isMVP={p.points === maxPoints && maxPoints > 0} 
                                 onClick={() => setSelectedPlayerForModal(p)}
                               />
                             ))}
                           </div>
                         </section>
                       )}

                       {/* Bowlers */}
                       {bowlers.length > 0 && (
                         <section>
                           <h2 className="text-2xl font-black italic text-[#11141C] mb-4 pb-2 border-b-4 border-blue-500 inline-block pr-12 font-bebas tracking-wide">
                              BOWLERS <span className="text-gray-400 text-lg not-italic font-sans font-normal ml-2">({bowlers.length})</span>
                           </h2>
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                             {bowlers.map((p, idx) => (
                               <PlayerCard 
                                  key={idx} 
                                  player={p} 
                                  teamColor="#2F80ED" 
                                  isMVP={p.points === maxPoints && maxPoints > 0} 
                                  onClick={() => setSelectedPlayerForModal(p)}
                               />
                             ))}
                           </div>
                         </section>
                       )}
                     </div>
                   )}

                   {activeDashboardTab === 'results' && (
                     <TeamBuilder players={players} teamName={selectedTeamName} />
                   )}

                   {activeDashboardTab === 'table' && (
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
                                          <div className="flex flex-col">
                                             <span>{player.player}</span>
                                             {player.isOverseas && <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1"><Plane size={10}/> Overseas</span>}
                                          </div>
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

            {selectedPlayerForModal && (
               <PlayerDetailModal 
                  player={selectedPlayerForModal} 
                  onClose={() => setSelectedPlayerForModal(null)} 
               />
            )}
         </>
      )}

      {/* --- GAMES VIEW --- */}
      {mainView === 'games' && (
         <div className="flex-grow px-4 py-8 max-w-[1400px] mx-auto w-full">
            <button onClick={() => setMainView('hub')} className="mb-4 text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-bold">
               <ArrowRight className="rotate-180" size={16} /> Back to Hub
            </button>
            {activeGameRound === 'round1' && <Round1 />}
            {activeGameRound === 'round2' && <Round2 />}
            {activeGameRound === 'round3' && <Round3 />}
            {activeGameRound === 'round4' && <Round4 />}
            {activeGameRound === 'round5' && <Round5 />}
            {activeGameRound === 'retired' && <RetiredPlayers />}
            {activeGameRound === 'budget' && <BudgetPlayers />}
         </div>
      )}

      {mainView !== 'hub' && (
         <footer className="bg-[#11141C] text-gray-400 py-8 text-center text-sm mt-auto border-t-4 border-orange-500">
            <p className="font-bebas tracking-widest text-lg text-white mb-2">IPL AUCTION 2025</p>
            <p>&copy; 2025 Auction Dashboard. All rights reserved.</p>
         </footer>
      )}
    </div>
  );
};

// ... TeamStats, PlayerDetailModal, NewsDashboard, PlayerCard, TeamBuilder Components remain unchanged (omitted for brevity but they are part of the file) ...
// (Adding these back to ensure the file is complete and compilable)

const TeamStats: React.FC<{ players: EnrichedPlayer[], teamData: FirebaseTeamData | null, totalSpent: number }> = ({ players, teamData, totalSpent }) => {
   const battersCount = players.filter(p => p.role === 'Batter').length;
   const bowlersCount = players.filter(p => p.role === 'Bowler').length;
   const allRoundersCount = players.filter(p => p.role === 'All-Rounder').length;
   
   const overseasCount = players.filter(p => p.isOverseas).length;
   const indianCount = players.length - overseasCount;
   const isOverseasLimitExceeded = overseasCount > 8;

   const spendingOnBatters = players.filter(p => p.role === 'Batter').reduce((sum, p) => sum + p.price, 0);
   const spendingOnBowlers = players.filter(p => p.role === 'Bowler').reduce((sum, p) => sum + p.price, 0);
   const spendingOnAR = players.filter(p => p.role === 'All-Rounder').reduce((sum, p) => sum + p.price, 0);

   const sortedByROI = [...players].sort((a, b) => (b.points / (b.price || 1)) - (a.points / (a.price || 1)));
   const bestValuePlayer = sortedByROI[0];

   const sortedByPrice = [...players].sort((a, b) => b.price - a.price);
   const mostExpensivePlayer = sortedByPrice[0];

   const avgCostBatter = battersCount ? (spendingOnBatters / battersCount).toFixed(2) : "0";
   const avgCostBowler = bowlersCount ? (spendingOnBowlers / bowlersCount).toFixed(2) : "0";

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
         {isOverseasLimitExceeded && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex items-center gap-3">
                 <AlertTriangle className="text-red-500" />
                 <div>
                    <h4 className="text-red-700 font-bold">Overseas Limit Exceeded!</h4>
                    <p className="text-red-600 text-sm">You have {overseasCount} foreign players. Maximum allowed is 8.</p>
                 </div>
             </div>
         )}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
               <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Squad Composition</h3>
               <div className="flex items-center justify-between">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Batters: <b>{battersCount}</b>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Bowlers: <b>{bowlersCount}</b>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> All-Rounders: <b>{allRoundersCount}</b>
                     </div>
                  </div>
                  <div className="relative w-20 h-20">
                     <PieChart className="w-full h-full text-gray-100" />
                     <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#19398a]">{players.length}</div>
                  </div>
               </div>
            </div>
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${isOverseasLimitExceeded ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}>
               <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Overseas Slots</h3>
               <div className="flex items-end gap-2 mb-2">
                  <span className={`text-4xl font-black ${isOverseasLimitExceeded ? 'text-red-600' : 'text-[#11141C]'}`}>{overseasCount}</span>
                  <span className="text-gray-400 text-sm font-medium mb-1.5">/ 8 Limit</span>
               </div>
               <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isOverseasLimitExceeded ? 'bg-red-500' : 'bg-purple-600'}`} style={{ width: `${Math.min((overseasCount/8)*100, 100)}%` }}></div>
               </div>
               <p className="text-xs text-gray-400 mt-2">{indianCount} Indian Players</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Budget Split</h3>
               <div className="space-y-3">
                  <div>
                     <div className="flex justify-between text-xs mb-1">
                        <span>Batting</span>
                        <span className="font-bold">{(spendingOnBatters/totalSpent * 100).toFixed(0)}%</span>
                     </div>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-yellow-400 h-full rounded-full" style={{ width: `${spendingOnBatters/totalSpent * 100}%` }}></div></div>
                  </div>
                  <div>
                     <div className="flex justify-between text-xs mb-1">
                        <span>Bowling</span>
                        <span className="font-bold">{(spendingOnBowlers/totalSpent * 100).toFixed(0)}%</span>
                     </div>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${spendingOnBowlers/totalSpent * 100}%` }}></div></div>
                  </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                        <span>All-Round</span>
                        <span className="font-bold">{(spendingOnAR/totalSpent * 100).toFixed(0)}%</span>
                     </div>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-green-500 h-full rounded-full" style={{ width: `${spendingOnAR/totalSpent * 100}%` }}></div></div>
                  </div>
               </div>
            </div>
            <div className="bg-gradient-to-br from-[#19398a] to-[#2a4db3] p-6 rounded-xl shadow-md text-white">
               <h3 className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={14} /> Efficiency</h3>
               <div className="text-3xl font-bebas tracking-wide mb-1">
                  {(players.reduce((sum, p) => sum + (p.points || 0), 0) / (totalSpent || 1)).toFixed(2)}
               </div>
               <p className="text-xs text-blue-200 font-medium">Points Per Crore Spent</p>
               <div className="mt-4 pt-4 border-t border-white/10 text-xs flex justify-between">
                  <span>Avg Age (Est)</span>
                  <span className="font-bold">27.5 Yrs</span>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bestValuePlayer && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
                 <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Best Value Buy</h4>
                    <div className="text-xl font-black text-[#11141C]">{bestValuePlayer.player}</div>
                    <div className="text-xs text-green-600 font-bold mt-1">
                       {(bestValuePlayer.points / bestValuePlayer.price).toFixed(1)} Pts/Cr • ₹{bestValuePlayer.price} Cr
                    </div>
                 </div>
                 <img src={bestValuePlayer.image || ""} className="w-16 h-16 object-cover object-top rounded-full ml-auto border-2 border-green-100" />
              </div>
            )}
            {mostExpensivePlayer && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
                 <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                    <Award size={24} />
                 </div>
                 <div>
                    <h4 className="text-gray-500 text-xs font-bold uppercase">Premium Pick</h4>
                    <div className="text-xl font-black text-[#11141C]">{mostExpensivePlayer.player}</div>
                    <div className="text-xs text-yellow-600 font-bold mt-1">
                       ₹{mostExpensivePlayer.price} Cr • {mostExpensivePlayer.points} Pts
                    </div>
                 </div>
                 <img src={mostExpensivePlayer.image || ""} className="w-16 h-16 object-cover object-top rounded-full ml-auto border-2 border-yellow-100" />
              </div>
            )}
         </div>
         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
               <h3 className="text-[#19398a] font-bold flex items-center gap-2"><Calculator size={18} /> Role Economics</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 text-center">
                   <div className="text-gray-400 text-xs font-bold uppercase mb-2">Avg Cost (Batter)</div>
                   <div className="text-2xl font-black text-[#11141C]">₹{avgCostBatter} Cr</div>
                </div>
                <div className="p-6 text-center">
                   <div className="text-gray-400 text-xs font-bold uppercase mb-2">Avg Cost (Bowler)</div>
                   <div className="text-2xl font-black text-[#11141C]">₹{avgCostBowler} Cr</div>
                </div>
                <div className="p-6 text-center">
                   <div className="text-gray-400 text-xs font-bold uppercase mb-2">Most Expensive Role</div>
                   <div className="text-2xl font-black text-[#19398a]">
                      {spendingOnBatters > spendingOnBowlers && spendingOnBatters > spendingOnAR ? "Batters" : 
                       spendingOnBowlers > spendingOnAR ? "Bowlers" : "All-Rounders"}
                   </div>
                </div>
             </div>
         </div>
      </div>
   );
};

const PlayerDetailModal: React.FC<{ player: EnrichedPlayer, onClose: () => void }> = ({ player, onClose }) => {
   useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; }
   }, []);

   const efficiency = (player.points / player.price).toFixed(2);
   let verdict = "Solid Pick";
   if (parseFloat(efficiency) > 1.5) verdict = "Steal Buy!";
   if (parseFloat(efficiency) < 0.5) verdict = "Overpriced?";

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
         <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="h-32 bg-gradient-to-r from-[#004BA0] to-[#19398a] relative">
               <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors">
                  <X size={20} />
               </button>
               <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="px-8 relative -mt-20 text-center">
               <div className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative z-10">
                   <img 
                     src={player.image || "https://www.iplt20.com/assets/images/default-headshot.png"} 
                     alt={player.player} 
                     className="w-full h-full object-cover object-top"
                  />
               </div>
               <h2 className="text-3xl font-black text-[#11141C] uppercase font-bebas mt-4 tracking-wide">{player.player}</h2>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider mt-2">
                  {player.role} {player.isOverseas && "• Overseas"}
               </div>
            </div>
            <div className="p-8">
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                     <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Auction Price</p>
                     <p className="text-2xl font-black text-[#19398a]">₹{player.price} Cr</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                     <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Fantasy Points</p>
                     <p className="text-2xl font-black text-green-600">{player.points}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     <Activity size={18} className="text-orange-500" /> Scouting Report
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                     {player.player} is a key asset for the squad. Acquired for <span className="font-bold text-gray-800">₹{player.price} Cr</span>, 
                     they bring a fantasy value of {player.points} points. 
                     Based on the price-to-performance ratio, this looks like a <span className="font-bold text-[#19398a]">{verdict}</span>.
                  </p>
               </div>
               <button onClick={onClose} className="w-full mt-8 bg-[#19398a] text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-[#112866] transition-colors">
                  Close Profile
               </button>
            </div>
         </div>
      </div>
   );
};

const NewsDashboard: React.FC<{ allTeams: Record<string, FirebaseTeamData> }> = ({ allTeams }) => {
   const stats = Object.entries(allTeams).map(([user, data]) => {
      const playerList = data.players || [];
      const totalPoints = playerList.reduce((acc: number, p: any) => acc + (p.points || 0), 0);
      return {
         user,
         totalPoints,
         remainingBudget: data.remainingBudget || 0,
         totalSpent: data.totalSpent || 0,
         playerCount: playerList.length,
         players: playerList,
         batters: playerList.filter((p: any) => {
             const originalCat = PLAYERS_DB[p.player]?.category || 'Players';
             const role = SPECIFIC_PLAYER_ROLES[p.player] || ROLE_MAPPING[originalCat] || 'Batter';
             return role === 'Batter';
         }).length,
         bowlers: playerList.filter((p: any) => {
             const originalCat = PLAYERS_DB[p.player]?.category || 'Players';
             const role = SPECIFIC_PLAYER_ROLES[p.player] || ROLE_MAPPING[originalCat] || 'Batter';
             return role === 'Bowler';
         }).length,
         allRounders: playerList.filter((p: any) => {
             const originalCat = PLAYERS_DB[p.player]?.category || 'Players';
             const role = SPECIFIC_PLAYER_ROLES[p.player] || ROLE_MAPPING[originalCat] || 'Batter';
             return role === 'All-Rounder';
         }).length,
         overseas: playerList.filter((p: any) => KNOWN_OVERSEAS.has(p.player)).length
      };
   });

   const pointsLeaderboard = [...stats].sort((a, b) => b.totalPoints - a.totalPoints);
   const budgetLeaderboard = [...stats].sort((a, b) => b.remainingBudget - a.remainingBudget);
   const richest = budgetLeaderboard[0];
   const smartSpenders = [...stats].sort((a, b) => (b.totalPoints/(b.totalSpent||1)) - (a.totalPoints/(a.totalSpent||1)));

   const getRole = (playerName: string): PlayerRole => {
      const dbEntry = PLAYERS_DB[playerName];
      const originalCategory = dbEntry?.category || 'Players';
      return SPECIFIC_PLAYER_ROLES[playerName] || ROLE_MAPPING[originalCategory] || 'Batter';
   };

   let allPlayers: any[] = [];
   stats.forEach(team => {
      if(team.players) {
         team.players.forEach((p: any) => {
            allPlayers.push({
               ...p,
               owner: team.user,
               image: PLAYERS_DB[p.player]?.image,
               role: getRole(p.player)
            });
         });
      }
   });

   const topBatters = allPlayers.filter(p => p.role === 'Batter').sort((a, b) => b.price - a.price).slice(0, 3);
   const topAllRounders = allPlayers.filter(p => p.role === 'All-Rounder').sort((a, b) => b.price - a.price).slice(0, 3);
   const topBowlers = allPlayers.filter(p => p.role === 'Bowler').sort((a, b) => b.price - a.price).slice(0, 3);

   const TopBuysSection = ({ title, iconUrl, players, accentColor }: any) => (
      <div className="mb-12">
         <h3 className="text-2xl font-bold text-[#11141C] mb-6 flex items-center gap-3 border-b border-gray-200 pb-3">
            <img src={iconUrl} alt="" className="w-8 h-8" />
            {title}
         </h3>
         {players.length === 0 ? (
            <p className="text-gray-500 italic text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">No players sold in this category yet.</p>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {players.map((player: any, idx: number) => (
                  <div key={`${player.player}-${idx}`} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden flex flex-col relative group hover:shadow-xl transition-all duration-300">
                     <div className={`absolute top-0 left-0 w-full h-1 ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-700'}`}></div>
                     <div className="absolute top-3 right-3 z-10">
                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-500' : 'bg-orange-700'}`}>
                           #{idx + 1}
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
                           <span className={`text-xl font-black ${accentColor}`}>₹{player.price} Cr</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );

   return (
      <div className="space-y-10 animate-in fade-in duration-700">
         <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
             <div className="bg-[#11141C] text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <Layers className="text-blue-400" /> Auction Overview
                </h3>
                <span className="text-xs uppercase text-gray-400 tracking-wider">Squad Matrix</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
                         <th className="px-4 py-3">Team</th>
                         <th className="px-4 py-3 text-center">Batters</th>
                         <th className="px-4 py-3 text-center">All-Rounders</th>
                         <th className="px-4 py-3 text-center">Bowlers</th>
                         <th className="px-4 py-3 text-center">Overseas</th>
                         <th className="px-4 py-3 text-center bg-blue-50">Total</th>
                         <th className="px-4 py-3 text-right">Purse Left</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-sm">
                      {pointsLeaderboard.map((team) => (
                         <tr key={team.user} className="hover:bg-blue-50/50">
                            <td className="px-4 py-3 font-bold text-[#11141C] border-r border-gray-100">{team.user}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{team.batters}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{team.allRounders}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{team.bowlers}</td>
                            <td className="px-4 py-3 text-center font-medium text-purple-600">{team.overseas}</td>
                            <td className="px-4 py-3 text-center font-bold bg-blue-50 text-blue-800">{team.playerCount}</td>
                            <td className="px-4 py-3 text-right font-mono font-medium text-green-700">₹{team.remainingBudget.toFixed(2)}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
               <div className="bg-[#19398a] text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     <TrendingUp className="text-green-400" /> Points Table
                  </h3>
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
            <div className="space-y-6">
               <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                     <Zap size={18} className="text-yellow-500" />
                     Smartest Spenders
                  </h4>
                  <div className="space-y-4">
                     {smartSpenders.slice(0, 5).map((team, idx) => (
                        <div key={team.user} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                           <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${idx===0 ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                                 {idx + 1}
                              </span>
                              <span className="text-gray-700 font-medium">{team.user}</span>
                           </div>
                           <span className="font-bold text-[#19398a]">{(team.totalPoints / (team.totalSpent || 1)).toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">pts/cr</span></span>
                        </div>
                     ))}
                  </div>
               </div>
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
            </div>
         </div>
         <div>
            <h2 className="text-3xl font-bold text-[#11141C] mb-8 flex items-center gap-2">
               <Award className="text-orange-500 w-8 h-8" />
               Record Breakers
            </h2>
            <TopBuysSection 
               title="Most Expensive Batters" 
               iconUrl="https://www.iplt20.com/assets/images/teams-batter-icon.svg" 
               players={topBatters}
               accentColor="text-yellow-600"
            />
            <TopBuysSection 
               title="Most Expensive All-Rounders" 
               iconUrl="https://www.iplt20.com/assets/images/teams-all-rounder-icon.svg" 
               players={topAllRounders}
               accentColor="text-green-600"
            />
            <TopBuysSection 
               title="Most Expensive Bowlers" 
               iconUrl="https://www.iplt20.com/assets/images/teams-bowler-icon.svg" 
               players={topBowlers}
               accentColor="text-blue-600"
            />
         </div>
      </div>
   );
};

const PlayerCard: React.FC<{ 
   player: EnrichedPlayer, 
   teamColor: string, 
   isMVP?: boolean,
   onClick?: () => void 
}> = ({ player, teamColor, isMVP, onClick }) => {
   return (
     <div 
       onClick={onClick}
       className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative border flex flex-col h-full cursor-pointer ${isMVP ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-gray-100'}`}
     >
       {isMVP && (
         <div className="absolute top-0 right-4 z-30 bg-yellow-400 text-[#11141C] font-black text-xs px-2 py-1.5 rounded-b-lg shadow-sm flex flex-col items-center leading-none">
            <Trophy size={14} className="mb-0.5" />
            <span>MVP</span>
         </div>
       )}
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
       <div className="h-72 relative flex items-end justify-center bg-gradient-to-b from-gray-50 to-gray-200 overflow-hidden shrink-0">
         <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent"></div>
         {player.image ? (
           <img 
             src={player.image} 
             alt={player.player} 
             className="h-full w-full object-contain object-bottom transform group-hover:scale-110 transition-transform duration-700"
           />
         ) : (
           <div className="h-full w-full flex items-center justify-center text-gray-300">
             <User className="w-24 h-24" />
           </div>
         )}
         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
       </div>
       <div className="h-1.5 w-full relative z-10" style={{ backgroundColor: teamColor }}></div>
       <div className="p-4 bg-white relative flex-grow flex flex-col justify-between">
          <div>
              <h3 className="text-xl font-black text-[#11141C] uppercase leading-tight mb-1 font-bebas tracking-wide truncate group-hover:text-[#19398a] transition-colors">
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
             <div className="text-xs font-semibold text-white bg-gray-800 px-2 py-1 rounded">
                {player.points} Pts
             </div>
          </div>
       </div>
     </div>
   );
};

const TeamBuilder: React.FC<{ players: EnrichedPlayer[], teamName: string }> = ({ players, teamName }) => {
  const [playing12, setPlaying12] = useState<EnrichedPlayer[]>([]);
  const [bench, setBench] = useState<EnrichedPlayer[]>([]);

  useEffect(() => {
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