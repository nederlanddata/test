// 'use client';
// import { useState } from 'react';
// import data from "@/public/gemeenten_cijfers.json";
// import GemeenteCard from "@/components/GemeenteCard";

// export default function Home() {
//   // Sorteer-status met alle categorieën
//   const [sortOrder, setSortOrder] = useState<'woz' | 'afstand-zh' | 'afstand-ts' | 'bevolking' | 'jongeren' | 'ouderen' | 'dichtheid'>('woz');

//   // Logica om te sorteren op basis van de gekozen categorie
//   const sortedData = [...data].sort((a, b) => {
//     if (sortOrder === 'woz') return b.wozWaarde - a.wozWaarde;
//     if (sortOrder === 'afstand-zh') return a.afstandZiekenhuis - b.afstandZiekenhuis;
//     if (sortOrder === 'afstand-ts') return a.afstandTreinstation - b.afstandTreinstation;
//     if (sortOrder === 'bevolking') return b.totaleBevolking - a.totaleBevolking;
//     if (sortOrder === 'jongeren') return b.jongeren0Tot15 - a.jongeren0Tot15;
//     if (sortOrder === 'ouderen') return b.ouderen80Plus - a.ouderen80Plus;
//     if (sortOrder === 'dichtheid') return b.bevolkingsdichtheid - a.bevolkingsdichtheid;
//     return 0;
//   });

//   return (
//     <div>
//       <header className="mb-10">
//         <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Gemeenten vergelijken</h2>
//         <p className="text-slate-600 mb-6">Sorteer op verschillende categorieën om de juiste woonomgeving te vinden.</p>
        
//         {/* Sorteer knoppen (flex-wrap zodat ze netjes op meerdere regels vallen als het er veel zijn) */}
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={() => setSortOrder('woz')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'woz' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             WOZ-waarde
//           </button>
//           <button 
//             onClick={() => setSortOrder('afstand-zh')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'afstand-zh' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Afstand tot ziekenhuis
//           </button>
//           <button 
//             onClick={() => setSortOrder('afstand-ts')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'afstand-ts' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Afstand tot treinstation
//           </button>
//           <button 
//             onClick={() => setSortOrder('bevolking')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'bevolking' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Totale bevolking
//           </button>
//           <button 
//             onClick={() => setSortOrder('jongeren')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'jongeren' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Jongeren (0 t/m 15 jr)
//           </button>
//           <button 
//             onClick={() => setSortOrder('ouderen')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'ouderen' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Ouderen (80+ jr)
//           </button>
//           <button 
//             onClick={() => setSortOrder('dichtheid')}
//             className={`px-4 py-2 rounded-lg font-medium transition ${sortOrder === 'dichtheid' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
//           >
//             Bevolkingsdichtheid
//           </button>
//         </div>
//       </header>
      
//       <div className="grid md:grid-cols-1 gap-6">
//         {sortedData.map((g) => (
//           <GemeenteCard 
//             key={g.id} 
//             naam={g.naam} 
//             wozWaarde={g.wozWaarde} 
//             afstandZiekenhuis={g.afstandZiekenhuis} 
//             afstandTreinstation={g.afstandTreinstation}
//             totaleBevolking={g.totaleBevolking}
//             jongeren0Tot15={g.jongeren0Tot15}
//             ouderen80Plus={g.ouderen80Plus}
//             bevolkingsdichtheid={g.bevolkingsdichtheid}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
