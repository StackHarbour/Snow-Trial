import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="section">
      <div className="container">
        <div className="empty-result">
          <div className="eyebrow">404</div>
          <h1 className="search-title">Location not found.</h1>
          <p>This location is not in the current demo coverage set.</p>
          <Link className="text-link" href="/">← Back to search</Link>
        </div>
      </div>
    </main>
  );
}
