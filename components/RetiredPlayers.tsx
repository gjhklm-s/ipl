import React from 'react';
import { Trophy, Star } from 'lucide-react';

const RetiredPlayers = () => {
  const players = [
    { name: "Kieron Pollard", role: "All-Rounder", type: "Legend" },
    { name: "Suresh Raina", role: "Batter", type: "Mr. IPL" },
    { name: "AB de Villiers", role: "Batter", type: "Alien" },
    { name: "Chris Gayle", role: "Batter", type: "Universe Boss" },
    { name: "Dwayne Bravo", role: "All-Rounder", type: "Champion" },
    { name: "Lasith Malinga", role: "Bowler", type: "Slinger" },
    { name: "Harbhajan Singh", role: "Bowler", type: "Turbanator" },
    { name: "Shane Watson", role: "All-Rounder", type: "Legend" },
    { name: "Imran Tahir", role: "Bowler", type: "Sprinter" },
    { name: "Gautam Gambhir", role: "Batter", type: "Captain" },
    { name: "Yuvraj Singh", role: "All-Rounder", type: "Sixer King" },
    { name: "Zaheer Khan", role: "Bowler", type: "Zak" },
    { name: "Brett Lee", role: "Bowler", type: "Speedster" },
    { name: "Jacques Kallis", role: "All-Rounder", type: "King Kallis" },
    { name: "Parthiv Patel", role: "Batter/WK", type: "Pocket Dynamo" },
    { name: "Ashish Nehra", role: "Bowler", type: "Nehra Ji" },
    { name: "RP Singh", role: "Bowler", type: "Swinger" },
    { name: "Ambati Rayudu", role: "Batter", type: "Bahubali" },
    { name: "Mitchell Johnson", role: "Bowler", type: "Mitch" },
    { name: "Michael Hussey", role: "Batter", type: "Mr. Cricket" },
    { name: "Brendon McCullum", role: "Batter", type: "Baz" },
    { name: "Rahul Dravid", role: "Batter", type: "The Wall" },
    { name: "Virender Sehwag", role: "Batter", type: "Viru" },
    { name: "Matthew Hayden", role: "Batter", type: "Haydos" },
    { name: "Anil Kumble", role: "Bowler", type: "Jumbo" },
    { name: "Sachin Tendulkar", role: "Batter", type: "God" },
    { name: "Adam Gilchrist", role: "Batter/WK", type: "Gilly" },
    { name: "Muttiah Muralitharan", role: "Bowler", type: "Wizard" },
    { name: "Ricky Ponting", role: "Batter", type: "Punter" },
    { name: "Kevin Pietersen", role: "Batter", type: "KP" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic text-[#11141C] font-bebas tracking-wide mb-2">HALL OF FAME</h1>
        <p className="text-gray-500">Celebrating the icons who defined the league.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((p, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 hover:shadow-lg transition-shadow group">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-colors">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 leading-none mb-1">{p.name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{p.role}</span>
                <span className="text-gray-400 flex items-center gap-1"><Star size={10}/> {p.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetiredPlayers;