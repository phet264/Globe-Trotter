const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replacements = [
  { from: /\bprisma\.city\b/g, to: 'prisma.destination' },
  { from: /\bprisma\.activity\b/g, to: 'prisma.place' },
  { from: /\bprisma\.tripStop\b/g, to: 'prisma.itineraryDay' },
  { from: /\bprisma\.itineraryActivity\b/g, to: 'prisma.activity' },
  
  { from: /\btripStops\b/g, to: 'itineraryDays' },
  { from: /\bTripStop\b/g, to: 'ItineraryDay' },
  
  { from: /\bitineraryActivity\b/g, to: 'activity' },
  { from: /\bItineraryActivity\b/g, to: 'Activity' },
  
  { from: /\bcityId\b/g, to: 'destinationId' },
  { from: /\bcity\b/g, to: 'destination' },
  { from: /\bcities\b/g, to: 'destinations' },
  { from: /\bCity\b/g, to: 'Destination' },
];

walk(__dirname, (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    if (file.includes('node_modules') || file.includes('.next')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  });
});
