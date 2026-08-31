import Link from 'next/link';
import { ShieldQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
        <ShieldQuestion className="w-10 h-10 text-brand" />
      </div>
      <h2 className="text-3xl font-display font-bold text-snow mb-3">404 - Area Not Found</h2>
      <p className="text-text-secondary max-w-sm mx-auto mb-8">
        We couldn't locate the page or mountain region you were attempting to access.
      </p>
      <Link href="/" className="px-8 py-3 bg-brand hover:bg-brand/80 text-snow font-medium rounded-full transition-colors">
        Return to Radar
      </Link>
    </div>
  );
}