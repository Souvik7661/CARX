# DriveSense Mobile App (React Native & Expo)

Production-grade, offline-first mobile companion for DriveSense built with React Native, Expo SDK 52, Expo Router v4, and offline SQLite database.

## Features (8 Screens Implemented)

1. **Onboarding & Welcome** (`app/onboarding.tsx`):
   - *"Every Journey Tells a Story. Let's Keep It Alive."*
   - Vector vehicle crest emblem (no stock car photos).
   - Step-by-step feature introduction.

2. **Mobile Home / Cockpit** (`app/(tabs)/index.tsx`):
   - Central Neumorphic Health Dial (92% Health score).
   - Key stats: `28,450 km` odometer, `18.6 km/l` mileage, `Jan 2026` next service.
   - 6 tactile quick actions (Smart Upkeep, AI Assistant, Expenses, Reminders, Live Sensors, Documents).

3. **My Car HUD** (`app/(tabs)/my-car.tsx`):
   - 3D technical blueprint vector schematic.
   - 6 real-time subsystem health status gauges (Engine 94%, Brakes 88%, Battery 96%, Tires 91%, Transmission 95%, Electrical 98%).

4. **12-Angle Visual Inspection** (`app/inspection.tsx`):
   - 4 Inspection zones: 360° Exterior (8 angles), Interior Cockpit, Engine Bay, Underbody.
   - Computer vision defect scanner simulation & damage flagging.
   - Safety warnings & inspection report PDF export.

5. **DriveSense AI Assistant** (`app/ai-assistant.tsx`):
   - Automotive diagnostic AI chat copilot.
   - Quick prompt chips (DTC P0420, 30,000 km service cost, battery voltage, temperature).
   - Voice microphone input simulation.

6. **Expenses & Fuel Log** (`app/expenses.tsx`):
   - Current month total: `₹ 4,850`.
   - 6-month tactile bar chart (Sep–Feb).
   - Category breakdown: Fuel (64%), Service (22%), Fastag & Tolls (10%), Misc (4%).

7. **Track Drive Telemetry** (`app/(tabs)/drive.tsx`):
   - High-precision digital trip timer (`00:42:18`).
   - Real-time GPS coordinate polyline route tracking.
   - Distance (14.8 km), avg speed (42 km/h), fuel burned (0.8 L), economy (18.5 km/l).

8. **Emergency SOS Mode** (`app/emergency.tsx`):
   - High-contrast pulsing SOS red button.
   - One-touch emergency dialer for national helpline `112`.
   - 24x7 Roadside Assistance (Flat Tyre, Battery Jumpstart, Flatbed Towing).
   - Live GPS coordinate broadcast.

---

## Architecture & Offline Database

- **Framework**: Expo SDK 52 + Expo Router v4
- **Styling**: Tactile Dark Neumorphism with custom inset and elevated shadow tokens (`src/theme/neumorphic.ts`)
- **Offline Storage**: SQLite (`src/services/db.ts`) tables for:
  - `vehicles`
  - `inspection_checkpoints`
  - `expenses`
  - `drive_logs`

---

## Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start

# 3. Press 'i' for iOS Simulator or 'a' for Android Emulator
# or scan the QR code with the Expo Go app on your physical device.
```

## Production Builds (EAS Build)

```bash
# Build Android APK / AAB
npx eas build --platform android --profile preview

# Build iOS IPA
npx eas build --platform ios --profile preview
```
