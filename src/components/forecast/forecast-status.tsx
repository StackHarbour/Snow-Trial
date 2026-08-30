import type { ConfidenceLevel, FreshnessState } from "@/domain/forecast/types";

export function ForecastStatus({ freshness, confidence }: { freshness: FreshnessState; confidence: ConfidenceLevel }) { return <div className="status-row"><span className={`status freshness-${freshness}`}>{freshness === "stale" ? "Forecast data is stale" : "Forecast data available"}</span><span className={`status confidence-${confidence}`}>Confidence: {confidence}</span></div>; }
