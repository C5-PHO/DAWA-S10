import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Pokemon, PokemonListResponse } from "@/types/pokemon";

interface PokemonPageProps {
  params: Promise<{ name: string }>;
}

async function getPokemon(name: string): Promise<Pokemon> {
  if (!/^[a-z0-9-]+$/.test(name)) notFound();

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
    { next: { revalidate: 86400 } },
  );

  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Error al consultar el Pokémon");
  return response.json();
}

export async function generateStaticParams() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error("Error al generar las rutas de Pokémon");
  const data: PokemonListResponse = await response.json();
  return data.results.map((pokemon) => ({ name: pokemon.name }));
}

export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokédex`,
    description: `Tipos, estadísticas, habilidades e información de ${pokemon.name}.`,
  };
}

const statLabels: Record<string, string> = {
  hp: "Salud",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque especial",
  "special-defense": "Defensa especial",
  speed: "Velocidad",
};

export default async function PokemonDetail({ params }: PokemonPageProps) {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  const artwork = pokemon.sprites.other["official-artwork"].front_default
    || pokemon.sprites.front_default;

  return (
    <main className="pokedex-content">
      <article className="pokedex-container">
        <Link href="/pokemon" className="dex-back">← Volver a la Pokédex</Link>
        <header className="pokedex-heading dex-detail-heading">
          <div>
            <p className="pokedex-eyebrow">ARCHIVO POKÉMON / FICHA INDIVIDUAL</p>
            <h1 className="capitalize">{pokemon.name}</h1>
          </div>
          <span className="dex-detail-id">#{String(pokemon.id).padStart(3, "0")}</span>
        </header>
        <div className="dex-detail-grid">
          <div className="dex-detail-artwork">
            {artwork ? (
              <Image src={artwork} width={400} height={400} alt={pokemon.name}
                className="h-auto w-full max-w-96 object-contain" />
            ) : <p>Imagen no disponible</p>}
          </div>
          <div className="dex-detail-data">
            <section aria-labelledby="pokemon-types">
              <h2 id="pokemon-types">Tipos</h2>
              <ul className="dex-types">
                {pokemon.types.map(({ type }) => <li key={type.name}>{type.name}</li>)}
              </ul>
            </section>
            <section aria-labelledby="pokemon-stats">
              <h2 id="pokemon-stats">Estadísticas</h2>
              {pokemon.stats.map(({ stat, base_stat }) => (
                <div className="dex-stat" key={stat.name}>
                  <div><label htmlFor={`stat-${stat.name}`}>{statLabels[stat.name] || stat.name}</label><span>{base_stat}</span></div>
                  <meter id={`stat-${stat.name}`} min={0} max={255} value={base_stat}>{base_stat} de 255</meter>
                </div>
              ))}
            </section>
            <section aria-labelledby="pokemon-info">
              <h2 id="pokemon-info">Información</h2>
              <dl className="dex-info">
                <div><dt>Altura</dt><dd>{pokemon.height / 10} m</dd></div>
                <div><dt>Peso</dt><dd>{pokemon.weight / 10} kg</dd></div>
                <div><dt>Habilidades</dt><dd>{pokemon.abilities.map(({ ability }) => ability.name.replaceAll("-", " ")).join(", ")}</dd></div>
              </dl>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
