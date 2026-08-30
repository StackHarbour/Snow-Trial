export function formatRelativeTime(iso: string, now = new Date("2026-08-30T06:00:00.000Z")): string { const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000); return minutes <= 0 ? "just now" : `${minutes} minute${minutes === 1 ? "" : "s"} ago`; }
export function formatQuantity(quantity: { value: number; unit: string }) { return `${quantity.value} ${quantity.unit}`; }
