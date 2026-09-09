// 'use client';

// import { useState, useMemo } from 'react';
// import gemeentenData from '@/public/gemeenten_cijfers.json';

// type Gemeente = {
//   id: string;
//   naam: string;
//   periode: string;
//   totaleBevolking: number;
//   jongeren0Tot15: number; // percentage
//   ouderen80Plus: number;  // percentage
//   bevolkingsdichtheid: number;
//   wozWaarde: number;
//   afstandZiekenhuis: number;
//   afstandTreinstation: number;
// };

// const data = gemeentenData as Gemeente[];

// export default function ZoekPage() {
//   // Filter states
//   const [zoekTerm, ZoekTermSet] = useState('');
//   const [maxWoz, setMaxWoz] = useState<number>(1000000); // Standaard max 1 miljoen
  
//   // Samengestelde criteria (aan/uit vinken)
//   const [criteria, setCriteria] = useState({
//     gezinsvriendelijk: false,   // Hoog % jongeren (0-15 jr)
//     goedeBereikbaarheid: false, // Dicht bij trein & ziekenhuis
//     betaalbaar: false,          // Lage WOZ-waarde
//     rustEnRuimte: false,        // Lage bevolkingsdichtheid
//   });

//   // Toggle criteria handler
//   const handleCriterionChange = (key: keyof typeof criteria) => {
//     setCriteria(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   // Bereken min en max WOZ voor de slider grenzen
//   const minWozAvailable = useMemo(() => Math.min(...data.map(d => d.wozWaarde)), []);
//   const maxWozAvailable = useMemo(() => Math.max(...data.map(d => d.wozWaarde)), []);

//   // Filter en sorteer gemeenten op basis van criteria
//   const gefilterdeGemeenten = useMemo(() => {
//     return data
//       .filter(item => {
//         // Filter op naam (als er iets getypt is)
//         const matchesNaam = item.naam.toLowerCase().includes(zoekTerm.toLowerCase());
//         // Filter op max WOZ
//         const matchesWoz = item.wozWaarde <= maxWoz;
//         return matchesNaam && matchesWoz;
//       })
//       .map(item => {
//         // Bereken een match-score op basis van de aangevinkte samengestelde wensen
//         let score = 0;
//         let maxPossibleScore = 0;

//         // 1. Gezinsvriendelijkheid (hoger % jongeren = betere score)
//         if (criteria.gezinsvriendelijk) {
//           maxPossibleScore += 100;
//           const maxJongeren = Math.max(...data.map(d => d.jongeren0Tot15));
//           score += (item.jongeren0Tot15 / maxJongeren) * 100;
//         }

//         // 2. Goede bereikbaarheid (lager is beter: trein + ziekenhuis dichtbij)
//         if (criteria.goedeBereikbaarheid) {
//           maxPossibleScore += 100;
//           const avgAfstand = (item.afstandTreinstation + item.afstandZiekenhuis) / 2;
//           const maxAfstand = Math.max(...data.map(d => (d.afstandTreinstation + d.afstandZiekenhuis) / 2));
//           // Hoe kleiner de afstand, hoe dichter bij 100 de score
//           score += ((maxAfstand - avgAfstand) / maxAfstand) * 100;
//         }

//         // 3. Betaalbaarheid (lager is beter: lagere WOZ-waarde)
//         if (criteria.betaalbaar) {
//           maxPossibleScore += 100;
//           const minWoz = Math.min(...data.map(d => d.wozWaarde));
//           const maxWozVal = Math.max(...data.map(d => d.wozWaarde));
//           score += ((maxWozVal - item.wozWaarde) / (maxWozVal - minWoz)) * 100;
//         }

//         // 4. Rust & Ruimte (lager is beter: lagere bevolkingsdichtheid)
//         if (criteria.rustEnRuimte) {
//           maxPossibleScore += 100;
//           const maxDichtheid = Math.max(...data.map(d => d.bevolkingsdichtheid));
//           score += ((maxDichtheid - item.bevolkingsdichtheid) / maxDichtheid) * 100;
//         }

//         // Bereken eindpercentage (als er geen criteria aan staan, is de score 0 of neutraal)
//         const matchPercentage = maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;

//         return { ...item, matchPercentage };
//       })
//       .sort((a, b) => {
//         // Als er criteria aan staan, sorteer op hoogste match score
//         const activeCriteriaCount = Object.values(criteria).filter(Boolean).length;
//         if (activeCriteriaCount > 0) {
//           return b.matchPercentage - a.matchPercentage;
//         }
//         // Anders alfabetisch sorteren op naam
//         return a.naam.localeCompare(b.naam);
//       });
//   }, [zoekTerm, maxWoz, criteria]);

//   return (
//     <div className="space-y-8">
//       {/* Titel sectie */}
//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">Vind jouw perfecte gemeente</h2>
//         <p className="text-sm text-slate-600 mt-1">
//           Filter op basis van jouw budget en selecteer wat jij belangrijk vindt in een woonomgeving.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Linkerkolom: Filters & Wensen */}
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
//           <h3 className="font-semibold text-slate-800 border-b pb-3">Jouw voorkeuren</h3>

