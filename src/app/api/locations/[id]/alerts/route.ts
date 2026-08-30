import { NextResponse } from 'next/server';
import { decodeLocation } from '@/domain/location/codec';
import { AlertService } from '@/services/alert-service';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const location = decodeLocation(id);
  if (!location) return NextResponse.json({ error: 'Invalid location identifier.' }, { status: 400 });
  try {
    return NextResponse.json({ alerts: await new AlertService().get(location) });
  } catch (error) {
    console.error('alerts failed', error);
    return NextResponse.json({ error: 'Alerts are temporarily unavailable.' }, { status: 502 });
  }
}
