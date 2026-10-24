import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IoGameController } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Pokédex - Next.js",
  description: "Explora el mundo Pokémon",
};

interface PokemonLayoutProps {
  children: ReactNode;
}

export default function PokemonLayout({ children }: PokemonLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 to-purple-900">
      <nav
        aria-label="Navegación de la Pokédex"
        className="sticky top-0 z-50 bg-black/30 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Link
            href="/pokemon"
            className="inline-flex items-center gap-2 rounded text-2xl font-bold text-white transition-colors hover:text-purple-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300"
          >
            <IoGameController size={30} aria-hidden="true" />
            Pokédex Next.js
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
