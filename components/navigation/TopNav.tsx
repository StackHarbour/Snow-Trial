'use client';
import Link from 'next/link';
import { Snowflake, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-surface-raised bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-snow hover:text-ice transition-colors">
          <Snowflake className="w-6 h-6 text-ice" />
          <span className="font-display font-bold tracking-tight text-xl">SNOW TRAIL</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={`${pathname === '/' ? 'text-snow' : 'text-text-secondary hover:text-snow'}`}>Forecast</Link>
          <div className="relative group">
            <span className="text-text-secondary/50 cursor-not-allowed">Maps</span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-raised text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Coming Phase 2</div>
          </div>
          <div className="relative group">
            <span className="text-text-secondary/50 cursor-not-allowed">Find Snow</span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-raised text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Coming Phase 2</div>
          </div>
          <Link href="/methodology" className={`${pathname === '/methodology' ? 'text-snow' : 'text-text-secondary hover:text-snow'}`}>Methodology</Link>
        </nav>
        
        <div className="flex items-center">
          <Link href="/search" className="p-2 text-text-secondary hover:text-snow transition-colors md:hidden">
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}