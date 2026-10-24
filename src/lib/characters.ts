import { cache } from "react";
import { unstable_cache } from "next/cache";
import type {
  Character,
  CharacterResponse,
  CharacterLocation,
  Episode,
} from "@/types/character";

const API = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 864000;

async function fetchWithRetry(url: string, options: RequestInit & { next?: { revalidate: number } }) {
  let failure: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      // Un reintento debe consultar al proveedor, no reutilizar una respuesta fallida.
      const requestUrl = new URL(url);
      if (attempt > 0) requestUrl.searchParams.set("_retry", String(attempt));
      const response = await fetch(requestUrl, { ...options, signal: AbortSignal.timeout(20000) });
      if (response.ok) return response;
      // Solo reintenta fallos temporales; una denegación de acceso no se elude.
      if (response.status !== 429 && response.status < 500) {
        throw new Error(`Rick and Morty API: HTTP ${response.status} en ${new URL(url).pathname}${new URL(url).search}.`);
      }
      failure = new Error(`El proveedor respondió HTTP ${response.status}.`);
      if (attempt === 4) return response;
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const seconds = retryAfter ? Number(retryAfter) : NaN;
        const dateDelay = retryAfter ? Date.parse(retryAfter) - Date.now() : NaN;
        const wait = Number.isFinite(seconds) ? seconds * 1000 : Number.isFinite(dateDelay) ? dateDelay : 15000 * (attempt + 1);
        await new Promise(resolve => setTimeout(resolve, Math.max(1000, wait)));
        continue;
      }
    } catch (error) {
      failure = error;
      if (error instanceof Error && error.message.startsWith("Rick and Morty API: HTTP")) throw error;
    }
    if (attempt < 4) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw failure instanceof Error ? failure : new Error("El proveedor no respondió.");
}

export async function getCharacterPage(page = 1): Promise<CharacterResponse> {
  const response = await fetchWithRetry(`${API}?page=${page}`, {
    cache: "force-cache",
    next: { revalidate: TEN_DAYS },
  });
  if (!response.ok)
    throw new Error(`No se pudo cargar la página ${page} de personajes (HTTP ${response.status}).`);
  return response.json();
}

// Usa todas las páginas del proveedor, sin fijar manualmente el total de personajes.
export const getAllCharacters = cache(unstable_cache(async (): Promise<Character[]> => {
  const first = await getCharacterPage();
  const characters = [...first.results];
  for (let page = 2; page <= first.info.pages; page++) {
    // Evita ráfagas contra la API durante la generación de todas las rutas.
    await new Promise(resolve => setTimeout(resolve, 600));
    characters.push(...(await getCharacterPage(page)).results);
  }
  return characters;
}, ["rick-morty-character-index"], { revalidate: TEN_DAYS }));

export async function getCharacter(id: string): Promise<Character | null> {
  if (!/^[1-9]\d{0,6}$/.test(id)) return null;
  return (await getAllCharacters()).find(character => character.id === Number(id)) ?? null;
}

export async function getEpisodes(): Promise<Episode[]> {
  const episodes: Episode[] = [];
  let page = 1;
  let pages = 1;
  do {
    const response = await fetchWithRetry(
      `https://rickandmortyapi.com/api/episode?page=${page}`,
      {
        cache: "force-cache",
        next: { revalidate: TEN_DAYS },
      },
    );
    if (!response.ok)
      throw new Error("No se pudieron consultar los episodios.");
    const data: { info: { pages: number }; results: Episode[] } =
      await response.json();
    pages = data.info.pages;
    episodes.push(...data.results);
    page++;
  } while (page <= pages);
  return episodes;
}

const getLocations = cache(async (): Promise<CharacterLocation[]> => {
  const locations: CharacterLocation[] = [];
  let page = 1;
  let pages = 1;
  do {
    const response = await fetchWithRetry(`https://rickandmortyapi.com/api/location?page=${page}`, {
      cache: "force-cache", next: { revalidate: TEN_DAYS },
    });
    if (!response.ok) throw new Error("No se pudieron consultar las ubicaciones.");
    const data: { info: { pages: number }; results: CharacterLocation[] } = await response.json();
    pages = data.info.pages;
    locations.push(...data.results);
    page++;
  } while (page <= pages);
  return locations;
});

export async function getLocation(url: string): Promise<CharacterLocation | null> {
  if (!/^https:\/\/rickandmortyapi.com\/api\/location\/[1-9]\d*$/.test(url)) return null;
  return (await getLocations()).find(location => location.url === url) ?? null;
}
