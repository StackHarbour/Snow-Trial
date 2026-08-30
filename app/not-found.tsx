import Link from 'next/link';
export default function NotFound(){return <main className="not-found"><div className="eyebrow">404 / TRAIL ENDED</div><h1>That location isn't here.</h1><p>Search for a city, mountain, resort or ZIP code instead.</p><Link href="/search" className="dark-button">Search Snow Trail</Link></main>}
