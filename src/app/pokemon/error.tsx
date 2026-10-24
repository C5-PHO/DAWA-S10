"use client";

import Link from "next/link";
import { IoRefresh, IoWarningOutline } from "react-icons/io5";

interface PokemonErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ reset }: PokemonErrorProps) {
  return (
    <main className="pokedex-status-page">
      <section
        role="alert"
        className="pokedex-status"
      >
        <IoWarningOutline
          size={56}
          className="pokedex-status-icon"
          aria-hidden="true"
        />
        <p className="pokedex-eyebrow">
          La aventura está en pausa
        </p>
        <h1 className="pokedex-status-title">No pudimos cargar la Pokédex</h1>
        <p className="pokedex-status-copy">
          Ocurrió un problema al consultar los datos. Comprueba tu conexión y
          vuelve a intentarlo.
        </p>
        <div className="pokedex-status-actions">
          <button
            type="button"
            onClick={reset}
            className="pokedex-button"
          >
            <IoRefresh size={20} aria-hidden="true" />
            Reintentar
          </button>
          <Link
            href="/pokemon"
            className="pokedex-button-secondary"
          >
            Volver a la Pokédex
          </Link>
        </div>
      </section>
    </main>
  );
}
