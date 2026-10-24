import Image from "next/image";
import Link from "next/link";
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
    <main className="pokedex-content">
      <div className="pokedex-container">
        <header className="pokedex-heading">
          <div>
            <p className="pokedex-eyebrow">PRIMERA GENERACIÓN · REGIÓN DE KANTO</p>
            <h1>Un mundo por descubrir.</h1>
            <p className="pokedex-intro">Explora los 151 Pokémon originales y descubre a cada uno de ellos.</p>
          </div>
          <span className="pokedex-count"><strong>151</strong> Pokémon registrados</span>
        </header>

        <div className="pokedex-grid">
          {pokemons.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              className="pokedex-card"
            >
              <div className="pokedex-card-inner">
                <Image
                  width={128}
                  height={128}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                  alt={pokemon.name}
                  className="pokedex-artwork"
                  loading="lazy"
                />
                <h2 className="pokedex-name">
                  {pokemon.name}
                </h2>
                <p className="pokedex-number">
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
