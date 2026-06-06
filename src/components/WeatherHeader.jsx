// WeatherHeader

const TABS = ["All", "Current", "Hourly", "Daily"];
const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function WeatherHeader({
  tab,
  onTabChange,
  days,
  onDaysChange,
  loading,
  onRefresh,
  location,
}) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-sky-900/80 border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* ── Branding + location ── */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-7xl select-none">🌦️</span>
          <div className="min-w-0 flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight leading-none text-slate-100">
              Skycast
            </h1>
            {location && (
              <p className="text-[12px] font-mono text-slate-400 mt-0.5 truncate">
                {location.timezone} · KE
              </p>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-5 flex-wrap">
          {/* Days dropdown — shown only when Daily or All is active */}
          {(tab === "All" || tab === "Daily") && (
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
                Days
              </label>
              <select
                value={days}
                onChange={(e) => onDaysChange(Number(e.target.value))}
                className="bg-white/5 border border-white/8 rounded-lg px-3 py-1.5
                           text-xs font-mono text-slate-300 cursor-pointer
                           focus:outline-none focus:ring-1 focus:ring-frost-500/40
                           transition-all duration-150"
              >
                {DAY_OPTIONS.map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-slate-900 text-slate-300"
                  >
                    {d} {d === 1 ? "day" : "days"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* View tabs */}
          <nav className="flex bg-white/5 rounded-xl px-1 mt-5 gap-0.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className={[
                  "px-3 py-1 rounded-lg text-md font-semibold transition-all duration-150 cursor-pointer",
                  tab === t
                    ? "bg-frost-500/15 text-frost-400"
                    : "text-slate-500 hover:text-slate-300",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh data"
            className={[
              "w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 mt-5",
              "hover:text-slate-200 transition-all duration-150 cursor-pointer font-bold",
              loading ? "animate-spin opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            ↻
          </button>
        </div>
      </div>
    </header>
  );
}