//           {/* Zoek op specifieke gemeente */}
//           <div className="space-y-2">
//             <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
//               Specifieke gemeente
//             </label>
//             <input
//               type="text"
//               placeholder="Bijv. Laren, Utrecht..."
//               value={zoekTerm}
//               onChange={(e) => ZoekTermSet(e.target.value)}
//               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Maximaal budget (WOZ) */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-xs font-semibold text-slate-600">
//               <span className="uppercase tracking-wider">Max. WOZ-waarde</span>
//               <span className="text-blue-600 font-bold">€ {maxWoz.toLocaleString('nl-NL')}</span>
//             </div>
//             <input
//               type="range"
//               min={minWozAvailable}
//               max={maxWozAvailable}
//               step={25000}
//               value={maxWoz}
//               onChange={(e) => setMaxWoz(Number(e.target.value))}
//               className="w-full accent-blue-600 cursor-pointer"
//             />
//             <div className="flex justify-between text-[10px] text-slate-400">
//               <span>€ {Math.round(minWozAvailable / 1000)}k</span>
//               <span>€ {Math.round(maxWozAvailable / 1000)}k</span>
//             </div>
//           </div>

//           {/* Samengestelde criteria */}
//           <div className="space-y-3 pt-2 border-t">
//             <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
//               Wat vind je belangrijk?
//             </label>
            
//             <label className="flex items-start gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={criteria.gezinsvriendelijk}
//                 onChange={() => handleCriterionChange('gezinsvriendelijk')}
//                 className="mt-1 rounded accent-blue-600"
//               />
//               <div className="text-sm">
//                 <span className="font-medium text-slate-700 group-hover:text-slate-900">👨‍👩‍👧 Gezinsvriendelijk</span>
//                 <p className="text-xs text-slate-500">Hoog percentage jonge kinderen (0-15 jr)</p>
//               </div>
//             </label>

//             <label className="flex items-start gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={criteria.goedeBereikbaarheid}
//                 onChange={() => handleCriterionChange('goedeBereikbaarheid')}
//                 className="mt-1 rounded accent-blue-600"
//               />
//               <div className="text-sm">
//                 <span className="font-medium text-slate-700 group-hover:text-slate-900">🚆 Goede bereikbaarheid</span>
//                 <p className="text-xs text-slate-500">Dicht bij treinstation & ziekenhuis</p>
//               </div>
//             </label>

//             <label className="flex items-start gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={criteria.betaalbaar}
//                 onChange={() => handleCriterionChange('betaalbaar')}
//                 className="mt-1 rounded accent-blue-600"
//               />
//               <div className="text-sm">
//                 <span className="font-medium text-slate-700 group-hover:text-slate-900">💶 Betaalbaarheid</span>
//                 <p className="text-xs text-slate-500">Relatief lage gemiddelde WOZ-waarde</p>
//               </div>
//             </label>

//             <label className="flex items-start gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={criteria.rustEnRuimte}
//                 onChange={() => handleCriterionChange('rustEnRuimte')}
//                 className="mt-1 rounded accent-blue-600"
//               />
//               <div className="text-sm">
//                 <span className="font-medium text-slate-700 group-hover:text-slate-900">🌳 Rust & Ruimte</span>
//                 <p className="text-xs text-slate-500">Lage bevolkingsdichtheid</p>
//               </div>
//             </label>
//           </div>

//           {/* Reset knop */}
//           <button
//             onClick={() => {
//               ZoekTermSet('');
//               setMaxWoz(maxWozAvailable);
//               setCriteria({ gezinsvriendelijk: false, goedeBereikbaarheid: false, betaalbaar: false, rustEnRuimte: false });
//             }}
//             className="w-full py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
//           >
//             Filters wissen
//           </button>
//         </div>

//         {/* Rechterkolom: Resultaten */}
//         <div className="md:col-span-2 space-y-4">
//           <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-600">
//             <span>Resultaten</span>
//             <span className="font-semibold text-slate-800">{gefilterdeGemeenten.length} gemeenten gevonden</span>
//           </div>

//           {gefilterdeGemeenten.length === 0 ? (
//             <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 space-y-2">
//               <p className="font-medium">Geen gemeenten gevonden die voldoen aan al je wensen.</p>
//               <p className="text-xs">Probeer je budget te verhogen of minder criteria aan te vinken.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {gefilterdeGemeenten.map((item) => {
//                 const activeCriteriaCount = Object.values(criteria).filter(Boolean).length;

//                 return (
//                   <div 
//                     key={item.id} 
//                     className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//                   >
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h4 className="font-bold text-slate-800 text-lg">{item.naam}</h4>
//                         {activeCriteriaCount > 0 && (
//                           <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
//                             item.matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
//                             item.matchPercentage >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
//                           }`}>
//                             {item.matchPercentage}% match
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
//                         <span>WOZ: <strong className="text-slate-700">€ {item.wozWaarde.toLocaleString('nl-NL')}</strong></span>
//                         <span>Jongeren: <strong className="text-slate-700">{item.jongeren0Tot15}%</strong></span>
//                         <span>Station: <strong className="text-slate-700">{item.afstandTreinstation} km</strong></span>
//                         <span>Dichtheid: <strong className="text-slate-700">{item.bevolkingsdichtheid} /km²</strong></span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
