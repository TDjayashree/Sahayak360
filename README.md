# 🏛️ SAHAYAK 360 - Smart Civic Grievance & Redressal Platform

> **A Full-Stack MERN Civic Governance System** empowering citizens to report municipal issues (Roads, Water Supply, Electricity, Sanitation, and Public Health) with automated department-wise routing, SLA tracking, document & photo uploads, notifications, and an executive administration dashboard.

---

## 🌟 Key Features

### 1. 👥 Citizen Portal
- **Grievance Registration Wizard**:
  - Interactive multi-step form with civic category selector.
  - Interactive **Ward & Map Pin Simulator** with auto-GPS location detection.
  - Urgency & hazard level selection (Low, Medium, High, Critical).
  - Drag-and-drop **photo & document uploader** with image previews (potholes, burst pipes, overflowing dumpsters).
- **Public & Citizen Status Tracking**:
  - Search any grievance instantly using unique tracking reference IDs (e.g., `SHK-2026-9041`).
  - High-fidelity **Status Stepper** (`Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved`).
  - Real-time timestamped **activity audit trail**.
  - **Citizen Satisfaction Rating**: Rate resolution quality from 1 to 5 stars with celebratory confetti feedback.

### 2. 🏢 Department-Wise Routing & Officer Operations
- Automated category-based routing to respective municipal departments:
  - 🛣️ **Roads & Infrastructure** (48h statutory SLA)
  - 💧 **Water Supply & Drainage** (24h statutory SLA)
  - ⚡ **Electricity & Streetlights** (12h statutory SLA)
  - 🗑️ **Sanitation & Solid Waste** (24h statutory SLA)
  - 🏥 **Public Health & Safety** (36h statutory SLA)
- **Officer Operations Desk**:
  - View department-specific queues, filter by priority and status.
  - Assign field engineers and inspection crews.
  - Update status (`In Progress`, `Resolved`) with internal notes.
  - Upload photographic **Resolution Proof** (e.g., repaired road, replaced pipe section).

### 3. 📊 Municipal Executive Admin Dashboard
- **Real-Time KPIs**: Total grievances, resolved count, resolution success rate, and average SLA turnaround.
- **Visual Analytics**:
  - Department workload and resolution performance progress bars.
  - Severity and priority distribution breakdown.
  - Top incident wards and SLA compliance indicators.
- **Master Grievance Register**:
  - Comprehensive searchable and filterable audit table.
  - Direct department re-routing override.
  - **1-Click CSV Export**: Download complete municipal audit reports.

### 4. 🔐 Segregated Citizen & Admin Authentication Modules
The system strictly separates citizen access from municipal administration:
- **Citizen Gateway** (`CitizenAuthModal.jsx`, `POST /api/auth/citizen/login`):
  - Accessible to public citizens to register with their name, mobile, and residential ward.
  - Strictly prevents administrative users from using the public citizen login form.
  - Pre-configured demo citizens: *Rahul Sharma* (`rahul@citizen.in`), *Ananya Iyer* (`ananya@citizen.in`).
- **Official Admin & Officer Gateway** (`AdminAuthModal.jsx`, `POST /api/auth/admin/login`):
  - Dedicated municipal terminal requiring official credentials and badge verification.
  - Strictly rejects standard citizens (HTTP 403 Forbidden).
  - Pre-configured personnel:
    - 🏛️ *Dr. Aruna Patel, IAS* (`commissioner@city.gov.in` / `admin123`)
    - 🛣️ *Er. Priya Deshmukh - Roads* (`priya.roads@city.gov.in` / `officer123`)
    - 💧 *Er. Amit Verma - Water* (`amit.water@city.gov.in` / `officer123`)
    - ⚡ *Er. Suresh Nair - Electricity* (`suresh.elec@city.gov.in` / `officer123`)
    - 🗑️ *Insp. Vikram Singh - Sanitation* (`vikram.clean@city.gov.in` / `officer123`)

---

## 🏗️ Architecture & Tech Stack

```
sahayak-new/
├── client/                     # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # Navbar, StatusStepper, ComplaintCard, ImageUploader, MapPinSimulator, Modals
│   │   ├── pages/              # HomePage, NewComplaintPage, CitizenDashboard, DepartmentPortal, AdminDashboard
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── services/           # api.js (Axios/Fetch wrapper)
│   │   ├── styles/             # index.css (Dark glassmorphism design system)
│   │   ├── App.jsx             # Root layout & modal controllers
│   │   └── main.jsx
│   └── vite.config.js          # Proxies /api and /uploads to port 5000
│
├── server/                     # Backend (Express.js + Node.js + Mongoose/Storage Engine)
│   ├── config/                 # db.js (MongoDB connector with graceful fallback)
│   ├── controllers/            # auth, complaint, department, analytics, notification
│   ├── middleware/             # auth.js (JWT), upload.js (Multer)
│   ├── models/                 # Complaint.js, User.js, Department.js, Notification.js
│   ├── routes/                 # Express API routes
│   ├── storage/                # storageAdapter.js (Unified high-performance storage)
│   ├── data/                   # seedData.js & db.json (Auto-persisted civic database)
│   ├── uploads/                # Static file uploads directory
│   └── server.js               # Express entrypoint (Port 5000)
│
└── package.json                # Single-command runner via concurrently
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- (Optional) Local MongoDB on `mongodb://localhost:27017/sahayak` *(Note: If MongoDB is not active, the system automatically uses its built-in persistent storage engine)*.

### Quick Start
```bash
# 1. Install root dependencies
npm install

# 2. Run both Backend API and Frontend Dev Server simultaneously
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Citizen** | Rahul Sharma | `rahul@citizen.in` | `citizen123` |
| **Roads Officer** | Er. Priya Deshmukh | `priya.roads@city.gov.in` | `officer123` |
| **Water Officer** | Er. Amit Verma | `amit.water@city.gov.in` | `officer123` |
| **Sanitation Officer** | Insp. Vikram Singh | `vikram.clean@city.gov.in` | `officer123` |
| **Commissioner (Admin)**| Dr. Aruna Patel, IAS | `commissioner@city.gov.in` | `admin123` |

*(Tip: You can also use the persona dropdown in the top-right navbar to switch instantly with a single click without typing passwords!)*
