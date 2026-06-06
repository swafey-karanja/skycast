# Skycast 🌦️

A clean, responsive weather app built with React and Vite, powered by the [weather-ai.co](https://api.weather-ai.co) API. Skycast displays current conditions, hourly and daily forecasts, and an AI-generated weather summary — all in a polished dark UI.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-teal)

---

## Features

- **Current conditions** — temperature, wind, humidity, UV index, and an AI-generated summary
- **Hourly forecast** — horizontally scrollable strip for the next 24 hours
- **Daily forecast** — multi-day outlook with min/max temperature range bars
- **Tab navigation** — jump directly to Current, Hourly, or Daily views
- **API usage card** — live view of billing period, request count, and plan limits
- **Skeleton loading states** and graceful error handling with a retry button

---

## Tech stack

| Layer        | Library / Tool         |
| ------------ | ---------------------- |
| UI framework | React 18               |
| Build tool   | Vite 5                 |
| Styling      | Tailwind CSS 3         |
| HTTP         | Native `fetch`         |
| Weather data | weather-ai.co REST API |

---

## Project structure

```
skycast/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json               # Vercel rewrites — routes /api/* to the upstream
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component — owns tab/day/unit state, wires all components
    ├── index.css             # Tailwind directives + global utilities
    ├── services/
    │   └── weatherService.js # All API call logic; always calls /api/*
    ├── hooks/
    │   ├── useWeather.js     # Fetches full weather payload
    │   └── useUsage.js       # Fetches API billing & plan limits
    ├── utils/
    │   └── weather.js        # WMO code helpers, formatters, colour utils
    └── components/
        ├── WeatherHeader.jsx
        ├── CurrentWeatherCard.jsx
        ├── HourlyForecastCard.jsx
        ├── DailyForecastCard.jsx
        └── UsageCard.jsx
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **weather-ai.co API token** — sign up at [weather-ai.co](https://weather-ai.co)

---

## Local setup

```bash
git clone <your-repo-url>
cd skycast
npm install
```

Create `.env.development` in the project root:

```env
VITE_WEATHER_API_TOKEN=your_api_token_here
VITE_WEATHER_API_BASE_URL=https://api.weather-ai.co/v1
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev proxy forwards `/api/*` to the upstream automatically — no separate proxy process needed.

To also test the Express proxy locally:

```bash
cd proxy && npm install && cd ..
node proxy/index.js        # terminal 1
npm run dev                # terminal 2
```

---

## Configuration

### Default location

Edit `DEFAULT_COORDS` in `src/App.jsx`:

```js
const DEFAULT_COORDS = { lat: -1.2921, lon: 36.8219 }; // Nairobi
```

### Forecast range and units

```js
const DEFAULT_DAYS = 3; // 1–7
const DEFAULT_UNITS = "metric"; // "metric" | "imperial"
```

---

## Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR   |
| `npm run build`   | Build for production → `dist/`       |
| `npm run preview` | Preview the production build locally |

---

## CORS proxy

Because the upstream API doesn't return CORS headers for arbitrary origins, all requests go through a proxy rather than calling `api.weather-ai.co` directly from the browser. The proxy also keeps your API token off the client.

```
Browser → /api/* → [proxy] → https://api.weather-ai.co/v1/*
```

Three environments, one consistent `/api/*` path in `weatherService.js`:

| Environment | Proxy mechanism                                       |
| ----------- | ----------------------------------------------------- |
| Development | Vite `server.proxy` in `vite.config.js`               |
| Vercel      | `vercel.json` rewrites (serverless, no extra process) |
| Other hosts | `proxy/index.js` — a small Express server             |

---

## Deploying to Vercel

Vercel handles the proxy via rewrites in `vercel.json` — no Express server or extra configuration needed.

```

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Commit your changes with a descriptive message
3. Push and open a pull request

Keep components self-contained and add any new API calls to `weatherService.js`.

---

## License

MIT
```
