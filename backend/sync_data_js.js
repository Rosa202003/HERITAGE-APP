const fs = require('fs');
const path = require('path');
require('dotenv').config();
const supabase = require('./config/supabase.js');

(async () => {
  try {
    const { data: buildings, error: bErr } = await supabase.from('buildings').select('*').order('id', {ascending: true});
    const { data: flags, error: fErr } = await supabase.from('flags').select('*').order('id', {ascending: true});
    const { data: reviews, error: rErr } = await supabase.from('reviews').select('*').order('id', {ascending: true});

    if (bErr) throw bErr;

    const mappedBuildings = (buildings || []).map(b => {
      let tourUrl = null;
      if (Array.isArray(b.tags)) {
        const tourTag = b.tags.find(t => typeof t === 'string' && t.startsWith('TOUR:'));
        if (tourTag) tourUrl = tourTag.substring(5);
      }
      return {
        ...b,
        panorama_url: tourUrl || b.panorama_url || (b.id === 1 ? 'https://pannellum.org/images/alma.jpg' : b.id === 2 ? 'https://pannellum.org/images/cerro-toco-0.jpg' : null)
      };
    });

    const content = `// ========================================
// MOCK BUILDINGS DATA - SYNCED WITH SUPABASE
// ========================================

const MOCK_BUILDINGS = ${JSON.stringify(mappedBuildings, null, 2)};

const MOCK_FLAGS = ${JSON.stringify(flags || [], null, 2)};

const MOCK_REVIEWS = ${JSON.stringify(reviews || [], null, 2)};

if (typeof window !== "undefined") {
  window.MOCK_BUILDINGS = MOCK_BUILDINGS;
  window.MOCK_FLAGS = MOCK_FLAGS;
  window.MOCK_REVIEWS = MOCK_REVIEWS;
}

console.log("MOCK_BUILDINGS loaded:", MOCK_BUILDINGS.length, "buildings");
`;

    const targetPath = path.join(__dirname, '../JS/data.js');
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log("Successfully updated JS/data.js with", mappedBuildings.length, "buildings!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to sync data.js:", err);
    process.exit(1);
  }
})();
