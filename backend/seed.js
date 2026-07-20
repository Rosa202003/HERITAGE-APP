require('dotenv').config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const fallbackBuildings = [
    {
        name: "German Administrative Boma",
        era: "German",
        condition: "Good",
        status: "Grade I Listed",
        location: "City Centre",
        year: 1891,
        image: "../ASSETS/images/oldboma.png",
        area: "740 m²",
        description: "Late German colonial building overseeing the commercial harbour.",
        significance: "Documents the evolution of Dar es Salaam as a major East African port.",
        architect: "Unknown",
        ownership: "Tanzania Ports Authority",
        style: "German Colonial Administrative",
        inspected: "2023-11-08",
        code: "DSH-1891-001",
        lat: -6.8161,
        lng: 39.2894
    },
    {
        name: "St. Joseph Metropolitan Cathedral",
        era: "German",
        condition: "Excellent",
        status: "Grade I Listed",
        location: "City Centre",
        year: 1898,
        image: "../ASSETS/images/stjosephcathedral.png",
        area: "740 m²",
        description: "Neo-Gothic Catholic cathedral with twin towers.",
        significance: "One of the oldest religious buildings in Dar es Salaam.",
        architect: "Unknown",
        ownership: "Catholic Archdiocese",
        style: "Neo-Gothic",
        inspected: "2023-11-08",
        code: "DSH-1898-001",
        lat: -6.8172,
        lng: 39.2891
    },
    {
        name: "Azania Front Lutheran Church",
        era: "German",
        condition: "Good",
        status: "Grade I Listed",
        location: "Kivukoni",
        year: 1898,
        image: "../ASSETS/images/azaniafront.png",
        area: "740 m²",
        description: "Historic Lutheran church with distinctive architecture.",
        significance: "A landmark on the Dar es Salaam waterfront.",
        architect: "Unknown",
        ownership: "Lutheran Church of Tanzania",
        style: "Romanesque Revival",
        inspected: "2023-11-08",
        code: "DSH-1898-002",
        lat: -6.8188,
        lng: 39.2881
    },
    {
        name: "Old Harbour Master's Office",
        era: "German",
        condition: "Fair",
        status: "Grade II Listed",
        location: "Kivukoni",
        year: 1915,
        image: "../ASSETS/images/harbordsm.png",
        area: "740 m²",
        description: "Historic harbour master's office building.",
        significance: "Represents British colonial maritime administration.",
        architect: "Unknown",
        ownership: "Tanzania Ports Authority",
        style: "Colonial Maritime",
        inspected: "2023-11-08",
        code: "DSH-1915-001",
        lat: -6.8194,
        lng: 39.2876
    },
    {
        name: "General Post Office",
        era: "British",
        condition: "Poor",
        status: "Grade II Listed",
        location: "City Centre",
        year: 1913,
        image: "../ASSETS/images/postayazamani.png",
        area: "740 m²",
        description: "Historic post office building in need of restoration.",
        significance: "A key example of British colonial public architecture.",
        architect: "Unknown",
        ownership: "Government of Tanzania",
        style: "Edwardian Colonial",
        inspected: "2023-11-08",
        code: "DSH-1913-001",
        lat: -6.8147,
        lng: 39.2904
    },
    {
        name: "Dar es Salaam City Hall",
        era: "Independence",
        condition: "Good",
        status: "Grade II Listed",
        location: "City Centre",
        year: 1956,
        image: "../ASSETS/images/karimjeehall.png",
        area: "740 m²",
        description: "Historic city hall building with colonial architecture.",
        significance: "Represents the transition from colonial to independent governance.",
        architect: "Unknown",
        ownership: "Dar es Salaam City Council",
        style: "Modern Colonial",
        inspected: "2023-11-08",
        code: "DSH-1956-001",
        lat: -6.8155,
        lng: 39.2897
    },
    {
        name: "Mnazi Mmoja Hospital Original Block",
        era: "British",
        condition: "Critical",
        status: "Proposed",
        location: "Upanga",
        year: 1918,
        image: "https://via.placeholder.com/600x400/cccccc/666?text=Heritage+Building",
        area: "740 m²",
        description: "Original hospital building currently at risk of demolition.",
        significance: "Represents the development of healthcare infrastructure.",
        architect: "Unknown",
        ownership: "Government of Tanzania",
        style: "Colonial Medical",
        inspected: "2023-11-08",
        code: "DSH-1918-001",
        lat: -6.8134,
        lng: 39.2921
    },
    {
        name: "Dar es Salaam Railway Station",
        era: "German",
        condition: "Fair",
        status: "Grade I Listed",
        location: "Kariakoo",
        year: 1929,
        image: "../ASSETS/images/tazara.png",
        area: "740 m²",
        description: "Historic railway station with distinctive colonial architecture.",
        significance: "A major gateway to Dar es Salaam.",
        architect: "Unknown",
        ownership: "Tanzania Railways Corporation",
        style: "Colonial Railway",
        inspected: "2023-11-08",
        code: "DSH-1929-001",
        lat: -6.8176,
        lng: 39.2856
    }
];

