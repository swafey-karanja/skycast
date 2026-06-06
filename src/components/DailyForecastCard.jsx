// DailyForecastCard

import {
  getConditionIcon,
  getConditionLabel,
  formatShortDay,
  formatTime,
  rainColorClass,
} from "../utils/weather";

function DataPoint({ icon, label, value, valueClass = "text-slate-300" }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-lg shrink-0">{icon}</span>
      <span className="text-[12.5px] text-slate-500 truncate">{label}</span>
      <span
        className={`text-[13px] font-semibold tabular-nums ml-auto shrink-0 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function DayCard({ day, absMin, absMax, isFirst }) {
  const range = absMax - absMin || 1;
  const barLeft = ((day.temp_min - absMin) / range) * 100;
  const barRight = ((absMax - day.temp_max) / range) * 100;
  const rainPct = day.precipitation_probability ?? 0;

  return (
    <div
      className={[
        "rounded-2xl p-4 flex flex-col gap-3 transition-all duration-150",
        isFirst ? "glass-frost" : "glass hover:bg-white/5",
      ].join(" ")}
    >
      {/* ── Header: day name + icon + condition ── */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-md font-bold ${isFirst ? "text-frost-400" : "text-slate-300"}`}
        >
          {formatShortDay(day.date)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {getConditionIcon(day.condition_code)}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-slate-400 -mt-1">
        {getConditionLabel(day.condition_code)}
      </p>

      {/* ── Temperature range bar ── */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-blue-400 font-semibold tabular-nums w-7 text-right shrink-0">
          {Math.round(day.temp_min)}°
        </span>
        <div className="relative flex-1 h-1.5 rounded-full bg-white/5">
          <div
            className="absolute inset-y-0 rounded-full"
            style={{
              left: `${barLeft}%`,
              right: `${barRight}%`,
              background: "linear-gradient(90deg, #38bdf8, #f97316)",
            }}
          />
        </div>
        <span className="text-sm font-bold text-red-400 tabular-nums w-7 shrink-0">
          {Math.round(day.temp_max)}°
        </span>
      </div>

      {/* ── All remaining data points ── */}
      <div className="flex flex-col gap-x-3 gap-y-1 pt-1 border-t border-white/5">
        <DataPoint
          icon="🌧️"
          label="Rain chance"
          value={`${rainPct}%`}
          valueClass={rainPct > 0 ? rainColorClass(rainPct) : "text-slate-500"}
        />

        <DataPoint
          icon="💧"
          label="Precip."
          value={
            day.precipitation_sum !== undefined
              ? `${day.precipitation_sum}mm`
              : "—"
          }
        />

        <DataPoint
          icon="💨"
          label="Max wind"
          value={day.wind_max !== undefined ? `${day.wind_max} km/h` : "—"}
        />

        <DataPoint
          icon="🌅"
          label="Sunrise"
          value={day.sunrise ? formatTime(day.sunrise) : "—"}
        />

        <DataPoint
          icon="🌇"
          label="Sunset"
          value={day.sunset ? formatTime(day.sunset) : "—"}
        />
      </div>
    </div>
  );
}

export default function DailyForecastCard({ data }) {
  const days = data?.daily;
  if (!days?.length) return null;

  const absMax = Math.max(...days.map((d) => d.temp_max));
  const absMin = Math.min(...days.map((d) => d.temp_min));

  return (
    <article
      className="animate-fade-up glass rounded-3xl p-5"
      style={{ animationDelay: "120ms" }}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
        📅 {days.length}-Day Forecast
      </h2>

      <div className="flex flex-col gap-3">
        {days.map((d, i) => (
          <DayCard
            key={d.date}
            day={d}
            absMin={absMin}
            absMax={absMax}
            isFirst={i === 0}
          />
        ))}
      </div>
    </article>
  );
}
