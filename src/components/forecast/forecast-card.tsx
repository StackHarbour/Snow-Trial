import type { ReactNode } from "react";

export function ForecastCard({ label, value, detail, unavailable = false }: { label: string; value?: string; detail?: ReactNode; unavailable?: boolean }) { return <article className={`forecast-card${unavailable ? " unavailable" : ""}`}><p>{label}</p><strong>{unavailable ? "Unavailable" : value}</strong>{detail ? <span>{detail}</span> : null}</article>; }
