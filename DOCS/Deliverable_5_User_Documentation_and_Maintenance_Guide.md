# Deliverable 5: User Documentation & Maintenance Guide

**Project Title**: Digital Inventory and Virtual-Tour System for Dar es Salaam Heritage Buildings  
**Project ID**: Project 13  
**Domain**: Cultural Heritage  
**System Name**: Urithi Majengo (*Heritage Buildings*)  

---

## Part I: End-User Manual

### 1. Introduction to Urithi Majengo
Urithi Majengo is a public georeferenced web portal and digital inventory designed to preserve, showcase, and protect Dar es Salaam's architectural heritage across German colonial, British colonial, Swahili, and early independence eras.

---

### 2. Public Visitor Guide

#### 2.1 Exploring the Interactive Georeferenced Map
1. Open the homepage (`HTML/index.html`).
2. Navigate to the **Interactive Heritage Map** section.
3. Use your mouse or touch gestures to pan and zoom across Dar es Salaam.
4. Click on any colored map marker to view a summary popup card detailing the building name, code, era, and condition.
5. Click **View Full Details** inside the popup to launch the building modal.

Marker Color Legend:
- **Teal / Green**: Good / Excellent Structural Condition
- **Gold / Yellow**: Fair Structural Condition
- **Orange / Red**: Poor / At Risk Structural Condition

#### 2.2 Searching & Filtering Heritage Records
1. Go to the **All Buildings** page (`HTML/buildings.html`).
2. Type any keyword (e.g. *"Boma"*, *"Cathedral"*, *"Kivukoni"*) into the top search bar.
3. Filter structures using the dropdown menus:
   - **Era**: German Colonial, British Colonial, Swahili Architecture, Independence Era.
   - **Condition**: Excellent, Good, Fair, Poor, At Risk.
   - **Status**: Grade I Listed, Grade II Listed, Listed, Proposed.

#### 2.3 Experiencing 360° Virtual Tours
1. Click on any building card in the inventory grid to open its detail window.
2. Select the **360° Virtual Tour** tab.
3. Click and drag your cursor across the panorama window to rotate 360 degrees horizontally and vertically.
4. Use your mouse scroll wheel to zoom in on architectural details (colonnades, stained glass, stonework).

---

### 3. Citizen Reporter & Community Guide

#### 3.1 Reporting At-Risk Heritage Structures
If you observe a listed or historic building undergoing unauthorized alterations, structural cracking, neglect, or demolition threats:
1. Navigate to **Report At-Risk** (`HTML/risk.html`).
2. Select the building from the dropdown list (or leave unselected if submitting a new unlisted site).
3. Select the **Risk Type** (*Structural Degradation, Neglect & Water Damage, Demolition Threat, Unauthorized Alteration*).
4. Provide a detailed description of the threat observed and specify your name and email contact.
5. Click **Submit Flag Report**. Your report will be immediately dispatched to the Antiquities Department officer dashboard.

#### 3.2 Submitting Community Reviews & Ratings
1. Open any building modal and select the **Community Reviews** tab.
2. Assign a star rating (1 to 5 stars) and write your historical commentary or visitor experience.
3. Click **Submit Review**.

---

## Part II: Antiquities Officer Operations Manual

### 1. Accessing the Restricted Officer Portal
1. Open `http://localhost:5000/HTML/officer.html` (or click **Officer Portal** in the navigation header).
2. If prompted, log in using authorized Antiquities Department officer credentials.

### 2. Officer Dashboard Navigation
The officer workstation includes four live metric cards that auto-refresh every 5 seconds:
- **Total Buildings**: Current number of georeferenced inventory records.
- **Pending At-Risk Flags**: Unresolved citizen threat reports awaiting inspection.
- **Grade I Listed**: Count of top-tier protected heritage monuments.
- **Community Reviews**: Total public feedback submissions.

### 3. Managing Building Records (CRUD)
- **Adding a New Building**:
  1. Click **+ Add Heritage Building**.
  2. Fill in the building details. Only the **Building Name** is strictly mandatory; other fields default to safe standard values.
  3. Leave **Building Code** as `"Auto"` to automatically assign the next sequential identifier (e.g. `DSH-014`).
  4. Paste image and 360° panorama URLs if available.
  5. Click **Save Building Record**.
- **Editing an Existing Record**:
  1. Locate the building in the Inventory Table and click **Edit**.
  2. Update condition rating, legal protection status, or inspection date.
  3. Click **Save Changes**.
- **Deleting a Record**:
  1. Click **Delete** next to the target record and confirm the prompt.

### 4. Triage & Resolution of At-Risk Citizen Reports
1. Scroll down to the **Citizen Threat Reports & Flags** section.
2. Review incoming threat details, reporter contact, and risk type.
3. Change the status selector from **Pending** to **Under Review** or **Resolved**.
4. Type resolution notes (e.g. *"Inspected by Antiquities Officer on 2026-07-23. Stop-work order issued to developer."*).

---

## Part III: System Administration & Maintenance Guide

### 1. Technology Stack & Dependencies

| Component | Technology | Version / Specification |
| :--- | :--- | :--- |
| **Runtime Environment** | Node.js | v18.x or higher |
| **Backend Framework** | Express.js | v5.x |
| **Database & Auth Engine** | Supabase (PostgreSQL) | `@supabase/supabase-js` v2.x |
| **Map Rendering** | Leaflet.js | v1.9.4 |
| **360° Panorama Engine** | Pannellum.js | v2.5.6 |

---

### 2. Environment Configuration (`backend/.env`)

```ini
# Supabase Configuration
SUPABASE_URL=https://nxmxaoaenyugcfjlyblq.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Express Server Port
PORT=5000

# Authentication JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

---

### 3. Server Operations & Maintenance

#### 3.1 Starting the Server
```bash
cd backend
npm start
```
Or for development with hot reloading:
```bash
cd backend
npm run dev
```

#### 3.2 Synchronizing Offline Static Fallback Data (`JS/data.js`)
If new buildings or flags are added in Supabase and you wish to update the static offline fallback file:
```bash
cd backend
node sync_data_js.js
```
This script queries Supabase and regenerates `JS/data.js` automatically.

---

### 4. Database Backup & Disaster Recovery

#### 4.1 Supabase Database Backup
- Database backups are automatically handled by Supabase PostgreSQL daily point-in-time recovery.
- Manual SQL export: Log into the Supabase Dashboard (`https://supabase.com/dashboard`), navigate to **Database** → **Backups**, and click **Download Backup**.

#### 4.2 Restoring Baseline Data
To re-seed the baseline 13 Dar es Salaam heritage buildings and tables:
```bash
cd backend
node migrate_and_seed.js
```

---

### 5. Troubleshooting & Frequently Asked Questions

| Symptom / Error | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Buildings load slowly or show fallback console warnings** | Backend Express server on port 5000 is not running. | Run `npm start` inside the `backend` directory. |
| **360° Panorama does not render** | Image URL is not equirectangular or is blocked by CORS. | Verify the image link is a direct equirectangular JPEG URL. |
| **Officer Portal login fails** | Token expired or invalid credentials. | Re-authenticate or reset user role in Supabase Auth console. |
| **Map markers do not display** | Invalid coordinates (`lat`/`lng`) or missing Leaflet CSS. | Ensure `lat` and `lng` are float numbers (e.g. `-6.816`, `39.289`). |
