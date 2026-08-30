import type { NormalizedSnowForecast } from "@/domain/forecast/types";
import { formatQuantity, formatRelativeTime } from "@/lib/format";
import { ForecastCard } from "@/components/forecast/forecast-card";
import { ForecastStatus } from "@/components/forecast/forecast-status";

export function ForecastView({ forecast }: { forecast: NormalizedSnowForecast }) {
  const snow = forecast.snow;
  return <>
    <section className="forecast-heading"><div><p className="eyebrow">{forecast.location.region}, {forecast.location.country}</p><h1>{forecast.location.name}</h1><p className="muted">{forecast.validPeriod.label} · Updated {formatRelativeTime(forecast.provider.sourceUpdatedAt)}</p></div><ForecastStatus freshness={forecast.freshness} confidence={forecast.confidence.level} /></section>
    <section aria-labelledby="snow-forecast-heading"><div className="section-intro"><p className="eyebrow">Snow forecast</p><h2 id="snow-forecast-heading">What snow is expected</h2></div>{forecast.freshness === "stale" ? <div className="notice warning" role="status">This is a labeled demo stale-data scenario. Do not treat it as current conditions.</div> : null}<div className="metric-grid">
      <ForecastCard label="Snowfall" value={snow.snowfall ? formatQuantity(snow.snowfall) : undefined} detail="Expected during forecast period" unavailable={snow.availability === "unavailable"} />
      <ForecastCard label="Snow probability" value={snow.probability ? formatQuantity(snow.probability) : undefined} detail="Chance of measurable snow" unavailable={snow.availability === "unavailable"} />
      <ForecastCard label="Snow timing" value={snow.timing} detail={snow.intensity ? `${snow.intensity} intensity` : undefined} unavailable={snow.availability === "unavailable"} />
      <ForecastCard label="Accumulation" value={snow.accumulation ? formatQuantity(snow.accumulation) : undefined} detail="Total expected accumulation" unavailable={snow.availability === "unavailable"} />
    </div>{snow.availability === "unavailable" ? <div className="notice" role="status">Snow forecast is temporarily unavailable. Available weather context is still shown below; no fallback snow values are displayed.</div> : null}</section>
    <section className="weather-section" aria-labelledby="weather-heading"><div className="section-intro"><p className="eyebrow">Weather context</p><h2 id="weather-heading">Conditions around the snow</h2></div><div className="weather-grid"><ForecastCard label="Temperature" value={forecast.weather.temperature ? `${formatQuantity(forecast.weather.temperature.low)} to ${formatQuantity(forecast.weather.temperature.high)}` : undefined} detail="Forecast low to high" /><ForecastCard label="Precipitation" value={forecast.weather.precipitationType} detail="Dominant expected type" /><ForecastCard label="Wind" value={forecast.weather.wind ? formatQuantity(forecast.weather.wind) : undefined} detail="Forecast wind speed" /></div></section>
    <section className="confidence-panel"><p className="eyebrow">Forecast confidence</p><h2>{forecast.confidence.level[0].toUpperCase() + forecast.confidence.level.slice(1)}</h2><p>{forecast.confidence.explanation}</p><dl><div><dt>Source</dt><dd>{forecast.provider.name}</dd></div><div><dt>Valid period</dt><dd>{forecast.validPeriod.label}</dd></div><div><dt>Data mode</dt><dd>Clearly labeled demonstration data</dd></div></dl></section>
  </>;
}
