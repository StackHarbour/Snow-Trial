import { notFound } from "next/navigation";
import { ForecastView } from "@/components/forecast/forecast-view";
import { getForecastForLocation } from "@/services/forecast-service";
import { getLocationBySlug } from "@/services/location-service";

export default async function LocationPage({ params }: { params: Promise<{ locationSlug: string }> }) { const { locationSlug } = await params; const location = await getLocationBySlug(locationSlug); if (!location) notFound(); const forecast = await getForecastForLocation(location); return <div className="shell page"><p className="eyebrow">Demonstration forecast · not live data</p><ForecastView forecast={forecast} /></div>; }
