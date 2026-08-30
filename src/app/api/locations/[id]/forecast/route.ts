import { NextResponse } from 'next/server';
import { decodeLocation } from '@/domain/location/codec';
import { ForecastOrchestrator } from '@/services/forecast-orchestrator';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const location = decodeLocation(id);
  if (!location) return NextResponse.json({ error: 'Invalid location identifier.' }, { status: 400 });
  try {
    const result = await new ForecastOrchestrator().get(location);
    return NextResponse.json(result);
  } catch (error) {
    console.error('forecast failed', error);
    return NextResponse.json({ error: 'Forecast data is temporarily unavailable.' }, { status: 502 });
  }
}
