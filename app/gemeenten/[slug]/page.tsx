import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import GemeenteCard from "@/components/GemeenteCard";
import Link from "next/link";

type Gemeente = {
  id: string;
  naam: string;
  type: string;
  periode: string;

  bevolking: {
    totaal: number;
    dichtheid: number;

    leeftijd: {
      "0Tot15": number;
      "15Tot25": number;
      "25Tot45": number;
      "45Tot65": number;
      "65Tot80": number;
      "80Plus": number;
    };

    herkomst: {
      nederland: number;
      europaExclNederland: number;
      buitenEuropa: number;
    };

    huishoudens: {
      gemiddeldeGrootte: number;
    };
  };

  wonen: {
    gemiddeldeWozWaarde: number;
  };

  socialeZekerheid: {
    uitkeringsontvangersTotAow: number;
  };
};


// JSON inladen
async function getGemeenten(): Promise<Gemeente[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "gemeenten_cijfers_nieuw.json"
  );

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}


// URLs voor alle gemeenten genereren
export async function generateStaticParams() {
  const gemeenten = await getGemeenten();

  return gemeenten.map((gemeente) => ({
    slug: gemeente.id,
  }));
}


// Gemeentepagina
export default async function GemeentePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const gemeenten = await getGemeenten();

  const gemeente = gemeenten.find(
    (gemeente) => gemeente.id === slug
  );

  if (!gemeente) {
    notFound();
  }

  const totaal = gemeente.bevolking.totaal;

  // Leeftijd
  const leeftijd0Tot15 = Number(
    ((gemeente.bevolking.leeftijd["0Tot15"] / totaal) * 100).toFixed(1)
  );

  const leeftijd15Tot25 = Number(
    ((gemeente.bevolking.leeftijd["15Tot25"] / totaal) * 100).toFixed(1)
  );

  const leeftijd25Tot45 = Number(
    ((gemeente.bevolking.leeftijd["25Tot45"] / totaal) * 100).toFixed(1)
  );

  const leeftijd45Tot65 = Number(
    ((gemeente.bevolking.leeftijd["45Tot65"] / totaal) * 100).toFixed(1)
  );

  const leeftijd65Tot80 = Number(
    ((gemeente.bevolking.leeftijd["65Tot80"] / totaal) * 100).toFixed(1)
  );

  const leeftijd80Plus = Number(
    ((gemeente.bevolking.leeftijd["80Plus"] / totaal) * 100).toFixed(1)
  );

  // Herkomst
  const herkomstNederland = Number(
    ((gemeente.bevolking.herkomst.nederland / totaal) * 100).toFixed(1)
  );

  const herkomstEuropaExclNederland = Number(
    ((gemeente.bevolking.herkomst.europaExclNederland / totaal) * 100).toFixed(1)
  );

  const herkomstBuitenEuropa = Number(
    ((gemeente.bevolking.herkomst.buitenEuropa / totaal) * 100).toFixed(1)
  );

  // Uitkeringen
  const percentageUitkering = Number(
    (
      (gemeente.socialeZekerheid.uitkeringsontvangersTotAow / totaal) *
      100
    ).toFixed(1)
  );

  return (
    <div className="grid md:grid-cols-1 gap-6">
        <Link
          href="/"
          className="mb-2 inline-flex text-2xl text-slate-500 hover:text-slate-900"
        >
          ← Terug
        </Link>
        <GemeenteCard 
            key={gemeente.id} 
            naam={gemeente.naam}
            wozWaarde={gemeente.wonen.gemiddeldeWozWaarde} 
            totaleBevolking={gemeente.bevolking.totaal}
            jongeren0Tot15={leeftijd0Tot15}
            jongeren15Tot25={leeftijd15Tot25}
            volwassenen25Tot45={leeftijd25Tot45}
            volwassenen45Tot65={leeftijd45Tot65}
            ouderen65Tot80={leeftijd65Tot80}
            ouderen80Plus={leeftijd80Plus}
            bevolkingsdichtheid={gemeente.bevolking.dichtheid}
            herkomstNederland={herkomstNederland}
            herkomstEuropaExclNederland={herkomstEuropaExclNederland}
            herkomstBuitenEuropa={herkomstBuitenEuropa}
            uitkeringsontvangersTotAow={percentageUitkering}
            gemiddeldeHuishoudensgrootte={gemeente.bevolking.huishoudens.gemiddeldeGrootte}
        />
    </div>
  )}
