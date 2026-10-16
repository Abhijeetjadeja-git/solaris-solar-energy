# Solaris — Autonomous Solar Energy Scrollytelling Landing Page

A high-performance, cinematic scroll-driven landing page for **Solaris**, a renewable solar power company. Built with HTML5 Canvas, modern Vanilla JavaScript, custom CSS3 glassmorphism, and Tailwind CSS. The experience seamlessly choreographs 300 ultra-high-definition video frames with responsive UI components inspired by high-end design systems.

---

## 1. Project Title
**Solaris Solar Energy — Interactive Scrollytelling Web Experience**

---

## 2. Project Overview and Purpose
Solaris delivers commercial and residential solar solutions with next-generation photovoltaic technology. The purpose of this website is to provide an immersive, Apple/Tesla-tier product storytelling journey where the user's scroll directly scrubs a cinematic 300-frame aerial drone inspection of a modern solar farm, while interactive glassmorphic cards highlight technological features, customer savings, technical specifications, and return on investment.

---

## 3. Key Features Actually Implemented
- **300-Frame Canvas Scrubber**: Fluid, GPU-accelerated canvas scrubbing mapped directly to document scroll position with sub-pixel interpolation (`lerpFactor = 0.16`) and `requestAnimationFrame`.
- **Live Flight Telemetry HUD**: Floating glassmorphic HUD pill tracking camera progress (`FRAME 001` through `FRAME 300`) with dynamic hardware telemetry (Dual-Axis Absorption, 32° Sun-tracking angle, 99.4% conversion efficiency, zero-carbon lifecycle).
- **Hero Presentation**: Bold headline (*"Clean Energy that Pays for Itself"*), value propositions, three checkmark feature indicators, on-site solar engineering photography, and a floating glass preview badge (*"How Solar Cuts Your Bills"*).
- **Core Engineering Features**: 4 frosted glass cards highlighting High Efficiency Photovoltaic Cells, Energy Storage Ready, Smart Inverter Tech, and Eco-Friendly Materials.
- **Latest Innovation Product Lineup**: 6 solar hardware cards (Bifacial 550W, Industrial Tier-1 Array, Aurora Smart Inverter, SafeVault 15kWh LiFePO4 battery, Pure Black 430W, and Cloud IoT Hub) with category filter pills.
- **About Us & Metric Cards**: 4 animated metric tiles (98% Customer Satisfaction, 40% Faster Installation, 60% Lower Energy Costs, 25 Years System Lifespan).
- **Interactive 4-Step Process ("Turning Sunlight into Savings")**: Interactive accordion step switcher (1. Discover Potential, 2. Tailored Blueprints, 3. Turnkey Installation, 4. Grid Activation) paired with high-resolution solar technician photography.
- **Interactive ROI & Solar Savings Calculator**: Real-time slider ($50 – $600/mo) calculating 25-year net savings, recommended system kW, estimated payback period, and tons of CO₂ offset.
- **Consultation Booking Form**: Consultation inquiry form with property type selection and message fields.
- **Zero-Latency In-Memory Dev Server**: Zero-dependency Node.js HTTP server pre-loading all 302 image frames into RAM for instantaneous 0ms local response.
- **100% Local Media Assets**: All images and animation frames are hosted locally within the project, ensuring zero external 404 network errors or third-party downtime.

---

## 4. Technologies and Programming Languages
- **Markup**: Semantic HTML5 with accessibility considerations (`<canvas>`, `<header>`, `<section>`, `<nav>`, `<footer>`).
- **Styling**: Modern CSS3 (Glassmorphism, `backdrop-filter`, radial vignettes, CSS variables) + Tailwind CSS utility engine.
- **Logic**: Vanilla ES6+ JavaScript (HTML5 Canvas 2D Context, `IntersectionObserver`, `requestAnimationFrame`, touch/wheel/scroll listeners).
- **Fonts**: Plus Jakarta Sans (loaded via Google Fonts with system fallback stack).
- **Backend / Dev Server**: Node.js core modules (`http`, `fs`, `path`, `url`) with zero external npm dependencies.

---

## 5. AI Website Builder and Development Tools Used
- **Google Antigravity IDE**: AI-assisted software engineering, codebase auditing, and automated verification environment.
- **Node.js**: Server-side runtime (v24.x) for local development server and asset validation scripts.
- **PowerShell / Windows Shell**: Local system automation and archive extraction.

