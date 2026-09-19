'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { ExpressionSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const ONDERWERPEN = [
  {
    key: 'bevolkingsdichtheid',
    label: 'Bevolkingsdichtheid',
    eenheid: 'inw/km²',
  },
  {
    key: 'wozWaarde',
    label: 'WOZ-waarde',
    eenheid: '× €1.000',
  },
  {
    key: 'totaleBevolking',
    label: 'Totale bevolking',
    eenheid: 'inwoners',
  },
  {
    key: 'jongeren0Tot15',
    label: 'Jongeren 0-15',
    eenheid: '%',
  },
  {
    key: 'jongeren15Tot25',
    label: 'Jongeren 15-25',
    eenheid: '%',
  },
  {
    key: 'volwassenen25Tot45',
    label: '25-45 jaar',
    eenheid: '%',
  },
  {
    key: 'volwassenen45Tot65',
    label: '45-65 jaar',
    eenheid: '%',
  },
  {
    key: 'ouderen65Tot80',
    label: '65-80 jaar',
    eenheid: '%',
  },
  {
    key: 'ouderen80Plus',
    label: 'Ouderen 80+',
    eenheid: '%',
  },
  {
    key: 'herkomstNederland',
    label: 'Herkomst Nederland',
    eenheid: '%',
  },
  {
    key: 'herkomstEuropaExclNederland',
    label: 'Herkomst Europa',
    eenheid: '%',
  },
  {
    key: 'herkomstBuitenEuropa',
    label: 'Herkomst buiten Europa',
    eenheid: '%',
  },
  {
    key: 'gemiddeldeHuishoudensgrootte',
    label: 'Gem. huishoudensgrootte',
    eenheid: 'personen',
  },
  {
    key: 'uitkeringsontvangersTotAow',
    label: 'Uitkeringsontvangers tot AOW',
    eenheid: 'personen',
  },
] as const;

type OnderwerpKey = (typeof ONDERWERPEN)[number]['key'];
type ModusType = 'gemeenten' | 'provincies';

