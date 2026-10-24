"use client";

import Link from "next/link";
import { IoRefresh, IoWarningOutline } from "react-icons/io5";

interface PokemonErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ reset }: PokemonErrorProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
      <section
        role="alert"
        className="w-full rounded-2xl border border-purple-200/20 bg-slate-950/60 p-8 text-center text-white shadow-xl"
      >
        <IoWarningOutline
          size={56}
          className="mx-auto mb-6 text-amber-300"
          aria-hidden="true"
        />
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-200">
          La aventura está en pausa
        </p>
        <h1 className="text-3xl font-bold">No pudimos cargar la Pokédex</h1>
        <p className="mt-4 leading-relaxed text-slate-300">
          Ocurrió un problema al consultar los datos. Comprueba tu conexión y
          vuelve a intentarlo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-300 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-purple-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300"
          >
            <IoRefresh size={20} aria-hidden="true" />
            Reintentar
          </button>
          <Link
            href="/pokemon"
            className="rounded-lg border border-purple-200/40 px-5 py-3 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300"
          >
            Volver a la Pokédex
          </Link>
        </div>
      </section>
    </main>
  );
}
