# DriveSense — Full-Stack Automotive Intelligence Platform

<div align="center">

![DriveSense Mobile App](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-06b6d4?style=for-the-badge&logo=react)
![Expo SDK](https://img.shields.io/badge/Expo-SDK%2052-black?style=for-the-badge&logo=expo)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![Vercel Ready](https://img.shields.io/badge/Vercel-1--Click%20Deploy-000000?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

### [⬇️ Download DriveSense Mobile App (ZIP)](https://github.com/Souvik7661/CARX/raw/main/public/downloads/drivesense-mobile-app.zip) &nbsp;•&nbsp; [🚀 Deploy to Vercel](https://vercel.com/new/import?framework=nextjs&s=https%3A%2F%2Fgithub.com%2FSouvik7661%2FCARX)

*"Every Journey Tells a Story. Let's Keep It Alive."*

</div>

---

## 📱 1. DriveSense Mobile App (iOS & Android)

DriveSense is an automotive application built with **React Native**, **Expo SDK 52**, **Expo Router v4**, and tactile **Dark Neumorphism**, optimized for both **Apple iOS** (iPhone / iPad) and **Google Android**.

### 📦 Direct Download Links
- **GitHub Direct Download**: **[`drivesense-mobile-app.zip`](https://github.com/Souvik7661/CARX/raw/main/public/downloads/drivesense-mobile-app.zip)**
- **API Streaming Endpoint**: `GET /api/download-app` (available on your deployed Vercel domain or localhost)
- **Codebase Directory**: Explore the raw source code in the [`mobile/`](./mobile) directory.

---

## 🚀 2. The 8 Production Mobile Screens

| Screen | Title | Core Features |
|---|---|---|
| **1** | **Onboarding & Welcome** | *"Every Journey Tells a Story. Let's Keep It Alive."* Hero car crest vector emblem, value highlights, seamless entry. |
| **2** | **Mobile Cockpit / Home** | Concentric Neumorphic **92% Health Dial**, 3 stat insets (`28,450 km`, `18.6 km/l`, `Jan 2026`), 6 quick actions. |
| **3** | **My Car HUD** | 3D technical blueprint vector schematic with CAN-bus sensor nodes and 6 subsystem gauges (Engine, Brakes, Battery, Tires, Transmission, Electrical). |
| **4** | **12-Angle Visual Inspection** | 4 Zones: 360° Exterior (8 angles), Interior Cockpit, Engine Bay, Underbody. Computer vision defect scan simulation and PDF export. |
| **5** | **DriveSense AI Assistant** | Automotive diagnostic copilot with prompt chips (*"DTC P0420"*, *"30,000 km service cost"*, *"Battery voltage"*) and simulated voice mic input. |
| **6** | **Expenses & Fuel Log** | Monthly total `₹ 4,850` (`-8% vs last month`), 6-month tactile bar chart (Sep–Feb), and 4-category cost breakdown. |
| **7** | **Track Drive Telemetry** | High-precision digital trip timer (`00:42:18`), GPS polyline route map, live speed, distance, fuel used, and economy. |
| **8** | **Emergency Mode (SOS)** | Pulsing red SOS button with dual glow rings, one-touch national emergency dialer (`112`), 24x7 Roadside Assistance dispatch with ETA. |

---

## ⚡ 3. iOS & Android Optimizations

The mobile application has been tailored with platform-specific optimizations for both operating systems:

### 🍎 iOS (iPhone & iPad)
- **Taptic Engine Feedback**: Integrated `expo-haptics` with distinct haptic patterns for light UI navigation, medium inspection confirmations, and heavy warning alerts on emergency SOS.
- **Dynamic Island & Notch Safe Areas**: Dynamic insets via `react-native-safe-area-context` ensuring zero clipping on modern iPhone models (iPhone 12 through 16 Pro Max).
- **Smooth Retina Neumorphic Shadows**: Multi-layered shadow radius, opacity, and offsets configured specifically for Apple CoreGraphics rendering.
- **Privacy & Permissions (`infoPlist`)**: Pre-configured permission descriptions for `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`, and `NSPhotoLibraryUsageDescription`.

### 🤖 Android (Smartphones & Tablets)
- **Hardware-Accelerated Elevation**: Fine-tuned `elevation` and ambient shadow tokens for Android's Material RenderThread, ensuring soft neumorphic depth on AMOLED and LCD screens.
- **Android Navigation Bar Integration**: Automatic dark translucent navigation bar (`androidNavigationBar: { barStyle: "light-content", backgroundColor: "#090d16" }`).
- **Software Keyboard Management**: Configured `softwareKeyboardLayoutMode: "pan"` in `app.json` preventing keyboard overlapping on chat and expense forms.
- **Vibration Fallback & Permissions**: `android.permission.VIBRATE`, `ACCESS_FINE_LOCATION`, and `CAMERA` declared in manifest.
- **Direct Sideloading APK Support**: Configured EAS Build profile producing a standalone `.apk` installable on any Android device without Google Play Developer console.

---

## 🛠️ 4. Quickstart: Running the Mobile App

### Option A: From Extracted Codebase
```bash
# 1. Navigate to the mobile directory
cd mobile

# 2. Install dependencies
npm install

# 3. Start Expo development server
npx expo start
```
- Press **`i`** to open the **iOS Simulator** (macOS).
- Press **`a`** to open the **Android Emulator**.
- Or scan the QR code using the **Expo Go** app on your physical iPhone or Android device!

### Option B: Compiling Standalone Binaries (EAS Build)
The project includes a ready-to-use [`mobile/eas.json`](./mobile/eas.json) configuration:

```bash
# Build standalone Android APK (direct download & sideload)
npx eas-cli build -p android --profile preview

# Build standalone iOS IPA (internal testing or simulator)
npx eas-cli build -p ios --profile preview
```

---

## 🌐 5. Web Platform & Serverless Architecture

The repository is built as a unified full-stack **Next.js 16 (Turbopack)** application:
- **Repository Root**: Next.js lives directly at the repository root, allowing instant 1-click Vercel deployment.
- **Interactive Mobile Simulator**: Built-in phone viewport on `/` with Lenis smooth scrolling and instant view switching (**Desktop Cockpit ↔ Mobile App Simulator**).
- **Native Serverless API Routes (`src/app/api/`)**:
  - `GET /api/health` — System health and status
  - `GET/POST /api/vehicles` & `GET/PUT /api/vehicles/[id]` — Vehicle catalog CRUD
  - `GET/POST /api/vehicles/[id]/valuation` — Algorithmic valuation engine
  - `GET/POST /api/vehicles/[id]/ownership-cost` — 5-Year total cost of ownership
  - `GET/POST /api/vehicles/[id]/score` — Vehicle risk and trust scoring
  - `GET /api/vehicles/[id]/service-records` — Maintenance timeline
  - `GET /api/vehicles/[id]/mileage` — Odometer analysis and rollback check
  - `POST /api/compare` — Multi-vehicle comparison
  - `GET /api/dealer/stats` — Dealer analytics
  - `GET/PUT /api/admin/weights` — Admin risk scoring weights
  - `GET /api/download-app` — Streams the latest mobile app zip archive

---

## 🚀 6. Deploying to Vercel (1-Click)

1. Open [vercel.com/new](https://vercel.com/new).
2. Select your repository: **`Souvik7661/CARX`**.
3. Framework Preset: **`Next.js`** (Root Directory: `./`).
4. Click **Deploy**. Vercel will build and deploy the entire platform globally in ~60 seconds with zero environment variable configuration required!

---

## 📂 7. Repository Structure

```
CARX/
├── package.json              # Full-stack Next.js 16 app configuration
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # Root TypeScript configuration
├── vercel.json               # Vercel deployment manifest
├── src/
│   ├── app/
│   │   ├── page.tsx          # Master DriveSense Cockpit & Mobile App Switcher
│   │   ├── layout.tsx        # App layout with Lenis smooth scroll provider
│   │   ├── globals.css       # Tactile Neumorphism CSS tokens
│   │   └── api/              # Native Serverless Route Handlers
│   │       ├── download-app/ # Mobile App ZIP download endpoint
│   │       ├── health/       # Health check
│   │       ├── vehicles/     # Vehicle catalog & calculations
│   │       ├── compare/      # Vehicle comparison
│   │       └── dealer/       # Dealer stats
│   ├── components/
│   │   └── drivesense/       # Neumorphic components & MobileAppSuite simulator
│   └── lib/
│       ├── api.ts            # Relative /api fetch client
│       ├── server-store.ts   # Serverless in-memory data store
│       └── types.ts          # Core entity definitions
├── public/
│   └── downloads/
│       └── drivesense-mobile-app.zip  # Compiled Mobile App Archive
├── mobile/                   # Standalone Expo / React Native project
│   ├── app/                  # Expo Router v4 screens (All 8 screens)
│   ├── src/                  # Theme, SQLite db.ts, haptics.ts, types
│   ├── eas.json              # Android APK & iOS IPA build profiles
│   ├── app.json              # Permissions, icons, and bundle identifiers
│   └── package.json          # Expo SDK 52 dependencies
└── python-backend/           # Preserved standalone FastAPI backend
```

---

## 📜 8. License

This project is licensed under the MIT License.
