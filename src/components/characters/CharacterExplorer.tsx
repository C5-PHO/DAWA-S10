"use client";

import { useEffect, useState } from "react";
import type { CharacterResponse } from "@/types/character";
import CharacterCard from "./CharacterCard";

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
  species: string;
}
const empty: Filters = {
  name: "",
  status: "",
  type: "",
  gender: "",
  species: "",
};

export default function CharacterExplorer({
  initial,
}: {
  initial: CharacterResponse;
}) {
  const [filters, setFilters] = useState(empty);
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const params = new URLSearchParams({ page: String(page) });
  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) params.set(key, value.trim());
  });
  const key = params.toString();
  const active = key !== "page=1";
  const [result, setResult] = useState<{
    key: string;
    data: CharacterResponse | null;
    error: string;
  } | null>(null);
  const loading = active && result?.key !== key;
  const data = active ? (result?.key === key ? result.data : null) : initial;
  const error = active && result?.key === key ? result.error : "";
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/?${key}`,
          { signal: controller.signal },
        );
        if (response.status === 404) {
          setResult({
            key,
            data: {
              info: { count: 0, pages: 0, next: null, prev: null },
              results: [],
            },
            error: "",
          });
          return;
        }
        if (!response.ok)
          throw Error("El servicio no está disponible. Intenta nuevamente.");
        const data: CharacterResponse = await response.json();
        if (!controller.signal.aborted) setResult({ key, data, error: "" });
      } catch (cause) {
        if (!controller.signal.aborted)
          setResult({
            key,
            data: null,
            error:
              cause instanceof Error
                ? cause.message
                : "No se pudo completar la búsqueda.",
          });
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [active, key, attempt]);
  function update(field: keyof Filters, value: string) {
    setFilters((previous) => ({ ...previous, [field]: value }));
    setPage(1);
  }
  function reset() {
    setFilters(empty);
    setPage(1);
  }
  return (
    <>
      <section className="archive-filters" aria-label="Buscar personajes">
        <div>
          <label htmlFor="character-name">Nombre</label>
          <input
            id="character-name"
            value={filters.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Rick, Morty, Summer…"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="character-status">Estado</label>
          <select
            id="character-status"
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="alive">Con vida</option>
            <option value="dead">Fallecido</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>
        <div>
          <label htmlFor="character-type">Tipo</label>
          <input
            id="character-type"
            value={filters.type}
            onChange={(e) => update("type", e.target.value)}
            placeholder="Por ejemplo: Parasite"
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor="character-gender">Género</label>
          <select
            id="character-gender"
            value={filters.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="genderless">Sin género</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>
        <div>
          <label htmlFor="character-species">Especie</label>
          <input
            id="character-species"
            value={filters.species}
            onChange={(e) => update("species", e.target.value)}
            placeholder="Human, Alien…"
            maxLength={100}
          />
        </div>
        <button className="archive-clear" onClick={reset}>
          Limpiar
        </button>
      </section>
      <section
        className="archive-results"
        aria-busy={loading}
        aria-labelledby="results-title"
      >
        <div className="archive-results-heading">
          <h2 id="results-title">
            {active ? "Resultados de exploración" : "Personajes del archivo"}
          </h2>
          <p role="status" aria-live="polite">
            {loading
              ? "Consultando archivo…"
              : `${data?.info.count ?? 0} personajes`}
          </p>
        </div>
        {error && (
          <div className="archive-empty" role="alert">
            <h3>No pudimos consultar el archivo</h3>
            <p>{error}</p>
            <button
              className="archive-button"
              onClick={() => {
                setResult(null);
                setAttempt((a) => a + 1);
              }}
            >
              Reintentar
            </button>
          </div>
        )}
        {loading ? (
          <div className="character-grid" aria-label="Cargando personajes">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="character-skeleton" key={i} />
            ))}
          </div>
        ) : (
          <div className="character-grid">
            {data?.results.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
        {!loading && data?.results.length === 0 && (
          <div className="archive-empty">
            <h3>No hay personajes con esos filtros</h3>
            <p>Prueba otro nombre o cambia las condiciones de búsqueda.</p>
            <button className="archive-button" onClick={reset}>
              Restablecer filtros
            </button>
          </div>
        )}
        {data && data.info.pages > 1 && (
          <nav
            className="archive-pagination"
            aria-label="Páginas de personajes"
          >
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span>
              Página {page} de {data.info.pages}
            </span>
            <button
              disabled={page >= data.info.pages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente →
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
