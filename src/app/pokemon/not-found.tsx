import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <main className="pokedex-status-page">
      <section className="pokedex-status">
        <IoSearchOutline
          size={56}
          className="pokedex-status-icon"
          aria-hidden="true"
        />
        <p className="pokedex-eyebrow">
          Error 404
        </p>
        <h1 className="pokedex-status-title">Pokémon no encontrado</h1>
        <p className="pokedex-status-copy">
          No encontramos un Pokémon con ese nombre. Revisa la dirección o elige
          uno de la lista para continuar explorando.
        </p>
        <Link
          href="/pokemon"
          className="pokedex-button pokedex-status-link"
        >
          Explorar la Pokédex
        </Link>
      </section>
    </main>
  );
}
