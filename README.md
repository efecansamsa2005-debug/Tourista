# 🌍 Tourista - AI Travel Planner

A cross-platform mobile application that generates personalized travel itineraries based on user preferences and budget.

![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Expo](https://img.shields.io/badge/Expo-54.0-black)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Google Maps](https://img.shields.io/badge/Google%20Maps-API-red)

## ✨ Features

- **🗺️ AI-Powered Itineraries** - Generate personalized travel plans based on your preferences
- **📍 Interactive Maps** - Visualize routes with Google Maps integration
- **💰 Budget Planning** - Set your budget and get optimized recommendations
- **🏆 Gamification** - Earn XP, unlock ranks, and compete on leaderboards
- **⭐ Reviews & Ratings** - Rate and review places you've visited
- **🌙 Dark/Light Mode** - Beautiful UI in any lighting
- **🌐 Bilingual Support** - Available in Turkish and English
- **☁️ Cloud Sync** - Save your trips with Supabase backend

## 🎮 Gamification System

| Rank | XP Required | Icon |
|------|-------------|------|
| Newbie | 0 - 99 | 🌱 |
| Explorer | 100 - 499 | 🧭 |
| Traveler | 500 - 999 | ✈️ |
| Adventurer | 1000 - 2499 | 🏔️ |
| Globetrotter | 2500+ | 🌍 |

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo
- **Backend:** Supabase (PostgreSQL)
- **Maps:** Google Maps API, Google Places API
- **State Management:** React Hooks, AsyncStorage
- **UI:** Expo Linear Gradient, Expo Blur

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone
- Google Cloud account (for Maps API)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/efecansamsa2005-debug/tourista.git
   cd tourista
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_API_KEY=your_google_api_key
   ```

4. **Run the app**
   ```bash
   npx expo start
   ```

5. **Scan the QR code** with Expo Go app

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `EXPO_PUBLIC_GOOGLE_API_KEY` | Google Maps/Places API key |

## 🏙️ Supported Cities

- 🇹🇷 Istanbul
- 🇫🇷 Paris
- 🇯🇵 Tokyo
- 🇺🇸 New York
- 🇬🇧 London
- 🇮🇹 Rome
- 🇪🇸 Barcelona
- 🇦🇪 Dubai

## 📱 Screenshots

*Coming soon*

## 📄 License

This project is for educational purposes.

## 👤 Author

**Efe Can Samsa**
- GitHub: [@efecansamsa2005-debug](https://github.com/efecansamsa2005-debug)
- LinkedIn: [Efe Can Samsa](https://www.linkedin.com/in/efe-can-samsa-376287371/)
