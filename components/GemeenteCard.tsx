export default function GemeenteCard({ 
  naam, 
  wozWaarde, 
  totaleBevolking, 
  jongeren0Tot15, 
  jongeren15Tot25,
  volwassenen25Tot45,
  volwassenen45Tot65,
  ouderen65Tot80,
  ouderen80Plus, 
  bevolkingsdichtheid,
  herkomstNederland,
  herkomstEuropaExclNederland,
  herkomstBuitenEuropa,
  gemiddeldeHuishoudensgrootte,
  uitkeringsontvangersTotAow
}: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-bold text-slate-800 mb-4">{naam}</h3>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">WOZ-waarde</span>
          <span className="font-semibold text-slate-700">€ {wozWaarde} k</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Totale bevolking</span>
          <span className="font-semibold text-slate-700">{totaleBevolking?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Jongeren (0-15 jr)</span>
          <span className="font-semibold text-slate-700">{jongeren0Tot15?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">15-25 jr</span>
          <span className="font-semibold text-slate-700">{jongeren15Tot25?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">25-45 jr</span>
          <span className="font-semibold text-slate-700">{volwassenen25Tot45?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">45-65 jr</span>
          <span className="font-semibold text-slate-700">{volwassenen45Tot65?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">65-80 jr</span>
          <span className="font-semibold text-slate-700">{ouderen65Tot80?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Ouderen (80+ jr)</span>
          <span className="font-semibold text-slate-700">{ouderen80Plus?.toLocaleString()}%</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Bevolkingsdichtheid</span>
          <span className="font-semibold text-slate-700">{bevolkingsdichtheid} inwoners/km²</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Herkomst Nederland</span>
          <span className="font-semibold text-slate-700">{herkomstNederland}%</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Herkomst Europa (excl. Nederland)</span>
          <span className="font-semibold text-slate-700">{herkomstEuropaExclNederland}%</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Herkomst Nederland</span>
          <span className="font-semibold text-slate-700">{herkomstBuitenEuropa}%</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Uitkeringsontvangers</span>
          <span className="font-semibold text-slate-700">{uitkeringsontvangersTotAow}%</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Gemiddelde Huishoudensgrootte</span>
          <span className="font-semibold text-slate-700">{gemiddeldeHuishoudensgrootte}</span>
        </div>
      </div>
    </div>
  );
}
