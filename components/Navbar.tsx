'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
            />
            <span className="text-l font-bold text-slate-800">
            NederlandData
            </span>
        </Link>
        
        <div className="flex gap-6 text-sm font-medium">
          {/* <Link 
            href="/lijst" 
            className={`transition-colors ${
              pathname === "/lijst" 
                ? "text-blue-600 font-semibold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Lijst
          </Link> */}
          <Link 
            href="/" 
            className={`transition-colors ${
              pathname === "/" 
                ? "text-blue-600 font-semibold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Kaart
          </Link>
          {/* <Link 
            href="/zoeken" 
            className={`transition-colors ${
              pathname === "/zoeken" 
                ? "text-blue-600 font-semibold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Zoek je match
          </Link> */}
        </div>
      </div>
    </nav>
  );
}