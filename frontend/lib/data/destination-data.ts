/**
 * Centralized destination data for GlobeTrotter.
 * This is the single source of truth for static destination content.
 * Dynamic data (DB city ID, country, Prisma activities) is merged at render time.
 */

export interface Attraction {
  name: string;
  description: string;
  image: string;
}

export interface DestinationData {
  slug: string;
  name: string;
  country: string;
  countrySlug?: string;
  region?: string; // state/region e.g. "Rajasthan", "Maharashtra"
  tagline: string;
  description: string;
  bestTime: string;
  duration: string;
  budget: 'Budget' | 'Mid-range' | 'Luxury' | 'All budgets';
  experience: string[];
  attractions: Attraction[];
  alsoLike: string[]; // slugs of related destinations
}

// All verified Unsplash photo IDs — format: https://images.unsplash.com/photo-{id}
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=85`;

export const DESTINATIONS: Record<string, DestinationData> = {
  // ─── COUNTRIES ───────────────────────────────────────────────────────────────

  france: {
    slug: 'france',
    name: 'France',
    country: 'France',
    tagline: 'Art, cuisine, romance and timeless elegance.',
    description:
      "France is one of the world's most visited countries — a land of extraordinary art, world-class cuisine, and breathtaking landscapes. From the romantic boulevards of Paris to the lavender fields of Provence and the sun-drenched Riviera, France captivates every traveller. Its rich history spans centuries of monarchy, revolution, and cultural renaissance. Whether you're sipping wine in Bordeaux, exploring the châteaux of the Loire Valley, or skiing in the Alps, France delivers an unmatched depth of experience.",
    bestTime: 'April – June · Sept – Oct',
    duration: '7–14 Days',
    budget: 'Mid-range',
    experience: ['Art & Culture', 'Cuisine', 'Architecture', 'History', 'Wine', 'Fashion'],
    attractions: [
      { name: 'Eiffel Tower', description: 'The iconic iron lattice tower at the heart of Paris.', image: U('1502602898657-3e91760cbb34') },
      { name: 'Louvre Museum', description: "The world's largest art museum and home of the Mona Lisa.", image: U('1499856871958-5b9627545d1a') },
      { name: 'Palace of Versailles', description: 'A royal château of extraordinary baroque splendour.', image: U('1558618666-fcd25c85cd64') },
      { name: 'Mont Saint-Michel', description: 'A tidal island topped by a medieval abbey.', image: U('1565604838560-e9fef3b5e8e4') },
    ],
    alsoLike: ['italy', 'japan', 'india', 'paris'],
  },

  italy: {
    slug: 'italy',
    name: 'Italy',
    country: 'Italy',
    tagline: 'Eternal history, art and the finest food on earth.',
    description:
      "Italy is a living museum — every piazza, hilltop village, and coastline carries millennia of history. From the ancient Colosseum in Rome to the Renaissance masterpieces of Florence, the canals of Venice, and the dramatic Amalfi Coast, Italy is a feast for every sense. Italian cuisine is revered worldwide, and every region has its own pasta, wine, and culture. La dolce vita is not just a phrase — it's a philosophy you'll live fully in Italy.",
    bestTime: 'April – June · Sept – Oct',
    duration: '7–12 Days',
    budget: 'Mid-range',
    experience: ['History', 'Art & Culture', 'Food & Wine', 'Architecture', 'Romance'],
    attractions: [
      { name: 'Colosseum', description: 'The ancient amphitheatre and greatest monument of Rome.', image: U('1552832230-c0197dd311b5') },
      { name: 'Venice Canals', description: 'Timeless waterways and Gothic palaces of the floating city.', image: U('1523906834658-6e24ef2386f9') },
      { name: 'Amalfi Coast', description: 'Dramatic cliffs, turquoise sea and colourful coastal villages.', image: U('1530685932526-48ec92898dea') },
      { name: 'Florence Duomo', description: "Brunelleschi's dome presides over the Renaissance jewel of Tuscany.", image: U('1516483638261-f4dbaf036963') },
    ],
    alsoLike: ['france', 'japan', 'rome', 'paris'],
  },

  japan: {
    slug: 'japan',
    name: 'Japan',
    country: 'Japan',
    tagline: 'Ancient tradition meets dazzling modernity.',
    description:
      "Japan is a land of extraordinary contrasts — neon-lit skyscrapers beside ancient shrines, bullet trains cutting through misty mountain ranges, and cherry blossoms carpeting temples that have stood for over a thousand years. From the energy of Tokyo to the tranquil temples of Kyoto, the deer park of Nara, and the peace memorials of Hiroshima, Japan rewards visitors with its meticulous hospitality, extraordinary food culture, and aesthetic sensibility that permeates every aspect of life.",
    bestTime: 'March – May · Oct – Nov',
    duration: '10–14 Days',
    budget: 'Mid-range',
    experience: ['Culture', 'Food', 'Nature', 'Architecture', 'Technology', 'Tradition'],
    attractions: [
      { name: 'Mount Fuji', description: "Japan's sacred and iconic volcanic peak.", image: U('1493976040374-85c8e12f0c0e') },
      { name: 'Fushimi Inari', description: 'Thousands of vermilion torii gates winding up a Kyoto mountain.', image: U('1524413840845-380d19f85c34') },
      { name: 'Tokyo Skyline', description: "The dazzling metropolitan sprawl of the world's largest city.", image: U('1540959733332-eab4deabeeaf') },
      { name: 'Arashiyama Bamboo', description: 'A serene grove of towering bamboo near Kyoto.', image: U('1528360983277-13d401cdc186') },
    ],
    alsoLike: ['france', 'italy', 'india', 'paris'],
  },

  india: {
    slug: 'india',
    name: 'India',
    country: 'India',
    tagline: 'A kaleidoscope of ancient cultures, landscapes and flavours.',
    description:
      "India is a civilisation as much as a country — a subcontinent of staggering diversity where every state has its own language, cuisine, festivals, and landscape. Witness the sunrise over the Taj Mahal in Agra, float on a houseboat through Kerala's backwaters, follow the spiritual energy of Varanasi's ghats, or lose yourself in the bazaars of Delhi. From the snow-capped Himalayas in the north to the tropical beaches of Goa in the south, India is endlessly fascinating, overwhelming, and unforgettable.",
    bestTime: 'Oct – March',
    duration: '10–21 Days',
    budget: 'Budget',
    experience: ['Culture', 'Spirituality', 'History', 'Food', 'Nature', 'Adventure'],
    attractions: [
      { name: 'Taj Mahal', description: "The world's most celebrated monument to love, in Agra.", image: '/images/destinations/taj_mahal.png' },
      { name: 'Kerala Backwaters', description: 'Serene network of lagoons, lakes and canals through green countryside.', image: '/images/destinations/beach.png' },
      { name: 'Varanasi Ghats', description: "Ancient steps leading to the sacred Ganges river — India's spiritual heart.", image: '/images/destinations/palace.png' },
      { name: 'Hawa Mahal', description: "The Palace of Winds — Jaipur's most recognisable facade.", image: '/images/destinations/palace.png' },
    ],
    alsoLike: ['japan', 'france', 'italy', 'agra'],
  },

  // ─── CITIES: FRANCE ──────────────────────────────────────────────────────────

  paris: {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countrySlug: 'france',
    tagline: 'The city of light, love and timeless elegance.',
    description:
      "Paris is the capital of France and one of the world's most iconic cities. Known for its extraordinary architecture, world-class art, haute cuisine, and effortless style, Paris has captivated visitors for centuries. Stroll along the Seine past Notre-Dame, ascend the Eiffel Tower at dusk, explore room after room of the Louvre, or simply sit at a pavement café watching the world go by. Paris rewards the curious traveller at every turn — from the bohemian hills of Montmartre to the grand boulevards of Haussmann.",
    bestTime: 'April – June · Sept – Oct',
    duration: '3–5 Days',
    budget: 'Mid-range',
    experience: ['Art & Culture', 'Food & Wine', 'Architecture', 'Romance', 'Fashion', 'History'],
    attractions: [
      { name: 'Eiffel Tower', description: "Gustave Eiffel's wrought-iron masterpiece — the symbol of Paris.", image: U('1502602898657-3e91760cbb34') },
      { name: 'Louvre Museum', description: "The world's largest art museum, home to over 35,000 works.", image: U('1499856871958-5b9627545d1a') },
      { name: 'Notre-Dame Cathedral', description: 'A Gothic masterpiece on the Île de la Cité.', image: U('1574804842849-13f5bfcb95f3') },
      { name: 'Montmartre', description: 'The bohemian hilltop village with panoramic views and the Sacré-Cœur.', image: U('1477959858617-67f85cf4f1df') },
    ],
    alsoLike: ['rome', 'japan', 'india', 'france'],
  },

  // ─── CITIES: ITALY ───────────────────────────────────────────────────────────

  rome: {
    slug: 'rome',
    name: 'Rome',
    country: 'Italy',
    countrySlug: 'italy',
    tagline: 'Where every cobblestone tells a 2,000-year-old story.',
    description:
      "Rome is the Eternal City — a living open-air museum where ancient history and vibrant modern life exist side by side. Walk past the Colosseum where gladiators once fought, toss a coin into the Trevi Fountain, explore the Vatican's incomparable art and architecture, and eat some of the world's finest pasta and gelato. Rome's seven hills, ancient forums, baroque piazzas, and neighbourhood trattorias create a city that seems impossible to exhaust — no matter how many times you visit.",
    bestTime: 'April – June · Sept – Oct',
    duration: '3–5 Days',
    budget: 'Mid-range',
    experience: ['History', 'Architecture', 'Art', 'Food', 'Religion', 'Culture'],
    attractions: [
      { name: 'Colosseum', description: 'The greatest surviving amphitheatre from the Roman Empire.', image: U('1552832230-c0197dd311b5') },
      { name: 'Vatican Museums', description: "Home to the Sistine Chapel and one of the world's greatest art collections.", image: U('1531572753322-ad011dde4d4f') },
      { name: 'Trevi Fountain', description: "Rome's most spectacular baroque fountain — toss a coin and return.", image: U('1525874684015-58379d421a52') },
      { name: 'Pantheon', description: 'A perfectly preserved Roman temple, now nearly 2,000 years old.', image: U('1548783931-9f55b5c7f5e0') },
    ],
    alsoLike: ['paris', 'france', 'italy', 'japan'],
  },

  // ─── CITIES: INDIA ───────────────────────────────────────────────────────────

  mumbai: {
    slug: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    countrySlug: 'india',
    region: 'Maharashtra',
    tagline: 'The city of dreams — where ambition meets the Arabian Sea.',
    description:
      "Mumbai is India's commercial capital and most cosmopolitan city. The Gateway of India stands at the seafront as a reminder of the colonial era, while Bollywood churns out the world's most prolific film industry just a few kilometres away. Marine Drive curves along the Arabian Sea, the Dharavi neighbourhood pulses with industry and creativity, and the city's restaurants serve everything from street vada pav to Michelin-quality tasting menus. Mumbai never sleeps — and never stops surprising.",
    bestTime: 'Nov – Feb',
    duration: '2–4 Days',
    budget: 'Mid-range',
    experience: ['Urban', 'Food', 'Culture', 'Bollywood', 'History', 'Nightlife'],
    attractions: [
      { name: 'Gateway of India', description: 'The grand basalt arch overlooking Mumbai Harbour, built in 1924.', image: U('1529253355930-ddbe423a2ac7') },
      { name: 'Marine Drive', description: "Mumbai's iconic seafront promenade, known as the Queen's Necklace at night.", image: U('1566552881560-0be862a7c445') },
      { name: 'Elephanta Caves', description: 'Ancient rock-cut temples dedicated to Shiva on an island in the harbour.', image: U('1609429019995-8c5c7a63a9ca') },
      { name: 'Colaba Causeway', description: 'A vibrant street market and dining district in the heart of South Mumbai.', image: U('1512453979798-5ea266f8880c') },
    ],
    alsoLike: ['delhi', 'goa', 'jaipur', 'india'],
  },

  delhi: {
    slug: 'delhi',
    name: 'Delhi',
    country: 'India',
    countrySlug: 'india',
    region: 'Delhi',
    tagline: 'A tale of eight cities — ancient, Mughal and modern.',
    description:
      "Delhi is India's capital and one of the world's oldest continuously inhabited cities. From the UNESCO-listed Qutub Minar — a 12th-century minaret — to the grand Mughal architecture of the Red Fort and Jama Masjid, Delhi layers millennia of history across its sprawling landscape. Connaught Place and Hauz Khas bustle with contemporary energy, while Old Delhi's bazaars around Chandni Chowk offer one of the most intense and rewarding sensory experiences in Asia. The street food alone — parathas, chaat, kebabs — is worth the journey.",
    bestTime: 'Oct – March',
    duration: '2–4 Days',
    budget: 'Budget',
    experience: ['History', 'Food', 'Architecture', 'Culture', 'Shopping', 'Mughal Heritage'],
    attractions: [
      { name: 'India Gate', description: 'A war memorial and beloved public park at the heart of New Delhi.', image: '/images/destinations/palace.png' },
      { name: 'Red Fort', description: 'The magnificent Mughal fortress that housed emperors for over 200 years.', image: '/images/destinations/palace.png' },
      { name: 'Qutub Minar', description: 'A 73-metre minaret that is the tallest brick minaret in the world.', image: '/images/destinations/palace.png' },
      { name: "Humayun's Tomb", description: 'A Mughal masterpiece and architectural precursor to the Taj Mahal.', image: '/images/destinations/taj_mahal.png' },
    ],
    alsoLike: ['agra', 'jaipur', 'varanasi', 'india'],
  },

  agra: {
    slug: 'agra',
    name: 'Agra',
    country: 'India',
    countrySlug: 'india',
    region: 'Uttar Pradesh',
    tagline: 'Home of the Taj Mahal — one of the wonders of the world.',
    description:
      "Agra is world-famous for the Taj Mahal, the ivory-white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. Few structures in the world can match its ethereal beauty, especially at sunrise when the first light turns the marble pink and gold. Beyond the Taj, Agra also has the magnificent Agra Fort — a UNESCO World Heritage Site — and the abandoned city of Fatehpur Sikri nearby. Agra is a compact city that rewards even a single day's visit with unforgettable architecture.",
    bestTime: 'Oct – March',
    duration: '1–2 Days',
    budget: 'Budget',
    experience: ['History', 'Mughal Architecture', 'Culture', 'Photography'],
    attractions: [
      { name: 'Taj Mahal', description: "The world's most celebrated monument to love — a UNESCO World Heritage Site.", image: '/images/destinations/taj_mahal.png' },
      { name: 'Agra Fort', description: 'A massive red-sandstone fortress with palaces, mosques and audience halls.', image: '/images/destinations/palace.png' },
      { name: 'Fatehpur Sikri', description: "Akbar's abandoned Mughal capital, 40 km from Agra.", image: '/images/destinations/palace.png' },
      { name: 'Mehtab Bagh', description: 'The "Moonlight Garden" — the best sunset view of the Taj Mahal.', image: '/images/destinations/taj_mahal.png' },
    ],
    alsoLike: ['delhi', 'jaipur', 'varanasi', 'india'],
  },

  jaipur: {
    slug: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    countrySlug: 'india',
    region: 'Rajasthan',
    tagline: 'The Pink City — regal palaces and vibrant bazaars.',
    description:
      "Jaipur, the capital of Rajasthan, is known as the Pink City for its distinctive terracotta-coloured buildings, painted to welcome the Prince of Wales in 1876. It forms one corner of India's famous Golden Triangle, alongside Delhi and Agra. The city is dominated by the magnificent Amer Fort — a dramatic hilltop citadel — and the ornate Hawa Mahal, whose 953 small windows allowed royal ladies to observe street life unseen. Jaipur's bazaars overflow with textiles, jewellery, and handicrafts that represent some of India's finest artisanal traditions.",
    bestTime: 'Oct – March',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['History', 'Architecture', 'Shopping', 'Culture', 'Photography', 'Desert'],
    attractions: [
      { name: 'Hawa Mahal', description: "The Palace of Winds — Jaipur's iconic five-storey screened facade.", image: U('1477587458883-47145ed31898') },
      { name: 'Amer Fort', description: 'A spectacular hilltop fortress with mirror-work interiors and elephant rides.', image: U('1598091272914-e97aeec4f86e') },
      { name: 'City Palace', description: 'A royal complex of palaces, courtyards and gardens in the heart of Jaipur.', image: U('1531804351-e9d42b6548e4') },
      { name: 'Jantar Mantar', description: 'An 18th-century astronomical observatory with monumental instruments.', image: U('1566386900497-2dd906adde89') },
    ],
    alsoLike: ['agra', 'delhi', 'varanasi', 'india'],
  },

  varanasi: {
    slug: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    countrySlug: 'india',
    region: 'Uttar Pradesh',
    tagline: 'The spiritual capital of India — where life meets eternity.',
    description:
      "Varanasi, also known as Banaras or Kashi, is one of the world's oldest continuously inhabited cities and the spiritual heart of Hinduism. The city's famous ghats — stepped riverbanks descending to the sacred Ganges — come alive before dawn with pilgrims bathing, priests performing rituals, and the ancient sound of bells and mantras. The evening Ganga Aarti ceremony is one of the most mesmerising spectacles in all of India. Narrow alleyways wind through the old city past temples, chai stalls, silk weavers, and centuries of unbroken tradition.",
    bestTime: 'Oct – March',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['Spirituality', 'Culture', 'History', 'Photography', 'Yoga & Wellness'],
    attractions: [
      { name: 'Ganges Ghats', description: "84 ghats of spiritual and cultural life stretching along the Ganges' western bank.", image: U('1561361058-c24e1d5d49de') },
      { name: 'Ganga Aarti', description: 'A nightly fire ritual of extraordinary beauty performed at Dashashwamedh Ghat.', image: U('1477987708212-2f2d2ec1e5af') },
      { name: 'Kashi Vishwanath', description: 'One of the most sacred Hindu temples, dedicated to Lord Shiva.', image: U('1566552881560-0be862a7c445') },
      { name: 'Sarnath', description: 'The site where the Buddha gave his first sermon, 13 km from Varanasi.', image: U('1605640840605-43ef70b61b5b') },
    ],
    alsoLike: ['agra', 'delhi', 'jaipur', 'india'],
  },

  goa: {
    slug: 'goa',
    name: 'Goa',
    country: 'India',
    countrySlug: 'india',
    region: 'Goa',
    tagline: 'Sun, sea and a laid-back Portuguese soul.',
    description:
      "Goa is India's smallest and most vibrant state — a unique blend of Indian and Portuguese cultures shaped by over 450 years of colonial history. The beaches range from the bustling nightlife of Baga and Calangute in the north to the serene, secluded coves of Palolem in the south. Between the beaches, whitewashed baroque churches, spice plantations, and colourful markets reveal a culture unlike anywhere else in India. Goa's seafood and local cuisine, with its use of coconut, tamarind, and Goan vinegar, is among India's most distinctive.",
    bestTime: 'Nov – Feb',
    duration: '4–7 Days',
    budget: 'Budget',
    experience: ['Beach', 'Nightlife', 'Food', 'History', 'Water Sports', 'Relaxation'],
    attractions: [
      { name: 'Baga Beach', description: "Goa's most famous beach — perfect for watersports and vibrant beach shacks.", image: U('1512343879784-a960bf40e7f2') },
      { name: 'Basilica of Bom Jesus', description: 'A UNESCO-listed church housing the remains of St. Francis Xavier.', image: U('1516483638261-f4dbaf036963') },
      { name: 'Dudhsagar Falls', description: 'A spectacular four-tiered waterfall cascading through jungle.', image: U('1547471080-7cc2caa01a7e') },
      { name: 'Old Goa', description: 'The "Rome of the Orient" — a collection of magnificent Portuguese-era churches.', image: U('1549880338-374af6e9b4e6') },
    ],
    alsoLike: ['mumbai', 'kerala', 'india', 'delhi'],
  },

  kolkata: {
    slug: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    countrySlug: 'india',
    region: 'West Bengal',
    tagline: "The City of Joy — India's cultural and intellectual capital.",
    description:
      "Kolkata was the capital of British India for over a century, and its grand colonial architecture — the Victoria Memorial, the Howrah Bridge, and stately imperial boulevards — still stands as testament to that era. But Kolkata's soul is its culture: the city of Rabindranath Tagore, Satyajit Ray, and Mother Teresa pulses with literary festivals, art galleries, music, and some of the most passionate football fans in Asia. The food scene — mishti doi, kathi rolls, ilish maach — is unrivalled, and the warmth of Kolkata's people is legendary.",
    bestTime: 'Oct – Feb',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['Culture', 'History', 'Food', 'Art', 'Architecture', 'Festivals'],
    attractions: [
      { name: 'Victoria Memorial', description: 'A magnificent white marble monument built in memory of Queen Victoria.', image: U('1518684071695-2337455f4094') },
      { name: 'Howrah Bridge', description: 'The iconic cantilever bridge spanning the Hooghly River.', image: U('1496442226666-8d4d0e66533a') },
      { name: 'Dakshineswar Kali Temple', description: 'A sacred 19th-century Hindu temple on the banks of the Hooghly.', image: U('1566552881560-0be862a7c445') },
      { name: 'Park Street', description: "Kolkata's legendary dining and entertainment boulevard.", image: U('1512453979798-5ea266f8880c') },
    ],
    alsoLike: ['delhi', 'mumbai', 'varanasi', 'india'],
  },

  hyderabad: {
    slug: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    countrySlug: 'india',
    region: 'Telangana',
    tagline: 'City of Pearls — Nizami culture meets tech innovation.',
    description:
      "Hyderabad is a city of extraordinary contrasts. The old city, dominated by the 16th-century Charminar and the sprawling Chowmahalla Palace, preserves the grandeur of the Nizams — one of the wealthiest royal dynasties in history. A short drive away, HITEC City is home to Google, Microsoft, and hundreds of global tech companies, earning the city the nickname 'Cyberabad'. Hyderabadi biryani — slow-cooked in sealed pots — is considered the finest in India, and the city's pearl and gem markets have traded since the Mughal era.",
    bestTime: 'Oct – Feb',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['History', 'Food', 'Technology', 'Culture', 'Shopping', 'Mughal Heritage'],
    attractions: [
      { name: 'Charminar', description: 'A 16th-century mosque and monument that is the symbol of Hyderabad.', image: U('1548878991-82cdd3a5b530') },
      { name: 'Golconda Fort', description: 'A magnificent medieval fortress with an extraordinary acoustic whispering gallery.', image: U('1609429019995-8c5c7a63a9ca') },
      { name: 'Chowmahalla Palace', description: 'The resplendent palace of the Nizams, with Italianate halls and royal artefacts.', image: U('1531804351-e9d42b6548e4') },
      { name: 'Hussain Sagar Lake', description: 'A large artificial lake with a monolithic Buddha statue on a rocky island.', image: U('1598091272914-e97aeec4f86e') },
    ],
    alsoLike: ['mumbai', 'delhi', 'bengaluru', 'india'],
  },

  bengaluru: {
    slug: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    countrySlug: 'india',
    region: 'Karnataka',
    tagline: "India's Silicon Valley — gardens, craft beer and startup energy.",
    description:
      "Bengaluru (Bangalore) is the technology capital of India — a young, cosmopolitan city with a thriving startup ecosystem, craft beer culture, and year-round pleasant weather thanks to its elevation. The city's British-era parks, particularly Lalbagh Botanical Garden and Cubbon Park, provide a green counterpoint to the urban buzz. Beyond tech, Bengaluru is the gateway to Karnataka's extraordinary heritage — the temples of Belur and Halebidu, the Mysore Palace, and the wildlife of Nagarhole are all within reach.",
    bestTime: 'Oct – Feb',
    duration: '2–3 Days',
    budget: 'Mid-range',
    experience: ['Urban', 'Technology', 'Food', 'Nightlife', 'Nature', 'Culture'],
    attractions: [
      { name: 'Lalbagh Botanical Garden', description: 'A 240-acre botanical garden with a 3,000-year-old rock and glasshouse.', image: U('1472214103451-9374bd1c798e') },
      { name: 'Bangalore Palace', description: 'A Tudor-style royal palace with fortified towers and ornate interiors.', image: U('1531804351-e9d42b6548e4') },
      { name: 'Cubbon Park', description: 'A century-old green lung in the heart of the city.', image: U('1513622470522-26cb3cdf771c') },
      { name: 'MG Road & Brigade Road', description: "Bengaluru's premier shopping and dining thoroughfares.", image: U('1512453979798-5ea266f8880c') },
    ],
    alsoLike: ['hyderabad', 'mumbai', 'goa', 'india'],
  },

  chennai: {
    slug: 'chennai',
    name: 'Chennai',
    country: 'India',
    countrySlug: 'india',
    region: 'Tamil Nadu',
    tagline: 'Gateway to South India — temples, beaches and classical arts.',
    description:
      "Chennai is the cultural capital of South India and a city of great historical depth. Marina Beach — the world's second-longest urban beach — stretches along its eastern edge, while the ancient temples of Mahabalipuram lie an hour to the south. Chennai is the home of Carnatic classical music, Bharatanatyam dance, and Kollywood — the Tamil film industry. The city's cuisine — dosas, idlis, chettinad curries, and filter coffee — is among India's finest, and its art and music festivals attract aficionados from across the world.",
    bestTime: 'Nov – Feb',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['Culture', 'Food', 'History', 'Beach', 'Music & Dance', 'Temples'],
    attractions: [
      { name: 'Marina Beach', description: "The world's second-longest beach stretching 13 km along Chennai's coast.", image: U('1547471080-7cc2caa01a7e') },
      { name: 'Kapaleeshwarar Temple', description: 'A magnificent Dravidian-style Hindu temple in the heart of Mylapore.', image: U('1566552881560-0be862a7c445') },
      { name: 'Government Museum', description: "One of India's oldest museums with extraordinary South Indian art collections.", image: U('1499856871958-5b9627545d1a') },
      { name: 'Mahabalipuram', description: 'Ancient UNESCO-listed shore temples and rock-cut sculptures, 58 km south.', image: U('1609429019995-8c5c7a63a9ca') },
    ],
    alsoLike: ['bengaluru', 'hyderabad', 'goa', 'india'],
  },

  pune: {
    slug: 'pune',
    name: 'Pune',
    country: 'India',
    countrySlug: 'india',
    region: 'Maharashtra',
    tagline: 'Oxford of the East — culture, history and youthful energy.',
    description:
      "Pune is Maharashtra's second city — a vibrant, educated, and culturally rich metropolis that serves as both a historical treasure and a contemporary hub. The Shaniwar Wada fortress is the magnificent centrepiece of the city's Maratha heritage, and the Aga Khan Palace, where Mahatma Gandhi was interned during the independence struggle, is a place of deep historical resonance. Pune's university culture has nurtured a thriving café scene, live music venues, and a growing tech sector that rivals Bengaluru.",
    bestTime: 'Oct – Feb',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['History', 'Culture', 'Food', 'Education', 'Urban', 'Nature'],
    attractions: [
      { name: 'Shaniwar Wada', description: 'An 18th-century Maratha fortification at the heart of old Pune.', image: U('1598091272914-e97aeec4f86e') },
      { name: 'Aga Khan Palace', description: 'A grand palace with significant connections to the Indian independence movement.', image: U('1531804351-e9d42b6548e4') },
      { name: 'Sinhagad Fort', description: 'A dramatic hilltop fortress above Pune with spectacular valley views.', image: U('1605640840605-43ef70b61b5b') },
      { name: 'Osho Ashram', description: 'The internationally renowned meditation and wellness centre in Koregaon Park.', image: U('1513622470522-26cb3cdf771c') },
    ],
    alsoLike: ['mumbai', 'goa', 'bengaluru', 'india'],
  },

  ahmedabad: {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    countrySlug: 'india',
    region: 'Gujarat',
    tagline: "India's first UNESCO World Heritage City.",
    description:
      "Ahmedabad, on the banks of the Sabarmati River, was designated India's first UNESCO World Heritage City in 2017 — recognition of its extraordinary architectural and cultural legacy. The old city is a dense network of traditional neighbourhoods, carved wooden housefonts, mosques, temples, and the remarkable stepwells (vav) that are unique to Gujarat. The Sabarmati Ashram, where Mahatma Gandhi lived and launched the Dandi Salt March, is one of the most significant sites in Indian history. Ahmedabad is also renowned for its textiles, street food, and the vibrant Navratri festival.",
    bestTime: 'Oct – March',
    duration: '2–3 Days',
    budget: 'Budget',
    experience: ['History', 'Architecture', 'Food', 'Culture', 'Heritage', 'Gandhi Heritage'],
    attractions: [
      { name: 'Sabarmati Ashram', description: "Gandhi\'s former residence and the birthplace of the freedom movement's most iconic march.", image: U('1598091272914-e97aeec4f86e') },
      { name: 'Adalaj Stepwell', description: 'An intricately carved 15th-century stepwell blending Hindu and Islamic architecture.', image: U('1605640840605-43ef70b61b5b') },
      { name: 'Sabarmati Riverfront', description: 'A beautifully landscaped waterfront park running along the ancient river.', image: U('1472214103451-9374bd1c798e') },
      { name: 'Old City Pols', description: 'A medieval neighbourhood of interconnected lanes, gates and carved havelis.', image: U('1531804351-e9d42b6548e4') },
    ],
    alsoLike: ['jaipur', 'delhi', 'mumbai', 'india'],
  },
};

/**
 * Get destination data by slug.
 * Returns null if the destination is not found in the static dataset.
 */
export function getDestinationData(slug: string): DestinationData | null {
  return DESTINATIONS[slug.toLowerCase()] ?? null;
}

/**
 * Get a list of "Also Like" destinations given a set of slugs.
 */
export function getRelatedDestinations(slugs: string[]): DestinationData[] {
  return slugs.flatMap(s => {
    const d = DESTINATIONS[s];
    return d ? [d] : [];
  });
}
