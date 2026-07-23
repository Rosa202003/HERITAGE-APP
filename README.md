# 🏛️ Urithi Majengo (Digital Heritage Inventory & Virtual Tour System)

> **Urithi Majengo** (*Swahili for "Heritage Buildings"*) is a georeferenced digital inventory, 360° virtual tour, and community preservation system for historical heritage buildings in Dar es Salaam, Tanzania.

---

## 📋 Table of Contents
1. [About the Project](#-about-the-project)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Database Schema](#-database-schema)
6. [Folder Structure](#-folder-structure)
7. [Installation & Setup](#-installation--setup)
8. [API Endpoints](#-api-endpoints)
9. [User Roles & Access](#-user-roles--access)
10. [License](#-license)

---

## 🌟 About the Project

Tanzania's coastal heritage buildings—ranging from 19th-century German and British colonial structures to Swahili architectural landmarks—face risks from urban redevelopment, environmental decay, and lack of public awareness.

**Urithi Majengo** bridges the gap between the **Antiquities Department**, **Urban Historians**, and **Citizens** by providing:
* **Digital Preservation**: A central georeferenced database storing historic building attributes, architects, eras, structural conditions, and coordinates.
* **Immersive Virtual Exploration**: Interactive 360° equirectangular panoramic views (Pannellum.js) enabling remote exploration.
* **Citizen Participation**: Real-time crowd-sourced risk reporting (*Report At-Risk*) and community reviews.
* **Officer Decision Portal**: Real-time management dashboard with live metrics, automatic building code generation, and flag status resolution workflows.

---

## ✨ Key Features

### 🌐 Public & Visitor Features
* **Interactive Georeferenced Map**: Built using Leaflet.js with custom markers and popup building summary cards.
* **Building Inventory Directory**: Search and filter structures by name, district, era (*German Colonial, British Colonial, Swahili, Independence*), condition, or protection status (*Grade I Listed*).
* **360° Virtual Tours**: Panoramic view tab powered by Pannellum.js with drag-to-look, scroll-to-zoom, and auto-rotation.
* **Media & Video Library**: Integrated modal lightbox for viewing aerial heritage videos and documentaries.

### 👥 Registered Citizen Features
* **Community Feedback & Reviews**: Rate buildings (1 to 5 stars) and write historical observations.
* **Report At-Risk Structures**: Flag buildings undergoing demolition threats or structural degradation with details and location context.

### 🛡️ Antiquities Officer Features
* **Real-Time Dashboard**: Auto-refreshes every 5 seconds displaying live inventory count, pending flag reports, total reviews, and Grade I listed sites.
* **Automatic Sequential Building Codes**: Automatically generates sequential keys (e.g. `DSH-001`, `DSH-002`, ..., `DSH-014`) whenever a new building is created.
* **Flexible Building Entry**: Supports building creation with safe defaults (only Building Name is mandatory, optional tour URLs and media default gracefully).
* **Flag Report Workflow**: Update citizen threat reports live (*Pending* → *Under Review* → *Resolved*).
* **Role & User Management**: Super Officers can promote citizens to Officers or modify user roles.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────┐
                               │     Web Browser Client      │
                               │  (Desktop & Mobile Browsers)│
                               └──────────────┬──────────────┘
                                              │ HTTP / JSON API
                                              ▼
                               ┌─────────────────────────────┐
                               │   Express.js Node Backend   │
                               │       (Port 5000)           │
                               └──────────────┬──────────────┘
                                              │ `@supabase/supabase-js`
                                              ▼
                               ┌─────────────────────────────┐
                               │  Supabase PostgreSQL DB     │
                               │   & Native JWT Auth         │
                               └─────────────────────────────┘
```

---

## 💻 Technology Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6) | Modular UI (`header.js`, `footer.js`, `layout.js`), CSS custom properties, dark mode glassmorphic styling |
| **Backend** | Node.js, Express.js | REST API endpoints, CORS handling, authentication middleware |
| **Database & Auth** | Supabase (PostgreSQL) | Native JWT authentication, Admin SDK user management, persistent relational tables |
| **Map Engine** | Leaflet.js | Georeferenced map visualization, custom marker popups, coordinates calculation |
| **360° Viewer** | Pannellum.js | Interactive 360° equirectangular panoramic image viewer |

---

## 🗄️ Database Schema

### `buildings` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt / PK | Auto-incrementing unique ID |
| `code` | Text | Sequential identifier (e.g. `DSH-001`) |
| `name` | Text | Building name (*Required*) |
| `era` | Text | Architectural era (*e.g., German Colonial*) |
| `year` | Integer | Year built |
| `condition` | Text | Structural condition (*Excellent, Good, Fair, Poor, At Risk*) |
| `status` | Text | Protection listing (*Listed, Grade I Listed, Grade II Listed*) |
| `location` | Text | District / Street address in Dar es Salaam |
| `architect` | Text | Historical architect |
| `ownership` | Text | Legal property ownership |
| `style` | Text | Architectural style (*Swahili, Neo-Gothic, Colonial*) |
| `inspected` | Date | Date of last inspection |
| `rating` | Numeric | Average citizen rating (0 to 5) |
| `image` | Text | Cover photo image URL |
| `description` | Text | Detailed historical summary |
| `significance` | Text | Historical & cultural significance statement |
| `tags` | Array / Text | Array of badges, media tags (`MEDIA:url`), and tour links (`TOUR:url`) |
| `lat` | Float | Latitude coordinate |
| `lng` | Float | Longitude coordinate |

### `flags` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt / PK | Flag report ID |
| `building_id` | Integer / FK | Associated building ID |
| `building_name` | Text | Building title |
| `reporter_name` | Text | Submitting citizen name |
| `reporter_email` | Text | Submitting citizen email |
| `risk_type` | Text | Risk category (*Demolition, Structural Decay, Vandalism*) |
| `description` | Text | Threat details |
| `status` | Text | Processing status (*pending, under_review, resolved*) |

### `reviews` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt / PK | Review ID |
| `building_id` | Integer / FK | Associated building ID |
| `building_name` | Text | Building title |
| `user_name` | Text | Author name |
| `user_email` | Text | Author email |
| `rating` | Integer | Rating stars (1-5) |
| `comment` | Text | Review feedback text |

---

## 📂 Folder Structure

```
HERITAGE APP/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── controllers/
│   │   ├── authController.js    # Register & Login logic
│   │   ├── buildingController.js# Buildings CRUD & auto-code generator
│   │   ├── flagController.js    # Threat reports CRUD
│   │   ├── officerController.js # Officer role management
│   │   ├── reviewController.js  # Building reviews CRUD
│   │   └── statsController.js   # Real-time summary metrics
│   ├── middleware/
│   │   └── auth.js              # Supabase JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── buildingRoutes.js
│   │   ├── flagRoutes.js
│   │   ├── officerRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── statsRoutes.js
│   ├── .env                     # Environment variables (Supabase keys & Port)
│   ├── server.js                # Main Express server entry point
│   └── migrate_and_seed.js      # DB initialization and seed script
├── HTML/
│   ├── index.html               # Main Map & Records Landing Page
│   ├── buildings.html           # Full Buildings Directory
│   ├── risk.html                # Report At-Risk Form
│   ├── community.html           # Reviews & Community Discussion
│   ├── officer.html             # Officer Portal & Real-time Dashboard
│   ├── login.html               # Officer / Citizen Sign In
│   └── signup.html              # Citizen Registration
├── JS/
│   ├── components/
│   │   ├── header.js            # Header component HTML template
│   │   └── footer.js            # Footer component HTML template
│   ├── api.js                   # API HTTP client with dynamic host resolution
│   ├── app.js                   # Main application UI logic & modal handlers
│   ├── data.js                  # Data constants & fallbacks
│   └── layout.js                # Global layout injector & hamburger menu listener
├── CSS/
│   └── style.css                # Core design system & responsive styling
└── README.md                    # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js**: v16.x or higher
* **npm**: v8.x or higher
* **Supabase Account**: (Project URL and Anon/Service Role Keys)

### 1. Clone & Install Dependencies
```bash
# Navigate to the project backend directory
cd backend

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Create or verify `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### 3. Seed Database (Optional)
```bash
node migrate_and_seed.js
```

### 4. Start the Express Backend
```bash
node server.js
```

Upon successful launch, the terminal displays:
```
==================================================
🚀 Urithi Majengo Server Running on Port 5000
👉 Open App in Browser:    http://localhost:5000/HTML/index.html
👉 Officer Portal:        http://localhost:5000/HTML/officer.html
👉 Live Server Compatible: Port 5500 auto-connects to http://localhost:5000/api
==================================================
```

---

## 🔗 API Endpoints

### 🏢 Buildings API
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/buildings` | Public | Get all buildings (supports search `?q=query`) |
| `GET` | `/api/buildings/:id` | Public | Get building details by ID |
| `POST` | `/api/buildings` | Officer | Create new building (auto-generates code `DSH-XXX`) |
| `PUT` | `/api/buildings/:id` | Officer | Update building details |
| `DELETE` | `/api/buildings/:id` | Officer | Delete building record |

### 🚩 Flag Reports API
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/flags` | Officer | Get all threat reports |
| `POST` | `/api/flags` | Public | Submit new risk report |
| `PUT` | `/api/flags/:id` | Officer | Update report status (*pending, under_review, resolved*) |

### 💬 Reviews API
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews` | Public | Get reviews (supports filtering by `?building_id=X`) |
| `POST` | `/api/reviews` | Citizen | Submit a review for a building |

### 📊 Stats API
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Public / Officer | Get real-time summary statistics for dashboard |

### 🔑 Auth API
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new citizen account (auto-confirmed) |
| `POST` | `/api/auth/login` | Public | Sign in and receive JWT token |

---

## 🔐 User Roles & Access

1. **Visitor**: Can view map, search buildings, launch 360° virtual tours, and submit risk reports.
2. **Citizen**: Can log in, submit reviews, rate buildings, and track reported flags.
3. **Officer**: Access to `officer.html` portal, real-time dashboard metrics, building inventory creation/editing, and flag status resolution.
4. **Super Officer**: Full administrative rights, including managing officer accounts.

---

## 📄 License
This project is licensed under the **MIT License**.
