import Link from "next/link";
export default function LocationNotFound() { return <div className="shell page"><p className="eyebrow">Location unavailable</p><h1>That forecast location could not be found.</h1><p className="muted">It may not be part of the demonstration catalog.</p><Link href="/">Search locations →</Link></div>; }
