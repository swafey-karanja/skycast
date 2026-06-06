// App.jsx

import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import WeatherHeader from "./components/WeatherHeader";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import HourlyForecastCard from "./components/HourlyForecastCard";
import DailyForecastCard from "./components/DailyForecastCard";
import UsageCard from "./components/UsageCard";

const DEFAULT_COORDS = { lat: -1.2921, lon: 36.8219 };
const DEFAULT_DAYS = 3;
const DEFAULT_UNITS = "metric";

function SkeletonBlock({ h = "h-48", delay = "" }) {
  return (
    <div
      className={`${h} rounded-3xl bg-shimmer animate-shimmer`}
      style={{ animationDelay: delay }}
    />
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <p className="text-sm text-red-300 mb-5">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer
                   bg-red-500/10 text-red-300 ring-1 ring-red-500/30
                   hover:bg-red-500/20 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("All");
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [units, setUnits] = useState(DEFAULT_UNITS);

  const { data, loading, error, refetch } = useWeather(
    DEFAULT_COORDS,
    days,
    units,
  );

  const show = (section) => tab === "All" || tab === section;

  return (
    <div className="min-h-screen" style={{ background: "#060d1f" }}>
      <WeatherHeader
        tab={tab}
        onTabChange={setTab}
        days={days}
        onDaysChange={setDays}
        units={units}
        onUnitsChange={setUnits}
        loading={loading}
        onRefresh={refetch}
        location={data?.location}
      />

      <main className="container mx-auto px-4 py-6 flex flex-col gap-5">
        {loading && (
          <>
            <SkeletonBlock h="h-72" delay="0ms" />
            <SkeletonBlock h="h-36" delay="60ms" />
            <SkeletonBlock h="h-56" delay="120ms" />
            <SkeletonBlock h="h-32" delay="180ms" />
          </>
        )}

        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            {show("Current") && data && (
              <CurrentWeatherCard data={data} units={units} />
            )}
            {show("Hourly") && data && (
              <HourlyForecastCard data={data} units={units} />
            )}
            {show("Daily") && data && (
              <DailyForecastCard data={data} units={units} />
            )}
          </>
        )}

        <UsageCard />
      </main>
    </div>
  );
}