const mockFlags = [
    {
        building_name: "Mnazi Mmoja Hospital Original",
        risk_type: "demolition",
        description: "The original hospital block is slated for demolition to make way for a modern tower. Immediate intervention needed.",
        reporter_name: "Heritage Watcher",
        status: "pending"
    },
    {
        building_name: "General Post Office",
        risk_type: "neglect",
        description: "The roof is leaking heavily in the eastern wing and causing significant water damage to the historic masonry.",
        reporter_name: "Local Resident",
        status: "pending"
    },
    {
        building_name: "Old Harbour Master's Office",
        risk_type: "structural",
        description: "Visible cracking along the south wall of the building. Risk of partial collapse if not addressed.",
        reporter_name: "ARU Architecture Student",
        status: "pending"
    }
];

async function runSeed() {
    console.log("=== Seeding Supabase Database ===\n");

    // -------- BUILDINGS --------
    console.log("Step 1: Checking existing buildings...");
    const { data: existing } = await supabase.from('buildings').select('name');
    const existingNames = new Set((existing || []).map(b => b.name));

    const toInsert = fallbackBuildings.filter(b => !existingNames.has(b.name));
    if (toInsert.length === 0) {
        console.log("All buildings already exist – skipping insert.\n");
    } else {
        console.log(`Inserting ${toInsert.length} new buildings...`);
        const { data: inserted, error: insertError } = await supabase
            .from('buildings')
            .insert(toInsert)
            .select();

        if (insertError) {
            console.error("Error inserting buildings:", insertError.message);
        } else {
            inserted.forEach(b => console.log(`  ✓ ${b.name} (id=${b.id})`));
        }
    }

    // -------- FLAGS --------
    console.log("\nStep 2: Fetching all buildings for flag linking...");
    const { data: allBuildings } = await supabase.from('buildings').select('id, name');
    if (!allBuildings || allBuildings.length === 0) {
        console.error("No buildings found – skipping flags.");
        process.exit(0);
    }

    const buildingMap = {};
    allBuildings.forEach(b => { buildingMap[b.name] = b.id; });

    console.log(`Step 3: Seeding ${mockFlags.length} sample risk flags...`);
    const { data: existingFlags } = await supabase.from('flags').select('reporter_name, building_id');

    for (const f of mockFlags) {
        const bid = buildingMap[f.building_name];
        if (!bid) {
            console.warn(`  ⚠ Building not found: ${f.building_name}`);
            continue;
        }
        // Skip if a flag from same reporter already exists for this building
        const alreadyExists = (existingFlags || []).some(
            ef => ef.building_id === bid && ef.reporter_name === f.reporter_name
        );
        if (alreadyExists) {
            console.log(`  • Skipping duplicate flag for ${f.building_name}`);
            continue;
        }
        const { error } = await supabase.from('flags').insert({
            building_id: bid,
            risk_type: f.risk_type,
            description: f.description,
            reporter_name: f.reporter_name,
            status: f.status
        });
        if (error) {
            console.error(`  ✗ Error inserting flag for ${f.building_name}:`, error.message);
        } else {
            console.log(`  ✓ Flag: ${f.risk_type} → ${f.building_name}`);
        }
    }

    console.log("\n=== Seeding completed! ===");
    process.exit(0);
}

runSeed().catch(err => {
    console.error("Unhandled error:", err);
    process.exit(1);
});
