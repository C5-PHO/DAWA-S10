import { cache } from "react";
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
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
      if (response.status !== 429 && response.status < 500) return response;
      failure = new Error(`El proveedor respondió HTTP ${response.status}.`);
      if (attempt === 3) return response;
    } catch (error) { failure = error; }
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  throw failure instanceof Error ? failure : new Error("El proveedor no respondió.");
}

export async function getCharacterPage(page = 1): Promise<CharacterResponse> {
  const response = await fetchWithRetry(`${API}?page=${page}`, {
    cache: "force-cache",
    next: { revalidate: TEN_DAYS },
  });
  if (!response.ok)
    throw new Error("No se pudo cargar el archivo de personajes.");
  return response.json();
}

// Usa todas las páginas del proveedor, sin fijar manualmente el total de personajes.
export const getAllCharacters = cache(async (): Promise<Character[]> => {
  const first = await getCharacterPage();
  const characters = [...first.results];
  for (let start = 2; start <= first.info.pages; start += 4) {
    const pages = await Promise.all(
      Array.from(
        { length: Math.min(4, first.info.pages - start + 1) },
        (_, i) => getCharacterPage(start + i),
      ),
    );
    pages.forEach((page) => characters.push(...page.results));
  }
  return characters;
});

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
