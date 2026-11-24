import fs from 'fs';
import path from 'path';

interface Indiener {
  naam: string;
  partij: string;
}

interface Motie {
  id: string;
  nummer: string;
  soort: string;
  datum: string;
  titel: string;
  onderwerp: string;
  uitslag: string;
  voor_zetels: number;
  tegen_zetels: number;
  themas: string[];
  indieners: Indiener[];
  stemmen: Record<string, string>;
}

interface DataFile {
  laatst_bijgewerkt: string;
  aantal: number;
  moties: Motie[];
}

function getMotiesData(): DataFile {
  const filePath = path.join(process.cwd(), 'public', 'data', 'moties.json');
  if (!fs.existsSync(filePath)) {
    return { laatst_bijgewerkt: '', aantal: 0, moties: [] };
  }
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
}

export default function MotiesPage() {
  const data = getMotiesData();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Tweede Kamer Moties</h1>
          {/* <p className="mt-2 text-sm text-gray-600">
            Echte parlementaire besluiten van het afgelopen jaar, direct gekoppeld aan de daadwerkelijke stemuitslagen per fractie.
          </p> */}
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="bg-gray-200 px-2.5 py-1 rounded-md font-medium text-gray-700">
              Totaal: {data.aantal} items
            </span>
            {data.laatst_bijgewerkt && (
              <span>Laatst bijgewerkt: {new Date(data.laatst_bijgewerkt).toLocaleDateString('nl-NL')}</span>
            )}
          </div>
        </div>

        {/* Lijst met moties */}
        <div className="space-y-6">
          {data.moties.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
              <p className="font-semibold">Nog geen moties geladen.</p>
              {/* <p className="text-sm mt-1">Draai eerst je Python-script om de <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">public/data/moties.json</code> te genereren!</p> */}
            </div>
          ) : (
            data.moties.map((motie) => {
              const isAangenomen = motie.uitslag.toLowerCase().includes('aangenomen');
              
              // Filter de stemmen op Voor en Tegen
              const voorPartijen = Object.entries(motie.stemmen).filter(([_, keuze]) => keuze === 'Voor');
              const tegenPartijen = Object.entries(motie.stemmen).filter(([_, keuze]) => keuze === 'Tegen');

              return (
                <div key={motie.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
                  {/* Top bar: Soort, nummer, datum en uitslag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md uppercase tracking-wider">
                        {motie.soort}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">{motie.nummer}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{motie.datum}</span>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      isAangenomen ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {motie.uitslag} ({motie.voor_zetels} voor / {motie.tegen_zetels} tegen)
                    </span>
                  </div>

                  {/* Titel / Onderwerp */}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {motie.titel || motie.onderwerp}
                  </h2>
                  
                  {motie.onderwerp && motie.titel && motie.onderwerp !== motie.titel && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-8">
                      {motie.onderwerp}
                    </p>
                  )}

                  {/* Thema tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {motie.themas.map((thema, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full font-medium">
                        {thema}
                      </span>
                    ))}
                  </div>

                  {/* Stemgedrag per fractie: Links VOOR, Rechts TEGEN */}
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Stemgedrag per fractie
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Linkerkant: VOOR */}
                      <div className="bg-emerald-50/40 rounded-lg p-3 border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide flex items-center justify-between">
                          <span>Voor</span>
                          <span className="bg-emerald-200/60 px-1.5 py-0.5 rounded text-[10px]">{voorPartijen.length} partijen</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {voorPartijen.length === 0 ? (
                            <span className="text-xs text-gray-400 italic">Geen partijen</span>
                          ) : (
                            voorPartijen.map(([partij]) => (
                              <span
                                key={partij}
                                className="px-2 py-1 rounded text-xs font-semibold bg-white text-emerald-900 border border-emerald-200 shadow-2xs"
                              >
                                {partij}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Rechterkant: TEGEN */}
                      <div className="bg-rose-50/40 rounded-lg p-3 border border-rose-100">
                        <div className="text-xs font-bold text-rose-800 mb-2 uppercase tracking-wide flex items-center justify-between">
                          <span>Tegen</span>
                          <span className="bg-rose-200/60 px-1.5 py-0.5 rounded text-[10px]">{tegenPartijen.length} partijen</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tegenPartijen.length === 0 ? (
                            <span className="text-xs text-gray-400 italic">Geen partijen</span>
                          ) : (
                            tegenPartijen.map(([partij]) => (
                              <span
                                key={partij}
                                className="px-2 py-1 rounded text-xs font-semibold bg-white text-rose-900 border border-rose-200 shadow-2xs"
                              >
                                {partij}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
