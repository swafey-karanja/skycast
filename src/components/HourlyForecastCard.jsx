// Hourlyforecastcard

import {
  getConditionIcon,
  getConditionLabel,
  formatTime,
  rainColorClass,
  isDaytime,
} from "../utils/weather";

function HourRow({ hour, isNow }) {
  const isDay = isDaytime(hour.icon ?? "");
  const rainPct = hour.precipitation_probability ?? 0;

  return (
    <div
      className={[
        "rounded-2xl p-4 flex flex-col gap-3 transition-all duration-150",
        isNow ? "bg-blue-700/40" : "glass hover:bg-white/5",
      ].join(" ")}
    >
      {/* ── Header: time + icon + temp ── */}
      <div className="flex items-center justify-between">
        <span
          className={`text-md font-bold ${isNow ? "text-frost-400" : "text-slate-400"}`}
        >
          {isNow ? "Now" : formatTime(hour.time)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">
            {getConditionIcon(hour.condition_code, isDay)}
          </span>
          <span className="text-lg font-extrabold text-slate-100 tabular-nums">
            {Math.round(hour.temperature)}°
          </span>
        </div>
      </div>

      {/* ── Condition label ── */}
      <p className="text-[13px] text-slate-400 -mt-1">
        {getConditionLabel(hour.condition_code)}
      </p>

      {/* ── Data points grid ── */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
        <DataPoint
          // icon="🌡️"
          label="Feels like"
          value={`${Math.round(hour.feels_like ?? hour.temperature)}°`}
        />

        <DataPoint
          // icon="💧"
          label="Humidity"
          value={hour.humidity !== undefined ? `${hour.humidity}%` : "—"}
        />

        <DataPoint
          // icon="🌬️"
          label="Wind"
          value={
            hour.wind_speed !== undefined ? `${hour.wind_speed} km/h` : "—"
          }
        />

        <DataPoint
          // icon="💨"
          label="Gust"
          value={hour.wind_gust !== undefined ? `${hour.wind_gust} km/h` : "—"}
        />

        <DataPoint
          // icon="🌧️"
          label="Rain"
          value={rainPct > 0 ? `${rainPct}%` : "0%"}
          valueClass={rainPct > 0 ? rainColorClass(rainPct) : "text-slate-500"}
        />

        <DataPoint
          // icon="☀️"
          label="UV"
          value={hour.uv_index !== undefined ? hour.uv_index.toFixed(1) : "—"}
        />
      </div>
    </div>
  );
}

function DataPoint({ label, value, valueClass = "text-slate-200" }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {/* <span className="text-sm shrink-0">{icon}</span> */}
      <span className="text-[10px] text-slate-400 truncate">{label}</span>
      <span
        className={`text-[11px] font-semibold tabular-nums ml-auto shrink-0 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function HourlyForecastCard({ data }) {
  const hours = data?.hourly;
  if (!hours?.length) return null;

  // Start from current hour (30 min buffer), take at least 8 entries
  const now = new Date();
  const upcoming = hours.filter(
    (h) => new Date(h.time) >= new Date(now.getTime() - 30 * 60_000),
  );
  const display = (upcoming.length >= 8 ? upcoming : hours).slice(0, 24);

  if (!display.length) return null;

  return (
    <article
      className="animate-fade-up glass rounded-3xl p-5"
      style={{ animationDelay: "60ms" }}
    >
      <h2 className="text-[12px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
        🕐 Hourly Forecast
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {display.map((h, i) => (
          <HourRow key={h.time} hour={h} isNow={i === 0} />
        ))}
      </div>
    </article>
  );
}
