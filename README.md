# Resistance Band Weight Calculator 🏋️

A polished, production-ready single-page web application that calculates all possible resistance band weight combinations and helps users quickly determine which bands to use for their target weight.

## Features

### 🧮 Calculator Tab
- **Instant calculation** — type a target weight and get the closest band combination in real-time
- **Smart tie-breaking** — prefers fewer bands, then lower total weight
- **Visual band display** — colored band strips with emoji indicators
- **Copy to clipboard** — one-click copy of results

### 📊 All Combinations Tab
- **Complete table** — every achievable weight up to 45 kg with all combinations
- **Search & filter** — find specific weights instantly
- **Sort controls** — ascending/descending weight order
- **CSV export** — download all data for offline use
- **Statistics dashboard** — unique weights, total combinations, highest achievable weight

### 🎨 Design
- Dark mode fitness-themed UI
- Glassmorphism cards with backdrop blur
- Smooth micro-animations
- Fully responsive (mobile + desktop)
- Modern typography with Inter font

## Tech Stack

| Technology   | Purpose              |
| ------------ | -------------------- |
| React 19     | UI framework         |
| TypeScript   | Type safety          |
| Vite 8       | Build tool           |
| Tailwind CSS 4 | Styling            |

## Band Reference

| Color  | Weight (kg) | Emoji |
| ------ | ----------- | ----- |
| Yellow | 4.5         | 🟨    |
| Green  | 6.8         | 🟩    |
| Red    | 9.0         | 🟥    |
| Blue   | 11.3        | 🟦    |
| Black  | 13.6        | ⬛    |

Each band color can be used **multiple times** in a combination.

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/resistance-buddy.git
cd resistance-buddy

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/resistance-buddy/`

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deploying to GitHub Pages

This project includes a GitHub Actions workflow for automatic deployment.

### Setup

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Push to the `main` branch — the workflow will build and deploy automatically.

Your app will be live at:
```
https://YOUR_USERNAME.github.io/resistance-buddy/
```

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
# Upload the contents of dist/ to your hosting provider
```

## Project Structure

```
resistance-buddy/
├── public/
│   └── favicon.svg           # App favicon
├── src/
│   ├── components/
│   │   ├── Header.tsx        # App header & tab navigation
│   │   ├── BandStrip.tsx     # Band badge/strip component
│   │   ├── CalculatorTab.tsx # Calculator feature
│   │   └── CombinationsTab.tsx # All combinations table
│   ├── hooks/
│   │   ├── useCombinations.ts # Memoized combination generation
│   │   └── useClipboard.ts    # Clipboard copy hook
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── index.css             # Design system & styles
│   ├── types.ts              # TypeScript types
│   ├── constants.ts          # Band data & constants
│   └── engine.ts             # Combination algorithm
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## Algorithm

The combination engine uses a **recursive generator with repetition** to produce all valid band combinations:

1. **Generation** — Explores all combinations where each band color can repeat, up to the 45 kg limit
2. **Deduplication** — Uses sorted band arrays and a hash set to avoid duplicates
3. **Grouping** — Aggregates combinations by total weight
4. **Matching** — Binary-style scan to find the closest weight with smart tie-breaking

All combinations are generated once at startup and cached in memory for instant lookups.

## License

MIT
