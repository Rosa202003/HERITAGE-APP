require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// RICH DATA: visits, gallery images, panorama_url
// ============================================================
const buildingRichData = {
  "German Administrative Boma": {
    visits: 28430,
    panorama_url: "https://pannellum.org/images/alma.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Dar_es_Salaam_Old_Boma.jpg/800px-Dar_es_Salaam_Old_Boma.jpg",
      "https://images.unsplash.com/photo-1523413307858-97048baad01e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&h=500&fit=crop"
    ]
  },
  "St. Joseph Metropolitan Cathedral": {
    visits: 51200,
    panorama_url: "https://pannellum.org/images/cerro-toco-0.jpg",
    images: [
      "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519913710-14825ec7e6d5?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1697399939714-b5adbb642c12?w=800&h=500&fit=crop"
    ]
  },
  "Azania Front Lutheran Church": {
    visits: 37900,
    panorama_url: "https://pannellum.org/images/bma-1.jpg",
    images: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1523413307858-97048baad01e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop"
    ]
  },
  "Old Harbour Master's Office": {
    visits: 14700,
    panorama_url: "https://pannellum.org/images/alma.jpg",
    images: [
      "https://images.unsplash.com/photo-1589177900326-900782f88a55?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571983823233-7af7c3c4cd8e?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586191582056-7a3e58e8bff2?w=800&h=500&fit=crop"
    ]
  },
  "General Post Office": {
    visits: 9800,
    panorama_url: "https://pannellum.org/images/cerro-toco-0.jpg",
    images: [
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=500&fit=crop"
    ]
  },
  "Dar es Salaam City Hall": {
    visits: 22000,
    panorama_url: "https://pannellum.org/images/bma-1.jpg",
    images: [
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1697399939714-b5adbb642c12?w=800&h=500&fit=crop"
    ]
  },
  "Mnazi Mmoja Hospital Original Block": {
    visits: 5200,
    panorama_url: "https://pannellum.org/images/alma.jpg",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=500&fit=crop"
    ]
  },
  "Dar es Salaam Railway Station": {
    visits: 44800,
    panorama_url: "https://pannellum.org/images/cerro-toco-0.jpg",
    images: [
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540961395667-e3e19ab6083d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1566981731417-d4c8e17a9e82?w=800&h=500&fit=crop"
    ]
  }
};

