export default function GemeenteCard({ 
  naam, 
  wozWaarde, 
  afstandZiekenhuis, 
  afstandTreinstation, 
  totaleBevolking, 
  jongeren0Tot15, 
  ouderen80Plus, 
  bevolkingsdichtheid 
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
          <span className="text-slate-500">Afstand ziekenhuis</span>
          <span className="font-semibold text-slate-700">{afstandZiekenhuis} km</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Jongeren (0-15 jr)</span>
          <span className="font-semibold text-slate-700">{jongeren0Tot15?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Afstand station</span>
          <span className="font-semibold text-slate-700">{afstandTreinstation} km</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Ouderen (80+ jr)</span>
          <span className="font-semibold text-slate-700">{ouderen80Plus?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Bevolkingsdichtheid</span>
          <span className="font-semibold text-slate-700">{bevolkingsdichtheid} /km²</span>
        </div>
      </div>
    </div>
  );
}