# Skycast 🌦️

A responsive weather app built with React and Vite, powered by the [weather-ai.co](https://api.weather-ai.co) API. Displays current conditions, hourly and daily forecasts, and an AI-generated weather summary — all in a dark UI.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-teal)

---

## Features

- Current conditions — temperature, feels like, wind, humidity, UV index, wind gust
- AI-generated weather summary
- Hourly forecast — 24-hour view with 8 data points per entry
- Daily forecast — multi-day outlook with temperature range bars, precipitation, sunrise/sunset, and max wind
- Tab navigation — All, Current, Hourly, Daily
- Days dropdown — 1 to 7 day forecast range
- API usage card — billing period, request counts, and plan limits
- Skeleton loading states and error handling with retry

---

## Tech stack

| Layer   | Tool                   |
| ------- | ---------------------- |
| UI      | React 18               |
| Build   | Vite 5                 |
| Styling | Tailwind CSS 3         |
| HTTP    | Native `fetch`         |
| Data    | weather-ai.co REST API |

---

## Project structure

```
skycast/
├── index.html
├── netlify.toml                        # Build config + /api/* proxy redirect
├── vite.config.js                      # Dev server proxy
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.development                    # Local env vars (not committed)
├── netlify/
│   └── functions/
│       └── proxy.js                    # Serverless proxy function
└── src/
    ├── main.jsx
    ├── App.jsx                         # Root — owns tab, days, units state
    ├── index.css                       # Tailwind directives + global utilities
    ├── services/
    │   └── weatherService.js           # All API calls — always uses /api/*
    ├── hooks/
    │   ├── useWeather.js               # Fetches full weather payload
    │   └── useUsage.js                 # Fetches API billing & limits
    ├── utils/
    │   └── weather.js                  # WMO helpers, formatters, colour utils
    └── components/
        ├── WeatherHeader.jsx           # Sticky nav, tabs, units, days
        ├── CurrentWeatherCard.jsx      # Current conditions hero card
        ├── HourlyForecastCard.jsx      # 24-hour two-column grid
        ├── DailyForecastCard.jsx       # Daily two-column grid
        └── UsageCard.jsx               # API quota and plan info
```

---

## API endpoints

All calls go through `weatherService.js` which uses `/api/*` — the proxy layer resolves this to `https://api.weather-ai.co/v1/*`.

| Method     | Endpoint          | Used for                              |
| ---------- | ----------------- | ------------------------------------- |
| `getAll`   | `GET /v1/weather` | Full payload — current, hourly, daily |
| `getUsage` | `GET /v1/usage`   | Billing period and plan limits        |

---

## CORS proxy

The upstream API does not return CORS headers for browser requests, so all calls are routed through a proxy. The proxy also keeps the API token off the client.

```
Browser → /api/* → proxy → https://api.weather-ai.co/v1/*
```

| Environment | Mechanism                                                |
| ----------- | -------------------------------------------------------- |
| Development | Vite `server.proxy` in `vite.config.js`                  |
| Production  | `netlify/functions/proxy.js` via `netlify.toml` redirect |

---

## Local setup

```bash
git clone <your-repo-url>
cd skycast
npm install
```

Add `.env.development` to the project root:

```env
VITE_WEATHER_API_TOKEN=your_api_token_here
VITE_WEATHER_API_BASE_URL=https://api.weather-ai.co/v1
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite proxy handles `/api/*` automatically — no separate process needed.

---

## Configuration

**Default location** — `src/App.jsx`:

```js
const DEFAULT_COORDS = { lat: -1.2921, lon: 36.8219 }; // Nairobi
```

**Forecast defaults** — `src/App.jsx`:

```js
const DEFAULT_DAYS = 3; // 1–7
const DEFAULT_UNITS = "metric"; // 'metric' | 'imperial'
```

---

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server with HMR            |
| `npm run build`   | Build for production → `dist/`       |
| `npm run preview` | Preview the production build locally |

---

## License

MIT
