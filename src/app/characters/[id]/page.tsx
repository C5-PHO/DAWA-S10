import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCharacters,
  getCharacter,
  getEpisodes,
  getLocation,
} from "@/lib/characters";
import "../../archive.css";

interface Props {
  params: Promise<{ id: string }>;
}
export const revalidate = 864000;
export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map((character) => ({ id: String(character.id) }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();
  return {
    title: `${character.name} | R/M Field Archive`,
    description: `Ficha de ${character.name}: especie, origen, ubicación y episodios.`,
  };
}
export default async function CharacterDetail({ params }: Props) {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();
  const [allEpisodes, origin, location] = await Promise.all([
    getEpisodes().catch(() => null),
    getLocation(character.origin.url).catch(() => null),
    getLocation(character.location.url).catch(() => null),
  ]);
  const episodes = (allEpisodes ?? []).filter((episode) =>
    character.episode.includes(episode.url),
  );
  return (
    <div className="archive-shell min-h-screen">
      <header className="archive-nav">
        <Link className="archive-brand" href="/">
          R/M<span>FIELD ARCHIVE</span>
        </Link>
        <Link href="/">← Volver al archivo</Link>
      </header>
      <main className="archive-main archive-detail">
        <p className="archive-eyebrow">
          FICHA / {String(character.id).padStart(3, "0")}
        </p>
        <h1>{character.name}</h1>
        <div className="archive-detail-grid">
          <Image
            src={character.image}
            alt={character.name}
            width={400}
            height={400}
            className="archive-detail-image"
          />
          <div>
            <h2>Identidad y procedencia</h2>
            <dl className="archive-facts">
              {[
                ["Identificador", String(character.id)],
                ["Nombre", character.name],
                ["Estado", character.status],
                ["Especie", character.species],
                ["Tipo", character.type || "No especificado"],
                ["Género", character.gender],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div>
                <dt>Origen</dt>
                <dd>
                  {character.origin.url ? (
                    <a
                      href={character.origin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {character.origin.name} ↗
                    </a>
                  ) : (
                    character.origin.name
                  )}
                </dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>
                  {character.location.url ? (
                    <a
                      href={character.location.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {character.location.name} ↗
                    </a>
                  ) : (
                    character.location.name
                  )}
                </dd>
              </div>
              <div>
                <dt>Creado en API</dt>
                <dd>
                  <time dateTime={character.created}>
                    {new Intl.DateTimeFormat("es-PE", {
                      dateStyle: "long",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }).format(new Date(character.created))}{" "}
                    UTC
                  </time>
                </dd>
              </div>
              <div>
                <dt>Recurso original</dt>
                <dd>
                  <a
                    href={character.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver respuesta de la API ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt>Imagen original</dt>
                <dd>
                  <a
                    href={character.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver imagen ↗
                  </a>
                </dd>
              </div>
            </dl>
            {((character.origin.url && !origin) || (character.location.url && !location)) && <p className="mt-5 text-sm text-stone-600">La información ampliada de ubicaciones no está disponible temporalmente. El origen y la ubicación del personaje siguen visibles arriba.</p>}
            {[
              ["Lugar de origen", origin],
              ["Ubicación actual", location],
            ].map(
              ([label, place]) =>
                typeof place === "object" &&
                place !== null && (
                  <section className="archive-location" key={String(label)}>
                    <h3>
                      {String(label)} · {place.name}
                    </h3>
                    <p>
                      Tipo: {place.type || "Desconocido"}
                      <br />
                      Dimensión: {place.dimension}
                      <br />
                      {place.residents.length} residentes registrados
                    </p>
                  </section>
                ),
            )}
          </div>
        </div>
        <section className="archive-episodes">
          <div className="archive-results-heading">
            <h2>Apariciones</h2>
            <span>{character.episode.length} episodios</span>
          </div>
          <p className="mb-4 text-sm text-stone-600">{!allEpisodes ? "Los títulos de episodios no están disponibles temporalmente. Puedes consultar sus recursos originales." : ""}</p>
          <ul>
            {!allEpisodes && character.episode.map(url => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">Episodio {url.split("/").at(-1)} ↗</a></li>)}
            {episodes.map((episode) => (
              <li key={episode.id}>
                <a href={episode.url} target="_blank" rel="noopener noreferrer">
                  <span className="episode-code">{episode.episode}</span>
                  <strong>{episode.name}</strong>
                  <span className="episode-date">
                    {episode.air_date} · {episode.characters.length} personajes
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="archive-footer">
        <Link href="/">← Explorar más personajes</Link>
        <span>R/M FIELD ARCHIVE</span>
      </footer>
    </div>
  );
}
