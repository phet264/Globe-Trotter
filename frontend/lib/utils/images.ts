/**
 * Centralized, verified destination image registry for GlobeTrotter.
 */

const U = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;

export const DESTINATION_IMAGES: Record<string, string> = {
  // ── Countries ──────────────────────────────────────────────────────────────
  france:         U('1502602898657-3e91760cbb34'),
  italy:          U('1552832230-c0197dd311b5'),
  japan:          U('1493976040374-85c8e12f0c0e'),
  // ── Indian Cities ──────────────────────────────────────────────────────────
  india:          '/images/destinations/taj_mahal.png',
  mumbai:         '/images/destinations/mumbai.png',
  delhi:          '/images/destinations/taj_mahal.png',
  agra:           '/images/destinations/taj_mahal.png',
  jaipur:         '/images/destinations/palace.png',
  varanasi:       '/images/destinations/palace.png',
  goa:            '/images/destinations/beach.png',
  kolkata:        '/images/destinations/mumbai.png',
  hyderabad:      '/images/destinations/palace.png',
  bengaluru:      '/images/destinations/mumbai.png',
  chennai:        '/images/destinations/mumbai.png',
  pune:           '/images/destinations/mumbai.png',
  ahmedabad:      '/images/destinations/mumbai.png',
  kerala:         '/images/destinations/beach.png',
  jaisalmer:      '/images/destinations/palace.png',
  udaipur:        '/images/destinations/palace.png',

  // ── Fallback pool (travel images) ──────────────────────────────────────────
  _travel_0:      U('1476514525535-07fb3b4ae5f1'),
  _travel_1:      U('1469854523086-cc02fe5d8800'),
  _travel_2:      U('1473625247510-8ceb1760943f'),
};

const FALLBACK_KEYS = Object.keys(DESTINATION_IMAGES).filter(k => k.startsWith('_travel_'));

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}

export function getMockImage(seed: string, w = 1200, h = 800): string {
  if (!seed) return DESTINATION_IMAGES._travel_0;
  const key = seed.toLowerCase().trim().replace(/\s+/g, '-');
  const rawSeed = seed.toLowerCase();

  // Exact match
  if (DESTINATION_IMAGES[key]) return DESTINATION_IMAGES[key];

  // Substring match (e.g. "trip to paris" -> finds "paris")
  for (const knownKey of Object.keys(DESTINATION_IMAGES)) {
    if (!knownKey.startsWith('_') && rawSeed.includes(knownKey)) {
      return DESTINATION_IMAGES[knownKey];
    }
  }

  const idx = hashString(key) % FALLBACK_KEYS.length;
  return DESTINATION_IMAGES[FALLBACK_KEYS[idx]];
}

export function getImageBySlug(slug: string): string | null {
  return DESTINATION_IMAGES[slug.toLowerCase()] ?? null;
}
