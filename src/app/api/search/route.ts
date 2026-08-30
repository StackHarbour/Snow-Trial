import { NextRequest, NextResponse } from 'next/server';
import { LocationResolver } from '@/services/location-resolver';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  const lat = Number(request.nextUrl.searchParams.get('lat'));
  const lon = Number(request.nextUrl.searchParams.get('lon'));
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous';
  if (!rateLimit(`search:${ip}`, 40)) return NextResponse.json({ error: 'Too many searches. Try again shortly.' }, { status: 429 });
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    try {
      const result = await new LocationResolver().reverse(lat, lon);
      return NextResponse.json({ result });
    } catch {
      return NextResponse.json({ error: 'Reverse geocoding is temporarily unavailable.' }, { status: 502 });
    }
  }
  if (query.length < 2) return NextResponse.json({ results: [] });
  try {
    const results = await new LocationResolver().search(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('search failed', error);
    return NextResponse.json({ error: 'Location search is temporarily unavailable.' }, { status: 502 });
  }
}
