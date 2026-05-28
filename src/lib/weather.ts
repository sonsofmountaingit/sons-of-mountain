export interface WeatherData {
  temp: number
  code: number
  description: string
  icon: string
}

// WMO weather code → label + emoji (no external deps)
function wmoToLabel(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Ясно', icon: '☀️' }
  if (code <= 2) return { description: 'Частично облачно', icon: '⛅' }
  if (code === 3) return { description: 'Облачно', icon: '☁️' }
  if (code <= 49) return { description: 'Мъгла', icon: '🌫️' }
  if (code <= 59) return { description: 'Ситен дъжд', icon: '🌦️' }
  if (code <= 69) return { description: 'Дъжд', icon: '🌧️' }
  if (code <= 79) return { description: 'Сняг', icon: '❄️' }
  if (code <= 84) return { description: 'Дъждовни душове', icon: '🌧️' }
  if (code <= 94) return { description: 'Гръмотевична буря', icon: '⛈️' }
  return { description: 'Буря', icon: '🌩️' }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
    const res = await fetch(url, { next: { revalidate: 1800 } }) // cache 30min
    if (!res.ok) return null
    const j = await res.json()
    const temp = Math.round(j.current.temperature_2m)
    const code = j.current.weather_code
    return { temp, code, ...wmoToLabel(code) }
  } catch {
    return null
  }
}