export default function KaartPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const initialized = useRef(false);

  const [actiefOnderwerp, setActiefOnderwerp] =
    useState<OnderwerpKey>('bevolkingsdichtheid');

  const [modus, setModus] = useState<ModusType>('gemeenten');
  const [geladen, setGeladen] = useState(false);
  const [gekopieerd, setGekopieerd] = useState(false);

  const actiefOnderwerpRef = useRef(actiefOnderwerp);

  useEffect(() => {
    actiefOnderwerpRef.current = actiefOnderwerp;
  }, [actiefOnderwerp]);

  const normaliseer = (naam: string) =>
    naam
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

  /*
   * Haalt een waarde uit de nieuwe JSON-structuur.
   *
   * Bijvoorbeeld:
   *
   * bevolkingsdichtheid
   * -> bevolking.dichtheid
   *
   * totaleBevolking
   * -> bevolking.totaal
   *
   * wozWaarde
   * -> wonen.gemiddeldeWozWaarde
   */
  const getWaarde = (item: any, key: OnderwerpKey): number | null => {
    if (!item) return null;

    switch (key) {
      case 'bevolkingsdichtheid':
        return item.bevolking?.dichtheid ?? null;

      case 'totaleBevolking':
        return item.bevolking?.totaal ?? null;

      case 'wozWaarde':
        return item.wonen?.gemiddeldeWozWaarde ?? null;

      case 'gemiddeldeHuishoudensgrootte':
        return item.bevolking?.huishoudens?.gemiddeldeGrootte ?? null;

      // Leeftijd: absolute aantallen -> percentage
      case 'jongeren0Tot15':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['0Tot15'],
          item.bevolking?.totaal
        );

      case 'jongeren15Tot25':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['15Tot25'],
          item.bevolking?.totaal
        );

      case 'volwassenen25Tot45':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['25Tot45'],
          item.bevolking?.totaal
        );

      case 'volwassenen45Tot65':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['45Tot65'],
          item.bevolking?.totaal
        );

      case 'ouderen65Tot80':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['65Tot80'],
          item.bevolking?.totaal
        );

      case 'ouderen80Plus':
        return berekenPercentage(
          item.bevolking?.leeftijd?.['80Plus'],
          item.bevolking?.totaal
        );

      // Herkomst: absolute aantallen -> percentage
      case 'herkomstNederland':
        return berekenPercentage(
          item.bevolking?.herkomst?.nederland,
          item.bevolking?.totaal
        );

      case 'herkomstEuropaExclNederland':
        return berekenPercentage(
          item.bevolking?.herkomst?.europaExclNederland,
          item.bevolking?.totaal
        );

      case 'herkomstBuitenEuropa':
        return berekenPercentage(
          item.bevolking?.herkomst?.buitenEuropa,
          item.bevolking?.totaal
        );

      case 'uitkeringsontvangersTotAow':
        return berekenPercentage(
          item.socialeZekerheid?.uitkeringsontvangersTotAow,
          item.bevolking?.totaal
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!mapContainer.current || initialized.current) return;

    initialized.current = true;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      center: [5.3, 52.2],
      zoom: 7,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#ffffff',
            },
          },
        ],
      },
    });

    mapRef.current = map;

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      className: 'gebied-popup',
    });

    popupRef.current = popup;

    map.on('load', async () => {
      try {
        const [
          geoRes,
          dataRes,
          provGeoRes,
        ] = await Promise.all([
          fetch('/gemeenten.geojson'),
          fetch('/gemeenten_cijfers_nieuw.json'),
          fetch('/provincie_2026.geojson'),
        ]);

        console.log(
          'gemeenten.geojson:',
          geoRes.status,
          geoRes.ok
        );

        console.log(
          'gemeenten_cijfers_nieuw.json:',
          dataRes.status,
          dataRes.ok
        );

        console.log(
          'provincie_2026.geojson:',
          provGeoRes.status,
          provGeoRes.ok
        );

        if (
          !geoRes.ok ||
          !dataRes.ok ||
          !provGeoRes.ok
        ) {
          throw new Error(
            `Bestanden laden mislukt:
            gemeenten.geojson=${geoRes.status}
            gemeenten_cijfers_nieuw.json=${dataRes.status}
            provincie_2026.geojson=${provGeoRes.status}`
          );
        }

        const gemeenteGeojson = await geoRes.json();
        const gemeenteRaw = await dataRes.json();
        const provincieGeojson = await provGeoRes.json();

        const gemeenteData: any[] =
          Array.isArray(gemeenteRaw)
            ? gemeenteRaw
            : gemeenteRaw.gemeenten ||
              gemeenteRaw.data ||
              Object.values(gemeenteRaw);

        const provincieData = gemeenteData.filter(
          (item) => item?.type === 'provincie'
        );

        console.log(
          'Aantal data-items:',
          gemeenteData.length
        );

        console.log(
          'Aantal provincies:',
          provincieData.length
        );

        // ======================================================
        // Gemeenten koppelen
        // ======================================================

        const gemeenteLookup = new Map<string, any>();

        gemeenteData
          .filter((item) => item?.type === 'gemeente')
          .forEach((item) => {
            if (item?.naam) {
              gemeenteLookup.set(
                normaliseer(item.naam),
                item
              );
            }
          });

        let gemeenteMatches = 0;

        gemeenteGeojson.features.forEach((f: any) => {
          const naam =
            f.properties?.statnaam ||
            f.properties?.naam ||
            '';

          const match = gemeenteLookup.get(
            normaliseer(naam)
          );

          if (match) {
            gemeenteMatches++;

            ONDERWERPEN.forEach(({ key }) => {
              f.properties[key] = getWaarde(match, key);
            });
          }
        });

        console.log(
          `Gemeenten gekoppeld: ${gemeenteMatches} / ${gemeenteGeojson.features.length}`
        );

        // ======================================================
        // Provincies koppelen
        // ======================================================

        const provincieLookup = new Map<string, any>();

        provincieData.forEach((item: any) => {
          if (item?.naam) {
            provincieLookup.set(
              normaliseer(item.naam),
              item
            );
          }
        });

        let provincieMatches = 0;

        provincieGeojson.features.forEach((f: any) => {
          const naam =
            f.properties?.statnaam ||
            f.properties?.naam ||
            '';

          const match = provincieLookup.get(
            normaliseer(naam)
          );

          if (match) {
            provincieMatches++;

            ONDERWERPEN.forEach(({ key }) => {
              f.properties[key] = getWaarde(
                match,
                key
              );
            });
          }
        });

        console.log(
          `Provincies gekoppeld: ${provincieMatches} / ${provincieGeojson.features.length}`
        );

        // ======================================================
        // Sources
        // ======================================================

        map.addSource('gemeenten', {
          type: 'geojson',
          data: gemeenteGeojson,
        });

        map.addSource('provincies', {
          type: 'geojson',
          data: provincieGeojson,
        });

        // ======================================================
        // Gemeenten standaard tonen
        // ======================================================

        map.addLayer({
          id: 'regio-vulling',
          type: 'fill',
          source: 'gemeenten',
          paint: {
            'fill-color': getKleurExpressie(
              'bevolkingsdichtheid'
            ),
            'fill-opacity': 0.8,
          },
        });

        map.addLayer({
          id: 'regio-grenzen',
          type: 'line',
          source: 'gemeenten',
          paint: {
            'line-color': '#1e293b',
            'line-width': 0.7,
          },
        });

        // map.addLayer({
        //   id: 'regio-labels',
        //   type: 'symbol',
        //   source: modus, // of 'gemeenten' in de load-functie
        //   minzoom: 8,    // Pas zichtbaar vanaf een bepaald inzoomniveau om drukte te voorkomen
        //   layout: {
        //     'text-field': [
        //       'format',
        //       ['coalesce', ['get', 'statnaam'], ['get', 'naam'], 'Onbekend'],
        //       '\n',
        //       { 'font-scale': 0.8 },
        //       ['coalesce', ['to-string', ['get', actiefOnderwerp]], '']
        //     ],
        //     'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        //     'text-size': 16,
        //     'text-anchor': 'center',
        //     'text-allow-overlap': false,
        //   },
        //   paint: {
        //     'text-color': '#000000',
        //     // 'background-color': '#ffffff',
        //     'text-halo-color': '#ffffff',
        //     'text-halo-width': 1.5,
        //   },
        // });

        // ======================================================
        // Hover
        // ======================================================

        map.on('click', 'regio-vulling', (e) => {
          if (!e.features || e.features.length === 0) return;

          map.getCanvas().style.cursor = 'pointer';

          const feature = e.features[0];
          const props = feature.properties || {};

          const naam =
            props.statnaam ||
            props.naam ||
            'Onbekend';

          const key = actiefOnderwerpRef.current;

          const onderwerp = ONDERWERPEN.find(
            (o) => o.key === key
          );

          const waarde = props[key];

          const waardeTekst =
            waarde == null
              ? 'geen data'
              : `${formatteerWaarde(
                  Number(waarde),
                  key
                )} ${onderwerp?.eenheid ?? ''}`;

          const gemeente = gemeenteData.find(
            (g) => g.naam === naam
          );

          const slug = gemeente?.id;

          popup
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: system-ui, sans-serif; padding: 4px 2px;">
                <strong style="font-size: 14px;">
                  ${naam}
                </strong>
                <br/>
                <span style="font-size: 13px; color: #334155;">
                  ${onderwerp?.label}:
                  <strong>${waardeTekst}</strong>
                </span>
                ${
                  slug
                    ? `
                      <br/>
                      <a
                        href="/gemeenten/${slug}"
                        style="display: inline-block; margin-top: 8px; color: #2563eb; text-decoration: underline;"
                      >
                        Bekijk ${naam}
                      </a>
                    `
                    : ''
                }
              </div>
            `)
            .addTo(map);
        });

        // map.on('mouseleave', 'regio-vulling', () => {
        //   map.getCanvas().style.cursor = '';
        //   popup.remove();
        // });

        map.fitBounds(
          [
            [3.2, 50.75],
            [7.3, 53.7],
          ],
          {
            padding: 40,
          }
        );

        setTimeout(() => {
          map.resize();
          setGeladen(true);
        }, 150);
      } catch (err) {
        console.error('FOUT in load:', err);
      }
    });

    return () => {};
  }, []);

  // ============================================================
  // Onderwerp wijzigen
  // ============================================================

  useEffect(() => {
    if (!mapRef.current || !geladen) return;

    if (mapRef.current.getLayer('regio-vulling')) {
      mapRef.current.setPaintProperty(
        'regio-vulling',
        'fill-color',
        getKleurExpressie(actiefOnderwerp)
      );
    }
    if (mapRef.current.getLayer('regio-labels')) {
      mapRef.current.setLayoutProperty('regio-labels', 'text-field', [
        'format',
        ['coalesce', ['get', 'statnaam'], ['get', 'naam'], 'Onbekend'],
        '\n',
        { 'font-scale': 0.8 },
        ['coalesce', ['to-string', ['get', actiefOnderwerp]], '']
      ]);
    }
  }, [actiefOnderwerp, geladen]);

  // ============================================================
  // Gemeenten / provincies
  // ============================================================

  const handleModusSwitch = (
    nieuweModus: ModusType
  ) => {
    setModus(nieuweModus);

    if (!mapRef.current || !geladen) return;

    const map = mapRef.current;

    if (map.getLayer('regio-vulling')) {
      map.removeLayer('regio-vulling');
    }

    if (map.getLayer('regio-grenzen')) {
      map.removeLayer('regio-grenzen');
    }

    if (map.getLayer('regio-labels')) {
      map.removeLayer('regio-labels');
    }

    map.addLayer({
      id: 'regio-vulling',
      type: 'fill',
      source: nieuweModus,
      paint: {
        'fill-color': getKleurExpressie(
          actiefOnderwerp
        ),
        'fill-opacity': 0.8,
      },
    });

    map.addLayer({
      id: 'regio-grenzen',
      type: 'line',
      source: nieuweModus,
      paint: {
        'line-color': '#1e293b',
        'line-width':
          nieuweModus === 'provincies'
            ? 0.7
            : 0.7,
      },
    });

  //   map.addLayer({
  //   id: 'regio-labels',
  //   type: 'symbol',
  //   source: nieuweModus,
  //   minzoom: nieuweModus === 'provincies' ? 6 : 9, // Provincies al eerder zichtbaar dan gemeenten
  //   layout: {
  //     'text-field': [
  //       'format',
  //       ['coalesce', ['get', 'statnaam'], ['get', 'naam'], ['get', 'Naam'], 'Onbekend'],
  //       '\n',
  //       { 'font-scale': 0.8 },
  //       ['coalesce', ['to-string', ['get', actiefOnderwerp]], '']
  //     ],
  //     'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
  //     'text-size': nieuweModus === 'provincies' ? 18 : 11,
  //     'text-anchor': 'center',
  //     'text-allow-overlap': false,
  //   },
  //   paint: {
  //     'text-color': '#000000',
  //     'text-halo-color': '#ffffff',
  //     'text-halo-width': 1.5,
  //   },
  // });
  };

  // ============================================================
  // Link kopiëren
  // ============================================================

  const kopieerLink = () => {
    const huidigeUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : '';

    navigator.clipboard.writeText(huidigeUrl);

    setGekopieerd(true);

    setTimeout(() => {
      setGekopieerd(false);
    }, 2000);
  };

  return (
    <div className="md:p-6 p-0 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold">
          Nederlandse{' '}
          {modus === 'gemeenten'
            ? 'gemeenten (2025)'
            : 'provincies (2025)'}
        </h1>

        <div className="flex items-center gap-3">

          {/* Gemeenten / Provincies */}

          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">

            <button
              onClick={() =>
                handleModusSwitch('gemeenten')
              }
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                modus === 'gemeenten'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gemeenten
            </button>

            <button
              onClick={() =>
                handleModusSwitch('provincies')
              }
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                modus === 'provincies'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Provincies
            </button>

          </div>

          {/* <button
            onClick={kopieerLink}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            {gekopieerd
              ? 'Link gekopieerd!'
              : 'Deel kaart'}
          </button> */}

        </div>
      </div>

      {/* Onderwerpen */}

      <div className="flex flex-wrap gap-2 mb-4">

        {ONDERWERPEN.map((o) => (
          <button
            key={o.key}
            onClick={() =>
              setActiefOnderwerp(o.key)
            }
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              actiefOnderwerp === o.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {o.label}
          </button>
        ))}

      </div>

      <div className="mb-3 text-sm text-gray-600">
        Actief:{' '}
        <strong>
          {
            ONDERWERPEN.find(
              (o) =>
                o.key === actiefOnderwerp
            )?.label
          }
        </strong>{' '}
        (
        {
          ONDERWERPEN.find(
            (o) =>
              o.key === actiefOnderwerp
          )?.eenheid
        }
        )
         - Klik op een regio voor meer informatie
      </div>
      {/* <div>Klik op een regio voor meer informatie</div> */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
        }}
        className="h-[420px] md:h-[650px] rounded-lg overflow-hidden border border-gray-300"
      />
    </div>
  );
}


// ============================================================
// Percentage berekenen
// ============================================================

function berekenPercentage(
  aantal: number | null | undefined,
  totaal: number | null | undefined
): number | null {

  if (
    aantal == null ||
    totaal == null ||
    totaal <= 0
  ) {
    return null;
  }

  return Math.round(
    (Number(aantal) / Number(totaal)) * 1000
  ) / 10;
}


// ============================================================
// Waarde formatteren
// ============================================================

function formatteerWaarde(
  waarde: number,
  key: OnderwerpKey
): string {

  if (
    key === 'gemiddeldeHuishoudensgrootte'
  ) {
    return waarde.toLocaleString(
      'nl-NL',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  if (
    key === 'jongeren0Tot15' ||
    key === 'jongeren15Tot25' ||
    key === 'volwassenen25Tot45' ||
    key === 'volwassenen45Tot65' ||
    key === 'ouderen65Tot80' ||
    key === 'ouderen80Plus' ||
    key === 'herkomstNederland' ||
    key === 'herkomstEuropaExclNederland' ||
    key === 'herkomstBuitenEuropa'
  ) {
    return waarde.toLocaleString(
      'nl-NL',
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }
    );
  }

  return waarde.toLocaleString(
    'nl-NL'
  );
}


// ============================================================
// Kleurenschaal
// ============================================================

function getKleurExpressie(
  onderwerp: string
): ExpressionSpecification {

  const schalen: Record<
    string,
    ExpressionSpecification
  > = {

    bevolkingsdichtheid: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'bevolkingsdichtheid'], 0],
      0, '#f2f0f7',
      200, '#dadaeb',
      500, '#bcbddc',
      1000, '#9e9ac8',
      2000, '#756bb1',
      4000, '#54278f',
    ],

    wozWaarde: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'wozWaarde'], 0],
      200, '#f2f0f7',
      275, '#dadaeb',
      350, '#bcbddc',
      425, '#9e9ac8',
      500, '#756bb1',
      575, '#54278f',
    ],

    totaleBevolking: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'totaleBevolking'], 0],
      10000, '#f2f0f7',
      30000, '#dadaeb',
      60000, '#bcbddc',
      100000, '#9e9ac8',
      2000000, '#756bb1',
      5000000, '#54278f',
    ],

    jongeren0Tot15: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'jongeren0Tot15'], 0],
      10, '#f2f0f7',
      13, '#dadaeb',
      15, '#bcbddc',
      17, '#9e9ac8',
      20, '#54278f',
    ],

    jongeren15Tot25: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'jongeren15Tot25'], 0],
      8, '#f2f0f7',
      10, '#dadaeb',
      12, '#bcbddc',
      14, '#9e9ac8',
      16, '#54278f',
    ],

    volwassenen25Tot45: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'volwassenen25Tot45'], 0],
      20, '#f2f0f7',
      22, '#dadaeb',
      24, '#bcbddc',
      27, '#9e9ac8',
      30, '#54278f',
    ],

    volwassenen45Tot65: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'volwassenen45Tot65'], 0],
      20, '#f2f0f7',
      22, '#dadaeb',
      24, '#bcbddc',
      27, '#9e9ac8',
      30, '#54278f',
    ],

    ouderen65Tot80: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'ouderen65Tot80'], 0],
      10, '#f2f0f7',
      12, '#dadaeb',
      14, '#bcbddc',
      17, '#9e9ac8',
      20, '#54278f',
    ],

    ouderen80Plus: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'ouderen80Plus'], 0],
      3, '#f2f0f7',
      4, '#dadaeb',
      6, '#bcbddc',
      7, '#9e9ac8',
      9, '#54278f',
    ],

    herkomstNederland: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'herkomstNederland'], 0],
      35, '#f2f0f7',
      45, '#dadaeb',
      55, '#bcbddc',
      70, '#9e9ac8',
      80, '#756bb1',
      90, '#54278f',
    ],

    herkomstEuropaExclNederland: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'herkomstEuropaExclNederland'], 0],
      0, '#f2f0f7',
      3, '#dadaeb',
      6, '#bcbddc',
      9, '#9e9ac8',
      12, '#756bb1',
      15, '#54278f',
    ],

    herkomstBuitenEuropa: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'herkomstBuitenEuropa'], 0],
      0, '#f2f0f7',
      6, '#dadaeb',
      12, '#bcbddc',
      18, '#9e9ac8',
      24, '#756bb1',
      30, '#54278f',
    ],

    gemiddeldeHuishoudensgrootte: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'gemiddeldeHuishoudensgrootte'], 0],
      1.8, '#f2f0f7',
      2.0, '#dadaeb',
      2.2, '#bcbddc',
      2.4, '#9e9ac8',
      2.6, '#756bb1',
      2.8, '#54278f',
    ],

    uitkeringsontvangersTotAow: [
      'interpolate',
      ['linear'],
      ['coalesce', ['get', 'uitkeringsontvangersTotAow'], 0],
      5, '#f2f0f7',
      6, '#dadaeb',
      7, '#bcbddc',
      8, '#9e9ac8',
      9, '#756bb1',
      10, '#54278f',
    ],
  };

  return schalen[onderwerp] ?? ['literal', '#94a3b8'];
}

