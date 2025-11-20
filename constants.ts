import { PlayerImageInfo } from "./types";

// List of users acting as "Teams"
export const USERS = [
  "Sujin", "Ajin", "Abi", "Asoke", "Kamal", "Anish", 
  "DD", "Raja", "Aswath", "Varshan","Bathri", "rrk", "Gokul", "Jerwin"
];

// Mapping raw categories to IPL Roles
export const ROLE_MAPPING: Record<string, 'Batter' | 'Bowler' | 'All-Rounder'> = {
  Wicketkeepers: 'Batter',
  Openers: 'Batter',
  MiddleOrder: 'Batter',
  AllRounders: 'All-Rounder',
  Spinners: 'Bowler',
  FastBowlers: 'Bowler',
  ForeignPlayers: 'Batter', // Defaulting to batter if generic
  IndianPlayers: 'Batter',
  Players: 'Batter'
};

// Flattened player database from the user's original HTML
// This is used to lookup images and original categories
export const PLAYERS_DB: Record<string, { image: string | null, category: string }> = {};

// Helper to populate DB (simulating the structure from the provided code)
const populate = (category: string, list: PlayerImageInfo[]) => {
  list.forEach(p => {
    PLAYERS_DB[p.name] = { image: p.image, category };
  });
};

// Data taken directly from the user's HTML to ensure images match
populate("Wicketkeepers", [
  { "name": "Jos Buttler", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201257.png" },
  { "name": "Deepak Chahar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201626.png" },
  { "name": "Krishnappa Gowtham", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200239.png" },
  { "name": "Sunil Narine", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193027.png" },
  { "name": "T. Natarajan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201334.png" },
  { "name": "David Warner", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183648.png" },
  { "name": "Venkatesh Iyer", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193524.png" },
  { "name": "Mohammad Siraj", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201314.png" },
  { "name": "Matheesha Pathirana", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201013.png" },
  { "name": "Ravi Bishnoi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195806.png" },
  { "name": "Daryl Mitchell", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183745.png" },
  { "name": "KS Bharat", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141736.png" },
  { "name": "Mayank Markande", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200014.png" },
  { "name": "Mayank Agarwal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204108.png" },
  { "name": "Rahul Tewatia", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193422.png" },
  { "name": "Tim David", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185037.png" },
  { "name": "Travis Head", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184945.png" },
  { "name": "Rahul Chahar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195905.png" },
  { "name": "Mohammad Rizwan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183808.png" },
  { "name": "Rinku Singh", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185434.png" }
]);

populate("Openers", [
  { "name": "Rishab Pant", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.140645.png" },
  { "name": "virat", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184806.png" },
  { "name": "Shreyas Iyer", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190542.png" },
  { "name": "Faf du Plessis", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183554.png" },
  { "name": "Axar Patel", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193359.png" },
  { "name": "Dhruv Jurel", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190333.png" },
  { "name": "Ben Stokes", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193008.png" },
  { "name": "KL Rahul", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141347.png" },
  { "name": "Rachin Ravindra", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193326.png" },
  { "name": "Nitish Reddy", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193713.png" },
  { "name": "Ravindra Jadeja", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193307.png" },
  { "name": "Dewald breavis", "image": null },
  { "name": "Yashasvi Jaiswal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183422.png" },
  { "name": "Shahrukh Khan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185406.png" },
  { "name": "Shivam Dube", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185300.png" },
  { "name": "Washington Sundar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193437.png" },
  { "name": "Romario Shepherd", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193201.png" },
  { "name": "Ravichandran Ashwin", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195653.png" },
  { "name": "Yuzvendra Chahal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195821.png" },
  { "name": "Jofra Archer", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201202.png" },
  { "name": "Jasprit Bumrah", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201132.png" },
  { "name": "urvil patel", "image": null },
  { "name": "ayuesh matra", "image": null },
  { "name": "Will Jacks", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184902.png" },
  { "name": "Jonny Bairstow", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141258.png" },
  { "name": "Rovman Powell", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185221.png" },
  { "name": "Rahul Tripathi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185245.png" },
  { "name": "Deepak Hooda", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185324.png" },
  { "name": "Lungi Ngidi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203252.png" },
  { "name": "Mark Wood", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203135.png" }
]);

populate("MiddleOrder", [
  { "name": "Nicholas Pooran", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.140502.png" },
  { "name": "Phil Salt", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.140719.png" },
  { "name": "Sai Sudharsan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183530.png" },
  { "name": "Abhishek Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183347.png" },
  { "name": "Suryakumar Yadav", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184827.png" },
  { "name": "Umran Malik", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201555.png" },
  { "name": "pryanch arya", "image": null },
  { "name": "Rajat Patidar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190426.png" },
  { "name": "vaivabu suryavanshi", "image": null },
  { "name": "Cameron Green", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193251.png" },
  { "name": "Kuldeep Yadav", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195728.png" },
  { "name": "Maheesh Theekshana", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200034.png" },
  { "name": "Moeen Ali", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193540.png" },
  { "name": "Mitchell Starc", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201031.png" },
  { "name": "Trent Boult", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201115.png" },
  { "name": "Tristan Stubbs", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185150.png" },
  { "name": "Shubman Gill", "image": "gill.png" },
  { "name": "Shardul Thakur", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201450.png" },
  { "name": "Suyash Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204227.png" },
  { "name": "Sam Curran", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193342.png" }
]);

populate("AllRounders", [
  { "name": "Sanju Samson", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141647.png" },
  { "name": "Sameer Rizvi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190514.png" },
  { "name": "Ruturaj Gaikwad", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183245.png" },
  { "name": "Steve Smith", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190759.png" },
  { "name": "Shimron Hetmyer", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185004.png" },
  { "name": "Krunal Pandya", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193642.png" },
  { "name": "Anrich Nortje", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201101.png" },
  { "name": "Karn Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200153.png" },
  { "name": "Dhoni", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141108.png" },
  { "name": "Quinton De Kock", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/qdk.png" },
  { "name": "Ishan Kishan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141208.png" },
  { "name": "David Miller", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184738.png" },
  { "name": "Naveen-ul-Haq", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201348.png" },
  { "name": "Noor Ahmad", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195708.png" },
  { "name": "Gerald Coetzee", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.202012.png" },
  { "name": "Rohit", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183311.png" },
  { "name": "Devon Conway", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141622.png" },
  { "name": "Mitchell Marsh", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193236.png" },
  { "name": "Glenn Phillips", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193852.png" },
  { "name": "Mohammad Shami", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201249.png" }
]);

populate("Spinners", [
  { "name": "Sandeep Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201740.png" },
  { "name": "Marcus Stoinis", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193143.png" },
  { "name": "Avesh Khan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201608.png" },
  { "name": "Marco Jansen", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201417.png" },
  { "name": "Mohit Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201435.png" },
  { "name": "Karun Nair", "image": null },
  { "name": "Prasidh Krishna", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201526.png" },
  { "name": "Glenn Maxwell", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193127.png" },
  { "name": "Ishant Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201507.png" },
  { "name": "Tushar Deshpande", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201759.png" },
  { "name": "Ajinkya Rahane", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190125.png" },
  { "name": "Pat Cummins", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201405.png" },
  { "name": "Josh Hazlewood", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201233.png" },
  { "name": "Jitesh Sharma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141502.png" }
]);

populate("FastBowlers", [
  { "name": "Shai Hope", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141759.png" },
  { "name": "Shahbaz Ahmed", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190736.png" },
  { "name": "Rahmanullah Gurbaz", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141324.png" },
  { "name": "Anuj Rawat", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.141601.png" },
  { "name": "Kane Williamson", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.183725.png" },
  { "name": "Lalit Yadav", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204259.png" },
  { "name": "Devdutt Padikkal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204135.png" },
  { "name": "Kedar Jadhav ", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185106.png" },
  { "name": "Manish Pandey", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190106.png" },
  { "name": "Harshal Patel", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201829.png" },
  { "name": "Ayush Badoni", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190157.png" },
  { "name": "Abdul Samad", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190248.png" },
  { "name": "Sarfaraz Khan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190605.png" },
  { "name": "Nitish Rana", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190408.png" },
  { "name": "Yash Dayal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204410.png" },
  { "name": "Kyle Mayers", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193955.png" },
  { "name": "Harry Brook", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190817.png" },
  { "name": "Lockie Ferguson", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201711.png" },
  { "name": "Nuwan Thushara", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201815.png" },
  { "name": "Khaleel Ahmed", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201844.png" }
]);

populate("ForeignPlayers", [
  { "name": "Jake Fraser-McGurk", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.184920.png" },
  { "name": "Heinrich Klaasen", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.185129.png" },
  { "name": "Tilak Verma", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190311.png" },
  { "name": "Andre Russell", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193053.png" },
  { "name": "Hardik Pandya", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193112.png" },
  { "name": "Liam Livingstone", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193217.png" },
  { "name": "Rashid Khan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195629.png" },
  { "name": "Varun Chakravarthy", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195749.png" },
  { "name": "Kagiso Rabada", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201046.png" },
  { "name": "Arshdeep Singh", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201144.png" },
  { "name": "Bhuvneshwar Kumar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201219.png" },
  { "name": "Umesh Yadav", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201540.png" },
  { "name": "Riyan Parag", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190352.png" },
  { "name": "Wanindu Hasaranga", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200050.png" },
  { "name": "Prabhsimran Singh", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190648.png" },
  { "name": "Harshit Rana", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204338.png" },
  { "name": "Mitchell Santner", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193611.png" },
  { "name": "Evin Lewis", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203359.png" },
  { "name": "Nathan Ellis", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201640.png" },
  { "name": "Aiden Markram", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193813.png" }
]);

populate("IndianPlayers", [
  { "name": "Tom Latham", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.202956.png" },
  { "name": "Sam Billings", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203014.png" },
  { "name": "Reeza Hendricks", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203030.png" },
  { "name": "Dwaine Pretorius", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203104.png" },
  { "name": "Ish Sodhi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203118.png" },
  { "name": "Babar Azam", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203153.png" },
  { "name": "Shaheen Afridi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203209.png" },
  { "name": "Chris Woakes", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203238.png" },
  { "name": "James Neesham", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203307.png" },
  { "name": "Tom Curran", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203325.png" },
  { "name": "Jason Behrendorff", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203414.png" },
  { "name": "Matthew Wade", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203435.png" },
  { "name": "Jason Roy", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.203450.png" },
  { "name": "Kamlesh Nagarkoti", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204153.png" },
  { "name": "Shivam Mavi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204209.png" },
  { "name": "Chetan Sakariya", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204320.png" },
  { "name": "Arjun Tendulkar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204355.png" },
  { "name": "Sandeep Warrier", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204433.png" },
  { "name": "Suyash Prabhudessai", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.204457.png" },
  { "name": "Abhinav Manohar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190455.png" },
  { "name": "Narayan Jagadeesan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190625.png" },
  { "name": "Rilee Rossouw", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.190843.png" },
  { "name": "Jason Holder", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193736.png" },
  { "name": "Mohammad Nabi", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193751.png" },
  { "name": "Vijay Shankar", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193911.png" },
  { "name": "Shakib Al Hasan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.193939.png" },
  { "name": "R. Sai Kishore", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.195928.png" },
  { "name": "Adam Zampa", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200104.png" },
  { "name": "Shreyas Gopal", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200128.png" },
  { "name": "Adil Rashid", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.200256.png" },
  { "name": "Alzarri Joseph", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201910.png" },
  { "name": "Tim Southee", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201941.png" },
  { "name": "Chris Jordan", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.201958.png" },
  { "name": "Spencer Johnson", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-03-16.202034.png" }
]);

populate("Players", [
  { "name": "Kieron Pollard", "image": "https://github.com/gjhklm-s/advance/releases/download/qdk/Screenshot.2025-06-12.191743.png" },
  { "name": "Suresh Raina", "image": "https://i.imgur.com/YHf2ZxE.png" },
  { "name": "AB de Villiers", "image": "https://i.imgur.com/NsZKLcf.png" },
  { "name": "Chris Gayle", "image": "https://i.imgur.com/jXk9K0R.png" },
  { "name": "Dwayne Bravo", "image": "https://i.imgur.com/qb6WrGi.png" },
  { "name": "Lasith Malinga", "image": "https://i.imgur.com/k2LdQYe.png" },
  { "name": "Harbhajan Singh", "image": "https://i.imgur.com/5Oe3Eje.png" },
  { "name": "Shane Watson", "image": "https://i.imgur.com/Oa5V2A4.png" },
  { "name": "Imran Tahir", "image": "https://i.imgur.com/9NHtI5g.png" },
  { "name": "Gautam Gambhir", "image": "https://i.imgur.com/1fVkb6H.png" },
  { "name": "Yuvraj Singh", "image": "https://i.imgur.com/WJbICxz.png" },
  { "name": "Zaheer Khan", "image": "https://i.imgur.com/ELTJtgr.png" },
  { "name": "Brett Lee", "image": "https://i.imgur.com/yexFCSM.png" },
  { "name": "Jacques Kallis", "image": "https://i.imgur.com/nrTyNbi.png" },
  { "name": "Parthiv Patel", "image": "https://i.imgur.com/T9LPaS7.png" },
  { "name": "Ashish Nehra", "image": "https://i.imgur.com/4CMwExR.png" },
  { "name": "RP Singh", "image": "https://i.imgur.com/TWuXSPq.png" },
  { "name": "Ambati Rayudu", "image": "https://i.imgur.com/M3XKJq9.png" },
  { "name": "Mitchell Johnson", "image": "https://i.imgur.com/nvOkHrk.png" },
  { "name": "Michael Hussey", "image": "https://i.imgur.com/5P8bqsm.png" },
  { "name": "Brendon McCullum", "image": "https://i.imgur.com/yx3KmRE.png" },
  { "name": "Rahul Dravid", "image": "https://i.imgur.com/WFVuCku.png" },
  { "name": "Virender Sehwag", "image": "https://i.imgur.com/sZ8pKcO.png" },
  { "name": "Matthew Hayden", "image": "https://i.imgur.com/1nAcB5V.png" },
  { "name": "Anil Kumble", "image": "https://i.imgur.com/2YuLoI2.png" },
  { "name": "Sachin Tendulkar", "image": "https://i.imgur.com/oR0xdDt.png" },
  { "name": "Adam Gilchrist", "image": "https://i.imgur.com/4g94Rkx.png" },
  { "name": "Muttiah Muralitharan", "image": "https://i.imgur.com/ZAYcK4u.png" },
  { "name": "Ricky Ponting", "image": "https://i.imgur.com/UEm7a3P.png" },
  { "name": "Kevin Pietersen", "image": "https://i.imgur.com/y3X8wkr.png" }
]);