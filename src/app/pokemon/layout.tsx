import "./pokedex.css";
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
    <div className="pokedex-shell">
      <nav
        aria-label="Navegación de la Pokédex"
        className="pokedex-nav"
      >
        <div className="pokedex-nav-inner">
          <Link
            href="/pokemon"
            className="pokedex-brand"
          >
            <IoGameController size={30} aria-hidden="true" />
            Pokédex.
          </Link>
          <span className="pokedex-nav-caption">ARCHIVO POKÉMON / KANTO</span>
        </div>
      </nav>
      {children}
    </div>
  );
}