// ============================================================
// MOCK REVIEWS
// ============================================================
const mockReviews = [
  { building_name: "German Administrative Boma", user_name: "Amina K.", rating: 5, body: "A truly remarkable piece of history. The coral stone construction is unlike anything else in the city. The arched colonnades are stunning and well-preserved.", helpful_count: 34, avatar: "AK", created_at: "2026-05-12T10:00:00Z" },
  { building_name: "German Administrative Boma", user_name: "Tourist_Marco", rating: 4, body: "Visited during my trip to Dar. The architecture is impressive but signage explaining the history is limited. Would love more information panels.", helpful_count: 21, avatar: "TM", created_at: "2026-04-03T10:00:00Z" },
  { building_name: "German Administrative Boma", user_name: "Prof. L. Kariuki", rating: 5, body: "As an architectural historian, this building represents the most intact example of German colonial administration buildings in Sub-Saharan Africa.", helpful_count: 58, avatar: "LK", created_at: "2026-02-18T10:00:00Z" },
  { building_name: "German Administrative Boma", user_name: "NaomiD_DSM", rating: 3, body: "Interesting building but the area around it is quite busy. Hard to appreciate the full structure. Best viewed early morning when traffic is light.", helpful_count: 12, avatar: "ND", created_at: "2026-06-01T10:00:00Z" },
  { building_name: "St. Joseph Metropolitan Cathedral", user_name: "Father Emmanuel", rating: 5, body: "The twin towers are majestic against the Dar skyline. The stained glass windows inside are absolutely breathtaking. A must-visit for faith and architecture.", helpful_count: 89, avatar: "FE", created_at: "2026-05-20T10:00:00Z" },
  { building_name: "St. Joseph Metropolitan Cathedral", user_name: "Zanele M.", rating: 5, body: "I've visited cathedrals across East Africa and this one stands out for its German Gothic detailing. The interior nave has incredible acoustics.", helpful_count: 44, avatar: "ZM", created_at: "2026-03-15T10:00:00Z" },
  { building_name: "St. Joseph Metropolitan Cathedral", user_name: "James_ExploresAfrica", rating: 4, body: "Grand and impressive building. Sunday Mass is a particularly special time to visit. The local congregation gives it a warm, living atmosphere.", helpful_count: 27, avatar: "JE", created_at: "2026-01-09T10:00:00Z" },
  { building_name: "St. Joseph Metropolitan Cathedral", user_name: "ArchStudent_ARU", rating: 5, body: "The flying buttresses and pointed arches are a perfect example of Neo-Gothic applied in tropical Africa. The builders adapted European styles beautifully.", helpful_count: 33, avatar: "AA", created_at: "2026-04-22T10:00:00Z" },
  { building_name: "Azania Front Lutheran Church", user_name: "Lars Eriksson", rating: 5, body: "As a Swedish visitor, this church holds special significance. The German missionary heritage is palpable. The clock tower is iconic on the Dar waterfront.", helpful_count: 51, avatar: "LE", created_at: "2026-06-05T10:00:00Z" },
  { building_name: "Azania Front Lutheran Church", user_name: "Fatuma Rashid", rating: 4, body: "Beautiful waterfront location. The Romanesque revival style is well maintained. Lovely to attend the Sunday morning service and hear the choir.", helpful_count: 29, avatar: "FR", created_at: "2026-03-28T10:00:00Z" },
  { building_name: "Azania Front Lutheran Church", user_name: "TravelWithKimani", rating: 4, body: "One of the most photogenic buildings in Dar es Salaam. The golden evening light on the pale facade is stunning. Budget 30 minutes here at minimum.", helpful_count: 18, avatar: "TK", created_at: "2026-05-14T10:00:00Z" },
  { building_name: "Old Harbour Master's Office", user_name: "Capt. B. Mwangi", rating: 4, body: "Working in the maritime sector, this building is a living piece of Dar's port history. The original timber fittings inside are remarkable survivors.", helpful_count: 22, avatar: "BM", created_at: "2026-04-10T10:00:00Z" },
  { building_name: "Old Harbour Master's Office", user_name: "Historian_Mzuri", rating: 3, body: "Significant building but access is restricted as it is still a working office. Can only view from outside. Urgently needs exterior restoration work.", helpful_count: 15, avatar: "HM", created_at: "2026-02-22T10:00:00Z" },
  { building_name: "General Post Office", user_name: "PostalWorker_T", rating: 3, body: "A beautiful building on the outside that sadly reflects years of underinvestment. The clock tower is a city icon. Please restore this treasure before it is too late.", helpful_count: 41, avatar: "PT", created_at: "2026-05-30T10:00:00Z" },
  { building_name: "General Post Office", user_name: "Sarah_HeritageWatch", rating: 2, body: "Concerning state of disrepair. The eastern wing roof is visibly damaged. This Edwardian gem deserves urgent attention from the Antiquities Department.", helpful_count: 67, avatar: "SH", created_at: "2026-06-15T10:00:00Z" },
  { building_name: "Dar es Salaam City Hall", user_name: "Cllr. Joseph Ng.", rating: 4, body: "The grand civic facade still commands respect after 70 years. The transition-era architecture captures the optimism of approaching independence beautifully.", helpful_count: 31, avatar: "JN", created_at: "2026-04-18T10:00:00Z" },
  { building_name: "Dar es Salaam City Hall", user_name: "UrbanWalker_DSM", rating: 4, body: "An anchor of the city centre. The large public plaza makes it a great meeting point. Well-maintained compared to many nearby heritage buildings.", helpful_count: 19, avatar: "UW", created_at: "2026-03-07T10:00:00Z" },
  { building_name: "Mnazi Mmoja Hospital Original Block", user_name: "Dr. Amali Nkosi", rating: 2, body: "As a medical professional this building's history is deeply moving. The colonial-era wards tell a complex story. Its demolition would be an irreplaceable loss.", helpful_count: 82, avatar: "AN", created_at: "2026-05-25T10:00:00Z" },
  { building_name: "Mnazi Mmoja Hospital Original Block", user_name: "PreserveTanzania", rating: 1, body: "URGENT: This building is at imminent risk of demolition. The original 1918 block is one of the oldest standing medical facilities in East Africa. Community action needed NOW.", helpful_count: 145, avatar: "PT", created_at: "2026-06-18T10:00:00Z" },
  { building_name: "Dar es Salaam Railway Station", user_name: "RailFan_EA", rating: 5, body: "The original ceramic tile work in the concourse is breathtaking and still largely intact. The baroque facade is unique in East Africa. Absolute must-visit for railway enthusiasts.", helpful_count: 73, avatar: "RE", created_at: "2026-04-29T10:00:00Z" },
  { building_name: "Dar es Salaam Railway Station", user_name: "Backpacker_Odessa", rating: 4, body: "Used this station to catch the TAZARA train to Zambia. The colonial architecture makes for an unforgettable departure point. The great hall still evokes the romance of rail travel.", helpful_count: 48, avatar: "BO", created_at: "2026-03-20T10:00:00Z" },
  { building_name: "Dar es Salaam Railway Station", user_name: "Engineer_Kijana", rating: 4, body: "The engineering of the original structure is impressive for its era. The central clock tower anchors the facade beautifully. Some interior sections need restoration though.", helpful_count: 25, avatar: "EK", created_at: "2026-02-05T10:00:00Z" },
  { building_name: "Dar es Salaam Railway Station", user_name: "Zawadi_Travels", rating: 5, body: "Arrived here after a long journey and the station itself was a destination. The colonial grandeur transports you to another era. A living monument to Tanzania's connectivity.", helpful_count: 37, avatar: "ZT", created_at: "2026-06-10T10:00:00Z" }
];

