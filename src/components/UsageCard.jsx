// usagecard

import { useUsage } from "../hooks/useUsage";

function UsageBar({ label, used, limit, color }) {
  const pct = Math.min(Math.round((used / limit) * 100), 100);
  const isHigh = pct >= 80;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-md text-slate-400">{label}</span>
        <span className="text-xs font-mono text-slate-400">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isHigh ? "#f97316" : color,
          }}
        />
      </div>
      <p className="text-[12px] text-slate-500 mt-1">
        {(limit - used).toLocaleString()} remaining
      </p>
    </div>
  );
}

function FeatureChip({ label, enabled }) {
  return (
    <span
      className={[
        "text-[12px] font-semibold px-3 py-1 rounded-full",
        enabled
          ? "bg-frost-500/15 text-frost-400"
          : "bg-white/5 text-slate-600 line-through",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function SkeletonBar() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-3 w-1/2 rounded bg-shimmer animate-shimmer" />
      <div className="h-1.5 rounded-full bg-shimmer animate-shimmer" />
    </div>
  );
}

export default function UsageCard() {
  const { data, loading, error } = useUsage();

  return (
    <article
      className="glass rounded-3xl p-5 animate-fade-up"
      style={{ animationDelay: "180ms" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">
          📊 API Usage
        </h2>
        {data && (
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 uppercase tracking-wider">
            {data.plan}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-5">
          <SkeletonBar />
          <SkeletonBar />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">Failed to load usage data.</p>
      )}

      {!loading && !error && data && (
        <div className="flex flex-col gap-5">
          {/* Usage bars */}
          <UsageBar
            label="Requests"
            used={data.period.requestCount}
            limit={data.limits.requests}
            color="#38bdf8"
          />
          <UsageBar
            label="AI Requests"
            used={data.period.aiRequestCount}
            limit={data.limits.aiRequests}
            color="#a78bfa"
          />

          {/* Plan features */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">
              Plan features
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FeatureChip label={`${data.limits.maxDays}d forecast`} enabled />
              <FeatureChip label="Webhooks" enabled={data.limits.webhooks} />
              <FeatureChip label="SMS alerts" enabled={data.limits.sms} />
              <FeatureChip
                label={`${data.limits.teamSeats} seat${data.limits.teamSeats > 1 ? "s" : ""}`}
                enabled
              />
            </div>
          </div>

          {/* Billing period */}
          <div className="border-t border-white/5 pt-4 flex justify-between text-[12px] text-slate-500">
            <span>
              Period started{" "}
              {new Date(data.period.start).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span>
              Resets{" "}
              {new Date(data.period.end).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
