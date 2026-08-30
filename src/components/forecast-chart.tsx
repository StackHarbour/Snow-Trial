'use client';

import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HourlyForecast } from '@/domain/forecast/types';

function label(time: string) { return new Intl.DateTimeFormat('en-US', { hour: 'numeric', weekday: 'short' }).format(new Date(time)); }

export function ForecastChart({ hourly }: { hourly: HourlyForecast[] }) {
  const data = hourly.slice(0, 48).map((hour) => ({
    time: label(hour.time),
    snow: Number((hour.snowfallIn ?? 0).toFixed(2)),
    temp: Math.round(hour.temperatureF ?? 0),
    probability: Math.round(hour.precipitationProbability ?? 0),
  }));
  return <div className="chart-grid">
    <div className="chart-panel"><div className="chart-title">Hourly snowfall</div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" minTickGap={35} /><YAxis unit=" in" width={42} /><Tooltip /><Area type="monotone" dataKey="snow" name="Snowfall" stroke="var(--snow)" fill="var(--snow-fill)" /></AreaChart></ResponsiveContainer></div></div>
    <div className="chart-panel"><div className="chart-title">Temperature & precipitation probability</div><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" minTickGap={35} /><YAxis yAxisId="temp" unit="°" width={36} /><YAxis yAxisId="prob" orientation="right" unit="%" width={36} domain={[0, 100]} /><Tooltip /><Line yAxisId="temp" type="monotone" dataKey="temp" name="Temperature" stroke="var(--ink)" dot={false} /><Line yAxisId="prob" type="monotone" dataKey="probability" name="Precip. probability" stroke="var(--storm)" dot={false} /></LineChart></ResponsiveContainer></div></div>
  </div>;
}
