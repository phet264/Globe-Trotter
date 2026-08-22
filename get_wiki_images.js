const https = require('https');
const fs = require('fs');

const places = [
  'France', 'India', 'Italy', 'Japan',
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 
  'Ahmedabad', 'Goa', 'Surat', 'Lucknow'
];

async function getWikiImage(place) {
  return new Promise((resolve) => {
    const options = {
      headers: { 'User-Agent': 'GlobeTrotterBot/1.0 (test@globetrotter.test)' }
    };
    https.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${place}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ place, url: json.thumbnail ? json.thumbnail.source : null });
        } catch(e) {
          resolve({ place, url: null });
        }
      });
    }).on('error', () => resolve({ place, url: null }));
  });
}

async function main() {
  const results = await Promise.all(places.map(getWikiImage));
  const mapping = {};
  results.forEach(r => {
    if (r.url) {
      const highResUrl = r.url.replace(/\/\d+px-/, '/800px-');
      mapping[r.place.toLowerCase()] = highResUrl;
    }
  });
  console.log(JSON.stringify(mapping, null, 2));
}

main();
