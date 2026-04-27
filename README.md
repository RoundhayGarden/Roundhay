# Roundhay

A modern movie and TV series discovery app built with React. Browse trending content, search for films and shows, manage a personal wishlist, and enjoy a smooth experience across all screen sizes.

**Live demo:** [roundhaygarden.github.io/Roundhay](https://roundhaygarden.github.io/Roundhay)

---

## Features

- **Browse** movies and TV series by category — Trending, Popular, Top Rated, Now Playing, Upcoming, Airing Today, On The Air
- **Search** across movies and TV shows with debounced input and infinite scroll
- **Wishlist** — save your favourite titles, persisted to Retool DB and synced on every login
- **Authentication** — sign up and sign in with your own credentials via Retool API
- **Collection page** — view your full wishlist enriched with TMDB poster and rating data
- **Dark / Light theme** toggle persisted across sessions
- **Responsive** — mobile, tablet, desktop and TV layouts
- **Protected routes** — wishlist and collection require authentication; unauthenticated users are redirected to sign in with a toast message

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM v7 |
| State management | Zustand 5 (with `persist` middleware) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Movie data | TMDB API |
| User & wishlist DB | Retool REST API |
| Notifications | React Toastify |
| Carousel | Swiper |
| Icons | Lucide React + Hugeicons |
| Deployment | GitHub Pages via `gh-pages` |

---

## Project Structure

```
Roundhay/
├── src/
instances and helpers
│   ├── components/
│   │   ├── auth/
│   │   │   ├── RegisterWell.jsx  # Auth page layout (responsive animated shell)
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── discovery/
│   │   │   └── SectionSlider.jsx
│   │   ├── ui/                   # shadcn/ui primitives
│   │   └── Navbar.jsx
│   ├── hooks/
│   │   └── useWishlistToggle.js  # Auth-aware heart button hook
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── Series.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── SeriesDetails.jsx
│   │   ├── Collection.jsx
│   │   ├── SearchResults.jsx
│   │   └── NotFound.jsx
│   ├── router/
│   │   └── router.jsx            # Hash router with RequireAuth guard
│   ├── store/
│   │   └── useAppStore.js        # Zustand store — theme, wishlist, search history
│   └── main.jsx
├── services/
│   └── tmdb.js                   # Legacy TMDB axios 
│   └── seriesApi.js              # TMDB + Retool axios 
instance (movies)
├── .env                          # Environment variables (see below)
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/RoundhayGarden/Roundhay.git
cd Roundhay
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

---

## Authentication

Roundhay uses **Retool REST API** as a lightweight backend for user accounts and wishlists. No TMDB account is required — users register directly in the app.

---

## Deployment

The app is deployed to GitHub Pages using the `gh-pages` package.

```bash
npm run deploy
```

This runs `npm run build` first (via `predeploy`), then publishes the `dist/` folder to the `gh-pages` branch.

