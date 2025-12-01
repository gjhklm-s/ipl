import React from 'react';
import { Gamepad2, Coins, Disc, Timer, HelpCircle, History, TrendingDown, ArrowLeft } from 'lucide-react';

interface GameHubProps {
  onSelectGame: (game: 'round1' | 'round2' | 'round3' | 'round4' | 'round5' | 'retired' | 'budget') => void;
  onBack: () => void;
}

const GameHub: React.FC<GameHubProps> = ({ onSelectGame, onBack }) => {
  const games = [
    {
      id: 'round1',
      title: 'The Auction',
      description: 'Classic bidding war. Outbid rivals to secure top talent.',
      icon: <Gamepad2 size={32} className="text-purple-400" />,
      color: 'from-purple-600 to-indigo-700',
      delay: '0ms'
    },
    {
      id: 'round2',
      title: 'Hidden Bid',
      description: 'Submit a secret price. Highest unique bid wins.',
      icon: <Coins size={32} className="text-pink-400" />,
      color: 'from-pink-600 to-rose-700',
      delay: '100ms'
    },
    {
      id: 'round3',
      title: 'Bid Spinner',
      description: 'Spin the wheel to multiply your bidding power.',
      icon: <Disc size={32} className="text-blue-400" />,
      color: 'from-blue-600 to-cyan-700',
      delay: '200ms'
    },
    {
      id: 'round4',
      title: 'Dutch Auction',
      description: 'Price drops every second. Who will press the button first?',
      icon: <Timer size={32} className="text-orange-400" />,
      color: 'from-orange-600 to-red-700',
      delay: '300ms'
    },
    {
      id: 'round5',
      title: 'Find Who?',
      description: 'Guess the player from the silhouette.',
      icon: <HelpCircle size={32} className="text-emerald-400" />,
      color: 'from-emerald-600 to-green-700',
      delay: '400ms'
    }
  ];

  const extras = [
    {
      id: 'retired',
      title: 'Hall of Fame',
      icon: <History size={20} />,
      color: 'bg-gray-800'
    },
    {
      id: 'budget',
      title: 'Budget Picks',
      icon: <TrendingDown size={20} />,
      color: 'bg-teal-800'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bebas">
              GAME ARCADE
            </h1>
            <p className="text-slate-400">Select a round to begin the challenge</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-all font-bold border border-slate-700 hover:border-slate-500 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id as any)}
              className={`relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 border border-white/5 bg-gradient-to-br ${game.color} group animate-in fade-in slide-in-from-bottom-8`}
              style={{ animationDelay: game.delay }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-150 duration-500">
                {game.icon}
              </div>
              <div className="relative z-10">
                <div className="mb-4 p-3 bg-white/10 w-fit rounded-xl backdrop-blur-sm border border-white/10">
                  {game.icon}
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-wide mb-2 font-bebas">{game.title}</h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed">{game.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Extras Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {extras.map((extra) => (
            <button
              key={extra.id}
              onClick={() => onSelectGame(extra.id as any)}
              className={`flex items-center justify-between p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:bg-white/5 ${extra.color} group`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full">
                  {extra.icon}
                </div>
                <span className="text-xl font-bold tracking-wide font-bebas">{extra.title}</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-0.5 transition-transform">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GameHub;