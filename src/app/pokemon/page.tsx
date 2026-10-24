import Image from "next/image";
import Link from "next/link";
import { IoMdList } from "react-icons/io";
import type { PokemonListResponse, SimplePokemon } from "@/types/pokemon";

async function getPokemons(): Promise<SimplePokemon[]> {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 },
  });

  if (!response.ok) throw new Error("Error al cargar Pokémon");

  const data: PokemonListResponse = await response.json();

  return data.results.map((pokemon) => ({
    name: pokemon.name,
    id: Number(pokemon.url.split("/").filter(Boolean).at(-1)),
  }));
}

export default async function PokemonList() {
  const pokemons = await getPokemons();

  return (
    <main className="p-4 py-8 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 flex items-center gap-3 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
          <IoMdList size={40} aria-hidden="true" />
          Lista de Pokémon (ISR)
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pokemons.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              className="rounded-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-300 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="rounded-xl bg-white p-6 text-gray-700 shadow-lg hover:shadow-2xl">
                <Image
                  width={128}
                  height={128}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                  alt={pokemon.name}
                  className="mx-auto h-32 w-32 object-contain"
                  loading="lazy"
                />
                <h2 className="mt-4 text-center text-xl font-bold capitalize">
                  {pokemon.name}
                </h2>
                <p className="text-center text-gray-500">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
