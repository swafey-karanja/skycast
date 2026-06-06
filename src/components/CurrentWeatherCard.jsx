// CurrentWeatherCard

import {
  getConditionLabel,
  getConditionIcon,
  formatFullDate,
  formatTime,
  windDirectionLabel,
  uvInfo,
  isDaytime,
} from "../utils/weather";

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatTile({ icon, label, value, sub, subClass = "text-slate-500" }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
        {label}
      </span>
      <span className="text-xl font-bold text-slate-100 leading-tight">
        {value}
      </span>
      {sub && <span className={`text-xs ${subClass}`}>{sub}</span>}
    </div>
  );
}

function SunriseSunset({ sunrise, sunset }) {
  if (!sunrise || !sunset) return null;
  return (
    <div className="flex gap-4 text-sm text-slate-400 mt-1">
      <span>🌅 {formatTime(sunrise)}</span>
      <span>🌇 {formatTime(sunset)}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="rounded-3xl bg-shimmer animate-shimmer h-72"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    />
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <p className="text-sm text-red-300 mb-4">{message}</p>
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function CurrentWeatherCard({ data, units }) {
  if (!data?.current) return null;
  // if (!data?.current) return null;

  const c = data.current;
  const today = data.daily?.[0];
  const isDay = isDaytime(c.icon ?? "");
  const uv = uvInfo(c.uv_index ?? 0);

  const rainChance =
    c.precipitation_probability !== undefined
      ? c.precipitation_probability
      : today?.precipitation_probability;

  return (
    <article
      className="animate-fade-up rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(99,102,241,0.10) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="p-7">
        {/* ── Location + date ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <p className="text-[15px] font-bold text-slate-200">
            {data.location?.timezone} - {formatFullDate(c.time)}
          </p>

          {today && (
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Today's range</p>
              <p className="text-2xl font-bold text-slate-200 tabular-nums">
                {Math.round(today.temp_min)}° / {Math.round(today.temp_max)}°
              </p>
              <SunriseSunset sunrise={today.sunrise} sunset={today.sunset} />
            </div>
          )}
        </div>

        {/* ── Temperature hero ── */}
        <div className="flex items-end gap-5 mb-6">
          <span
            className="font-extrabold leading-none text-slate-50 tabular-nums"
            style={{
              fontSize: "clamp(64px, 14vw, 96px)",
              letterSpacing: "-5px",
            }}
          >
            {Math.round(c.temperature)}°
          </span>
          <div className="pb-2">
            <span className="text-4xl">
              {getConditionIcon(c.condition_code, isDay)}
            </span>
            <p className="text-sm text-slate-400 mt-1">
              {getConditionLabel(c.condition_code)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Feels like {Math.round(c.feels_like ?? c.temperature)}°
            </p>
          </div>
        </div>

        {/* ── Stat grid — every field from data.current ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatTile
            icon="💧"
            label="Humidity"
            value={c.humidity !== undefined ? `${c.humidity}%` : "—"}
          />

          <StatTile
            icon="🌬️"
            label="Wind speed"
            value={c.wind_speed !== undefined ? `${c.wind_speed} km/h` : "—"}
            sub={
              c.wind_direction !== undefined
                ? windDirectionLabel(c.wind_direction)
                : undefined
            }
          />

          {c.wind_gust !== undefined && (
            <StatTile
              icon="💨"
              label="Wind gust"
              value={`${c.wind_gust} km/h`}
            />
          )}

          <StatTile
            icon="☀️"
            label="UV Index"
            value={c.uv_index !== undefined ? c.uv_index.toFixed(1) : "—"}
            sub={uv.label}
            subClass={uv.colorClass}
          />

          {rainChance !== undefined && (
            <StatTile icon="🌧️" label="Rain chance" value={`${rainChance}%`} />
          )}
        </div>

        {/* ── AI summary ── */}
        {data.ai_summary && (
          <div className="mt-5 glass-violet rounded-2xl p-4">
            <p className="text-[10px] font-semibold tracking-widest text-violet-400 uppercase mb-2">
              ✨ AI Summary
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {data.ai_summary}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
