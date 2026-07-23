/**
 * Citizen Workflow & Authorization Unit Test Suite
 * 
 * Tests:
 * 1. Citizen Registration (POST /api/auth/register)
 * 2. Citizen Login & Token Retrieval (POST /api/auth/login)
 * 3. Citizen Profile / Session Check (GET /api/auth/me)
 * 4. Public Inventory Access (GET /api/buildings)
 * 5. At-Risk Flag Submission (POST /api/flags)
 * 6. Building Review & Rating Submission (POST /api/reviews)
 * 7. Helpful Review Upvoting (POST /api/reviews/:id/helpful)
 * 8. Restricted Access Enforcement (GET /api/officers -> HTTP 403)
 */

const http = require("http");
const assert = require("assert");

const BASE_URL = "http://localhost:5000";

// Helper for HTTP requests
function makeRequest(path, method = "GET", headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test Runner
async function runCitizenTests() {
  console.log("\n==================================================");
  console.log(" STARTING CITIZEN WORKFLOW & ACCESS UNIT TESTS");
  console.log("==================================================\n");

  // Ensure Express server is active
  let isServerReady = false;
  try {
    const check = await makeRequest("/api/buildings", "GET");
    if (check.statusCode === 200 && Array.isArray(check.body) && check.body.length > 0) {
      isServerReady = true;
    }
  } catch (err) {}

  if (!isServerReady) {
    console.log("Starting backend Express server on port 5000...");
    require("./server.js");
    await new Promise((r) => setTimeout(r, 2500));
  }

  const timestamp = Date.now();
  const testUser = {
    full_name: `Citizen TestUser ${timestamp}`,
    email: `citizen_${timestamp}@heritage.tz`,
    password: `TestPass123!_${timestamp}`
  };

  let token = null;
  let citizenId = null;
  let createdReviewId = null;
  let createdFlagId = null;

  try {
    // ----------------------------------------------------
    // TEST 1: Citizen Registration
    // ----------------------------------------------------
    console.log(" Test 1: Registering new Citizen user...");
    const regRes = await makeRequest("/api/auth/register", "POST", {}, testUser);
    assert.strictEqual(
      regRes.statusCode,
      201,
      `Expected HTTP 201 Created, got ${regRes.statusCode}: ${JSON.stringify(regRes.body)}`
    );
    assert.ok(regRes.body.user, "Response should contain user object");
    assert.strictEqual(regRes.body.user.email, testUser.email, "Email should match");
    assert.strictEqual(regRes.body.user.role, "citizen", "Role should be 'citizen'");
    console.log("  SUCCESS: Citizen registered successfully!");

    // ----------------------------------------------------
    // TEST 2: Citizen Login
    // ----------------------------------------------------
    console.log("\n Test 2: Logging in with Citizen credentials...");
    const loginRes = await makeRequest("/api/auth/login", "POST", {}, {
      email: testUser.email,
      password: testUser.password
    });
    assert.strictEqual(
      loginRes.statusCode,
      200,
      `Expected HTTP 200 OK, got ${loginRes.statusCode}: ${JSON.stringify(loginRes.body)}`
    );
    assert.ok(loginRes.body.token, "Login response must return JWT token");
    assert.ok(loginRes.body.user, "Login response must return user object");
    assert.strictEqual(loginRes.body.user.role, "citizen", "User role must be 'citizen'");
    
    token = loginRes.body.token;
    citizenId = loginRes.body.user.id;
    console.log("   SUCCESS: Citizen logged in and JWT token received!");

    // ----------------------------------------------------
    // TEST 3: Authenticated Citizen Session Check (/api/auth/me)
    // ----------------------------------------------------
    console.log("\n Test 3: Verifying active Citizen session (/api/auth/me)...");
    const meRes = await makeRequest("/api/auth/me", "GET", { Authorization: `Bearer ${token}` });
    assert.strictEqual(meRes.statusCode, 200, `Expected HTTP 200 OK, got ${meRes.statusCode}`);
    const meUser = meRes.body.user || meRes.body;
    assert.strictEqual(meUser.email, testUser.email, "Session email must match");
    console.log("  SUCCESS: Citizen session verified!");

    // ----------------------------------------------------
    // TEST 4: Public Georeferenced Inventory Access
    // ----------------------------------------------------
    console.log("\n Test 4: Accessing public building inventory...");
    const bRes = await makeRequest("/api/buildings", "GET");
    console.log("bRes statusCode:", bRes.statusCode, "bRes body type:", typeof bRes.body, "bRes body:", bRes.body);
    assert.strictEqual(bRes.statusCode, 200, `Expected HTTP 200 OK, got ${bRes.statusCode}`);
    const buildingsList = Array.isArray(bRes.body) ? bRes.body : (bRes.body && (bRes.body.buildings || bRes.body.data) ? (bRes.body.buildings || bRes.body.data) : []);
    assert.ok(buildingsList.length > 0, "Inventory should contain buildings");
    const testBuildingId = buildingsList[0].id;
    console.log(`   SUCCESS: Retrieved ${buildingsList.length} building records! Using Building ID ${testBuildingId} for tests.`);

    // ----------------------------------------------------
    // TEST 5: Citizen Flag Report Submission
    // ----------------------------------------------------
    console.log("\n Test 5: Submitting At-Risk Flag Report for building...");
    const flagPayload = {
      building_id: testBuildingId,
      risk_type: "structural",
      description: "Severe water damage and roof sagging observed on eastern wall during inspection.",
      reporter_name: testUser.full_name,
      reporter_email: testUser.email
    };
    const flagRes = await makeRequest("/api/flags", "POST", {}, flagPayload);
    assert.strictEqual(flagRes.statusCode, 201, `Expected HTTP 201 Created, got ${flagRes.statusCode}`);
    assert.ok(flagRes.body.flag, "Response must contain created flag record");
    const createdFlag = Array.isArray(flagRes.body.flag) ? flagRes.body.flag[0] : flagRes.body.flag;
    createdFlagId = createdFlag.id;
    assert.strictEqual(createdFlag.status, "pending", "New flag status should be 'pending'");
    console.log(`   SUCCESS: At-Risk Flag Report submitted (Flag ID ${createdFlagId})!`);

    // ----------------------------------------------------
    // TEST 6: Citizen Review & Rating Submission
    // ----------------------------------------------------
    console.log("\nTest 6: Submitting Review & 5-Star Rating for building...");
    const reviewPayload = {
      building_id: testBuildingId,
      rating: 5,
      comment: "Outstanding 19th-century German colonial architecture. Symmetrical arches and stone craft are well maintained."
    };
    const revRes = await makeRequest(
      "/api/reviews",
      "POST",
      { Authorization: `Bearer ${token}` },
      reviewPayload
    );
    assert.strictEqual(revRes.statusCode, 201, `Expected HTTP 201 Created, got ${revRes.statusCode}`);
    assert.ok(revRes.body.review, "Response must return review object");
    createdReviewId = revRes.body.review.id;
    assert.strictEqual(revRes.body.review.rating, 5, "Rating should be 5");
    console.log(`   SUCCESS: Review & Rating submitted (Review ID ${createdReviewId})!`);

    // ----------------------------------------------------
    // TEST 7: Helpful Review Upvoting
    // ----------------------------------------------------
    if (createdReviewId) {
      console.log("\n Test 7: Upvoting review helpfulness count...");
      const upvoteRes = await makeRequest(
        `/api/reviews/${createdReviewId}/helpful`,
        "POST",
        { Authorization: `Bearer ${token}` }
      );
      assert.strictEqual(upvoteRes.statusCode, 200, `Expected HTTP 200 OK, got ${upvoteRes.statusCode}`);
      assert.ok(upvoteRes.body.review, "Response should return updated review");
      assert.strictEqual(upvoteRes.body.review.helpful_count, 1, "Helpful count should be incremented to 1");
      console.log("   SUCCESS: Review helpfulness upvoted!");
    }

    // ----------------------------------------------------
    // TEST 8: Restricted Access Security Enforcement
    // ----------------------------------------------------
    console.log("\nTest 8: Verifying Citizen is DENIED access to Restricted Officer Portal (/api/officers)...");
    const restrictedRes = await makeRequest("/api/officers", "GET", { Authorization: `Bearer ${token}` });
    assert.strictEqual(
      restrictedRes.statusCode,
      403,
      `Security Check Failed! Expected HTTP 403 Forbidden for Citizen, got ${restrictedRes.statusCode}`
    );
    console.log(" SUCCESS: Access Control enforced! Citizen correctly DENIED officer administrative access.");

    console.log("\n==================================================");
    console.log("ALL CITIZEN UNIT TESTS PASSED SUCCESSFULLY! (8/8)");
    console.log("==================================================\n");
    process.exit(0);

  } catch (err) {
    console.error("\n TEST FAILED:", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

// Execute tests
runCitizenTests();