---

## 6. Design, Animation, Image-Generation, and Editing Tools Used
- **Dribbble Design Reference**: *Solaris Solar Energy Landing Page* by Vektora Web, *Sunora AI*, and *EcoVera*.
- **Imagen 3 Image Generation**: Generated custom high-resolution commercial solar photography ([`hero_engineers.jpg`](./images/hero_engineers.jpg) and [`savings_technician.jpg`](./images/savings_technician.jpg)) matching the Dribbble aesthetic.
- **Video Extraction & Optimization**: 30fps high-quality 1280x720 JPEG frame extraction (`solar_video_frames_30fps_high_quality_jpg.zip`) mapped to canvas drawing.

---

## 7. Project Directory Structure
```text
solar-power/
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules for node_modules, zips, OS files
├── README.md               # Complete project documentation
├── package.json            # Project manifest, metadata, and npm scripts
├── vercel.json             # Vercel CDN deployment & caching configuration
├── index.html              # Main application entry point & component markup
├── style.css               # Core styling, glassmorphism, animations & scrollbar
├── app.js                  # Canvas engine, scrollytelling scrubber, calculator logic
├── server.js               # Zero-dependency local development HTTP server with RAM cache
├── images/                 # Local high-resolution hero & feature photos
│   ├── hero_engineers.jpg
│   └── savings_technician.jpg
└── frames/                 # 300 sequential animation frames (frame_000001.jpg to frame_000300.jpg)
```

---

## 8. Installation Prerequisites
- **Node.js**: Version 18.0.0 or higher ([Download Node.js](https://nodejs.org/)).
- **Web Browser**: Any modern evergreen browser supporting HTML5 Canvas (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- **Git** (optional): For version control and GitHub publishing ([Download Git](https://git-scm.com/)).

---

## 9. Instructions for Cloning the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd solar-power
```

---

## 10. Dependency Installation Instructions
This project uses native browser APIs and zero-dependency Node.js standard libraries. To initialize:
```bash
npm install
```
*(No external runtime packages are required; all dev and serving operations rely directly on Node standard library).*

---

## 11. Instructions for Running the Website Locally
To start the high-speed local development server:
```bash
npm start
# OR
npm run dev
# OR directly:
node server.js
```
Then open your web browser at:
👉 **`http://localhost:3000`**

---

## 12. Production Build Instructions
Since this is an optimized static web application, no transpilation step is required. To verify the build:
```bash
npm run build
```
The deployable output directory is the **project root** (`./`), containing `index.html`, `style.css`, `app.js`, `frames/`, and `images/`.

---

## 13. Environment Variable Setup
Refer to `.env.example`:
```bash
# Optional port configuration for local server
PORT=3000
```
No private API keys or database connection strings are needed for deployment.

---

## 14. Deployment Instructions for Vercel
Deploying to Vercel takes under 2 minutes:

### Option A: Via GitHub (Recommended)
1. Push your repository to GitHub.
2. Visit [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
3. Import your GitHub repository.
4. In the configuration modal:
   - **Framework Preset**: Select **"Other"**.
   - **Root Directory**: `./` (default).
   - **Build Command**: Leave default or `npm run build`.
   - **Output Directory**: Leave empty / `./` (root).
5. Click **"Deploy"**.
6. The included `vercel.json` will automatically configure edge caching headers (`Cache-Control: public, max-age=31536000, immutable`) for all 300 animation frames and imagery.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 15. Troubleshooting Instructions
- **Port 3000 already in use**: `server.js` automatically detects busy ports and increments to `3001`, `3002`, etc. You can also specify `PORT=8080 node server.js`.
- **Canvas appears black or frames don't scrub**: Ensure you are serving the site via HTTP (`http://localhost:3000` or Vercel) and not inspecting restricted browser protocols.
- **Scroll feeling fast or slow**: In `style.css`, modify the virtual scroll distance on `.content-wrapper` or adjust `lerpFactor` in `app.js` (default: `0.16`).

---

## 16. GitHub Repository URL Placeholder
GitHub Repository: Pending repository creation.

---

## 17. Live Website URL Placeholder
Live Website: Pending Vercel deployment.

---

## 18. License
All rights reserved. Proprietary software. No reuse rights, redistribution, or modification granted without explicit written authorization from the repository owner.
