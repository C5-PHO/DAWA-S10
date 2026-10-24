import Link from "next/link";
import CharacterExplorer from "@/components/characters/CharacterExplorer";
import { getCharacterPage } from "@/lib/characters";
import "./archive.css";

export default async function Home() {
  const initial = await getCharacterPage();
  return (
    <div className="archive-shell min-h-screen">
      <header className="archive-nav">
        <Link className="archive-brand" href="/">
          R/M<span>FIELD ARCHIVE</span>
        </Link>
        <nav aria-label="Navegación principal">
          <a href="#characters">Personajes</a>
          <Link href="/pokemon">Pokédex ↗</Link>
        </nav>
      </header>
      <main className="archive-main">
        <section className="archive-hero">
          <p className="archive-eyebrow">
            RICK AND MORTY / REGISTRO DE PERSONAJES
          </p>
          <div className="archive-hero-row">
            <h1>
              El universo es extraño.
              <br />
              <span>Conoce a sus habitantes.</span>
            </h1>
            <span className="archive-total">
              <strong>{initial.info.count}</strong>IDENTIDADES REGISTRADAS
            </span>
          </div>
          <p className="archive-intro">
            Un archivo de viajeros, criaturas y versiones alternativas.
            <br />
            Explora sus historias, procedencia y apariciones.
          </p>
        </section>
        <div id="characters">
          <CharacterExplorer initial={initial} />
        </div>
      </main>
      <footer className="archive-footer">
        <span>R/M FIELD ARCHIVE · LABORATORIO 10</span>
        <span>Datos de Rick and Morty API</span>
      </footer>
    </div>
  );
}
