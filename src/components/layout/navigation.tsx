import Link from "next/link";

export function Navigation() { return <header className="site-header"><nav className="shell nav" aria-label="Main navigation"><Link className="brand" href="/"><span aria-hidden="true">✦</span> Snow Trail</Link><div className="nav-links"><Link href="/">Forecast</Link><Link href="/methodology">Methodology</Link></div></nav></header>; }
