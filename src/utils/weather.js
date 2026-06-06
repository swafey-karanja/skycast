// ─── WMO condition helpers ────────────────────────────────────────────────────

const CONDITIONS = {
  0:  { label: 'Clear sky',       icon: { day: '☀️',  night: '🌙' } },
  1:  { label: 'Mainly clear',    icon: { day: '🌤️', night: '🌙' } },
  2:  { label: 'Partly cloudy',   icon: { day: '⛅',  night: '⛅' } },
  3:  { label: 'Overcast',        icon: { day: '☁️',  night: '☁️' } },
  45: { label: 'Foggy',           icon: { day: '🌫️', night: '🌫️' } },
  48: { label: 'Icy fog',         icon: { day: '🌫️', night: '🌫️' } },
  51: { label: 'Light drizzle',   icon: { day: '🌦️', night: '🌦️' } },
  53: { label: 'Drizzle',         icon: { day: '🌦️', night: '🌦️' } },
  55: { label: 'Heavy drizzle',   icon: { day: '🌧️', night: '🌧️' } },
  61: { label: 'Light rain',      icon: { day: '🌧️', night: '🌧️' } },
  63: { label: 'Rain',            icon: { day: '🌧️', night: '🌧️' } },
  65: { label: 'Heavy rain',      icon: { day: '🌧️', night: '🌧️' } },
  71: { label: 'Light snow',      icon: { day: '❄️',  night: '❄️' } },
  73: { label: 'Snow',            icon: { day: '❄️',  night: '❄️' } },
  75: { label: 'Heavy snow',      icon: { day: '❄️',  night: '❄️' } },
  77: { label: 'Snow grains',     icon: { day: '🌨️', night: '🌨️' } },
  80: { label: 'Light showers',   icon: { day: '🌦️', night: '🌦️' } },
  81: { label: 'Rain showers',    icon: { day: '🌧️', night: '🌧️' } },
  82: { label: 'Heavy showers',   icon: { day: '⛈️',  night: '⛈️' } },
  95: { label: 'Thunderstorm',    icon: { day: '⛈️',  night: '⛈️' } },
  96: { label: 'Thunderstorm',    icon: { day: '⛈️',  night: '⛈️' } },
  99: { label: 'Severe storm',    icon: { day: '⛈️',  night: '⛈️' } },
}

function resolveCondition(code) {
  return CONDITIONS[Number(code)] ?? { label: 'Unknown', icon: { day: '🌡️', night: '🌡️' } }
}

export function getConditionLabel(code) {
  return resolveCondition(code).label
}

export function getConditionIcon(code, isDay = true) {
  return resolveCondition(code).icon[isDay ? 'day' : 'night']
}

// ─── Time / date formatters ───────────────────────────────────────────────────

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-KE', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatFullDate(iso) {
  return new Date(iso).toLocaleDateString('en-KE', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  })
}

export function formatShortDay(iso) {
  const d     = new Date(iso)
  const today = new Date()

  if (d.toDateString() === today.toDateString()) return 'Today'

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Derived descriptors ──────────────────────────────────────────────────────

export function windDirectionLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

/**
 * Returns human label + tailwind text-color class for a UV index value.
 */
export function uvInfo(index) {
  const uv = Number(index)
  if (uv < 3)  return { label: 'Low',       colorClass: 'text-green-400' }
  if (uv < 6)  return { label: 'Moderate',  colorClass: 'text-yellow-400' }
  if (uv < 8)  return { label: 'High',      colorClass: 'text-orange-400' }
  if (uv < 11) return { label: 'Very high', colorClass: 'text-red-400' }
  return             { label: 'Extreme',    colorClass: 'text-violet-400' }
}

/**
 * Returns a tailwind text-color class appropriate for a precipitation probability.
 */
export function rainColorClass(pct) {
  if (pct >= 60) return 'text-blue-400'
  if (pct >= 30) return 'text-sky-400'
  return 'text-slate-400'
}

/**
 * True if the icon path / string suggests daytime.
 */
export function isDaytime(iconPathOrString = '') {
  return !iconPathOrString.includes('night')
}
