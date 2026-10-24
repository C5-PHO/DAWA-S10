import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
      <section className="w-full rounded-2xl border border-purple-200/20 bg-slate-950/60 p-8 text-center text-white shadow-xl">
        <IoSearchOutline
          size={56}
          className="mx-auto mb-6 text-purple-300"
          aria-hidden="true"
        />
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-200">
          Error 404
        </p>
        <h1 className="text-3xl font-bold">Pokémon no encontrado</h1>
        <p className="mt-4 leading-relaxed text-slate-300">
          No encontramos un Pokémon con ese nombre. Revisa la dirección o elige
          uno de la lista para continuar explorando.
        </p>
        <Link
          href="/pokemon"
          className="mt-8 inline-flex rounded-lg bg-purple-300 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-purple-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300"
        >
          Explorar la Pokédex
        </Link>
      </section>
    </main>
  );
}
