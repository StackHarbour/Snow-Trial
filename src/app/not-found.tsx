import Link from 'next/link';

export default function NotFound() { return <main className="not-found"><div><span className="eyebrow">Location not found</span><h1>We couldn't resolve that location.</h1><p>The location identifier is invalid or no longer supported. Search again rather than guessing.</p><Link href="/" className="primary-button">Back to search</Link></div></main>; }
