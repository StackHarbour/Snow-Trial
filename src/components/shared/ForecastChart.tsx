'use client';

import { useEffect, useRef } from 'react';
import type { HourlyForecast } from '@/domain/forecast/model';

export function ForecastChart({ data }: { data: HourlyForecast[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: { setOption: (option: unknown) => void; resize: () => void; dispose: () => void } | undefined;
    let resizeHandler: (() => void) | undefined;
    let cancelled = false;

    async function render() {
      if (!ref.current) return;
      const echarts = await import('echarts');
      if (cancelled || !ref.current) return;

      chart = echarts.init(ref.current);
      chart.setOption({
        animation: true,
        tooltip: { trigger: 'axis', valueFormatter: (value: number) => `${value} in` },
        grid: { left: 12, right: 18, top: 22, bottom: 28, containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: data.map((item) => new Date(item.time).toLocaleTimeString([], { hour: 'numeric' })),
          axisLabel: { color: '#71808b', interval: 5 },
          axisLine: { lineStyle: { color: '#dce5ea' } },
        },
        yAxis: {
          type: 'value',
          name: 'in',
          min: 0,
          splitLine: { lineStyle: { color: '#edf2f4' } },
          axisLabel: { color: '#71808b' },
          nameTextStyle: { color: '#71808b' },
        },
        series: [{
          name: 'Snowfall',
          type: 'bar',
          data: data.map((item) => item.snowfallIn),
          barMaxWidth: 18,
          itemStyle: { borderRadius: [5, 5, 2, 2], color: '#2f8fb3' },
        }],
      });

      resizeHandler = () => chart?.resize();
      window.addEventListener('resize', resizeHandler);
    }

    void render();

    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      chart?.dispose();
    };
  }, [data]);

  return (
    <div className="card chart-card">
      <div className="section-head">
        <div>
          <div className="eyebrow">Hourly snowfall</div>
          <h2>When the snow arrives</h2>
        </div>
        <span className="mini-label">48 hours</span>
      </div>
      <div ref={ref} className="chart" aria-label="Hourly snowfall chart" />
    </div>
  );
}
