# Movie Discovery App

A modern React Native mobile application for discovering movies, managing watchlists, and sharing reviews. Built with Redux Toolkit, React Navigation, and the TMDB API.

## Features

- 🎬 Discover trending movies
- 📝 Create and manage personal watchlists
- ⭐ Write and view community reviews
- 📊 Profile statistics and genre preferences
- 🌓 Dark/Light theme support
- 🔐 User authentication (registration and login)

## Setup Instructions

### Prerequisites

- Node.js >= 20
- React Native development environment configured
- Android Studio (for Android) or Xcode (for iOS)
- TMDB API key (already included in the project)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

4. Run the application:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

### Environment Configuration

The TMDB API credentials are pre-configured in `src/utils/config.js`. No additional setup required.

## Libraries Used

### Core Libraries
- **react**: 19.1.1 - UI library
- **react-native**: 0.82.1 - Mobile framework
- **react-redux**: 9.2.0 - State management bindings
- **@reduxjs/toolkit**: 2.10.1 - Redux state management

### Navigation
- **@react-navigation/native**: 7.x - Navigation framework
- **@react-navigation/bottom-tabs**: 7.8.5 - Bottom tab navigation
- **@react-navigation/native-stack**: 7.6.3 - Stack navigation
- **react-native-screens**: 4.18.0 - Native navigation optimization
- **react-native-safe-area-context**: 5.6.2 - Safe area handling

### UI & Animations
- **react-native-reanimated**: 4.1.5 - Smooth animations
- **react-native-gesture-handler**: 2.29.1 - Touch gesture handling
- **react-native-linear-gradient**: 2.8.3 - Gradient backgrounds
- **react-native-svg**: 15.15.0 - SVG icon support
- **lottie-react-native**: 7.3.4 - Lottie animations
- **nativewind**: 4.2.1 - Tailwind CSS for React Native

### Data & Storage
- **@react-native-async-storage/async-storage**: 2.2.0 - Local data persistence
- **axios**: 1.13.2 - HTTP client for API requests

### Forms & Validation
- **formik**: 2.4.9 - Form management
- **yup**: 1.7.1 - Schema validation

## Architecture

### Project Structure

```
src/
├── assets/          # Images and animations
├── components/      # Reusable UI components
├── navigation/      # Navigation configuration
│   ├── auth/       # Authentication flows
│   └── main/       # Main app navigation
├── screens/        # Screen components
│   └── auth/       # Auth screens (Login, Register)
├── store/          # Redux state management
│   ├── index.js    # Store configuration
│   ├── authSlice.js
│   ├── watchlistSlice.js
│   ├── reviewSlice.js
│   └── themeSlice.js
├── types/          # Type definitions
└── utils/          # Utility functions and config
```

### State Management

The app uses **Redux Toolkit** with four main slices:

1. **authSlice**: User authentication state
   - Handles login, logout, and session persistence
   - Stores user credentials locally

2. **watchlistSlice**: Movie watchlist management
   - Add/remove movies from watchlist
   - Persists watchlist to AsyncStorage
   - Loads watchlist on app start

3. **reviewSlice**: Community reviews
   - User-submitted movie reviews
   - Organized by movie ID

4. **themeSlice**: Theme management
   - Dark/Light mode toggle
   - Persists theme preference
   - Dynamic color schemes

### Navigation Flow

```
RootNavigator
├── Auth Stack (when not logged in)
│   ├── LoginScreen
│   └── RegisterScreen
└── Main Tabs (when logged in)
    ├── DiscoverScreen (Trending movies)
    ├── WatchlistScreen (Saved movies)
    ├── ProfileScreen (Stats & settings)
    └── MovieDetailScreen (Modal)
```

### Data Flow

1. **Authentication**: Local storage-based auth system using AsyncStorage
2. **Movie Data**: Fetched from TMDB API (`https://api.themoviedb.org/3/`)
3. **Watchlist**: Stored locally in AsyncStorage, synced with Redux
4. **Reviews**: Stored in Redux state (in-memory)
5. **Theme**: Persisted in AsyncStorage, loaded on startup

### Key Features Implementation

**Discover Screen:**
- Fetches trending movies from TMDB API
- Implements pull-to-refresh
- Grid layout with animated movie cards

**Watchlist:**
- Swipeable list items for deletion
- Persistent storage across sessions
- Empty state with Lottie animation

**Profile:**
- Aggregated statistics (total movies, avg rating, watch time)
- Genre preference visualization with custom SVG bar chart
- Theme toggle switch

**Movie Details:**
- Animated poster with zoom effect
- Linear gradient overlay
- Community reviews section
- Bottom sheet for review submission

## Video Demo

https://drive.google.com/file/d/107fPfb34v12dXxG9_ezE_uEOQNnKaz3P/view

## Development Notes

- The app uses a local authentication system (no backend required)
- All user data is stored in AsyncStorage
- TMDB API is used for movie data only
- Review system is local and not synced across devices

