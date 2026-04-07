# BenchMark — Shop Floor Production Tracker

Built for Europa Cabinets. Tracks production jobs from CNC to delivery, and manages custom craftsman specialty builds.

## Stack
- React Native + Expo (~52)
- React Navigation (bottom tabs)
- Local state (Phase 1) → Supabase (Phase 2)

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone (iOS or Android).

## Project Structure

```
benchmark/
├── App.js
├── src/
│   ├── navigation/
│   │   └── TabNavigator.js       # Bottom tab nav (Dashboard, Production, Craftsman, Team)
│   ├── screens/
│   │   ├── DashboardScreen.js    # At-a-glance view — stats, flags, active jobs
│   │   ├── ProductionScreen.js   # CNC → QC pipeline with flag + advance controls
│   │   ├── CraftsmanScreen.js    # Free-form specialty build tracker
│   │   └── TeamScreen.js         # Crew members, roles, workload
│   ├── components/
│   │   ├── Badge.js              # Status badge (in progress / blocked / done / etc.)
│   │   └── JobCard.js            # Reusable job card with stage pips
│   ├── data/
│   │   └── mockData.js           # Jobs, builds, team members, pipeline stages
│   └── theme/
│       └── colors.js             # Full color system
```

## Current Features (Phase 1)
- 4-tab navigation shell
- Dashboard with live stats, flags, and due-today jobs
- Production pipeline — all 7 stages, advance jobs, flag with notes
- Craftsman tab — create/edit/delete custom specialty builds with free-form fields
- Team view with online/offline status

## Up Next (Phase 2)
- Supabase backend + real-time sync
- Auth (crew member logins)
- Push notifications for flags
- Photo attachments on craftsman builds
- Time logging / shift tracking