async function runSeed() {
  console.log("=== Urithi Majengo: Seeding Rich Data ===\n");

  const { data: allBuildings, error: bldErr } = await supabase.from('buildings').select('id, name');
  if (bldErr || !allBuildings) { console.error("Cannot fetch buildings:", bldErr); process.exit(1); }
  
  const buildingMap = {};
  allBuildings.forEach(b => { buildingMap[b.name] = b.id; });

  // ---- Update buildings ----
  console.log("Step 1: Updating buildings with visits, images, panorama_url...");
  for (const [name, rich] of Object.entries(buildingRichData)) {
    const bid = buildingMap[name];
    if (!bid) { console.warn(`  ⚠ Not found: ${name}`); continue; }
    const { error } = await supabase
      .from('buildings')
      .update({ visits: rich.visits, images: rich.images, panorama_url: rich.panorama_url })
      .eq('id', bid);
    if (error) console.error(`  ✗ ${name}:`, error.message);
    else console.log(`  ✓ Updated: ${name}`);
  }

  // ---- Seed reviews ----
  console.log("\nStep 2: Seeding reviews...");
  const { data: existingReviews } = await supabase.from('reviews').select('building_id, user_name');

  for (const review of mockReviews) {
    const bid = buildingMap[review.building_name];
    if (!bid) { console.warn(`  ⚠ Building not found: ${review.building_name}`); continue; }
    const alreadyExists = (existingReviews || []).some(er => er.building_id === bid && er.user_name === review.user_name);
    if (alreadyExists) { console.log(`  • Skip duplicate: ${review.user_name}`); continue; }
    const { error } = await supabase.from('reviews').insert({
      building_id: bid,
      user_name: review.user_name,
      avatar: review.avatar,
      rating: review.rating,
      body: review.body,
      helpful_count: review.helpful_count,
      created_at: review.created_at
    });
    if (error) console.error(`  ✗ ${review.user_name}:`, error.message);
    else console.log(`  ✓ Review: ${review.user_name} → ${review.building_name}`);
  }

  console.log("\n=== Done! ===");
  process.exit(0);
}

runSeed().catch(err => { console.error(err); process.exit(1); });
