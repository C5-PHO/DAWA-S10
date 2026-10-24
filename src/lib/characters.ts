import type {
  Character,
  CharacterResponse,
  CharacterLocation,
  Episode,
} from "@/types/character";

const API = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 864000;

export async function getCharacterPage(page = 1): Promise<CharacterResponse> {
  const response = await fetch(`${API}?page=${page}`, {
    cache: "force-cache",
    next: { revalidate: TEN_DAYS },
  });
  if (!response.ok)
    throw new Error("No se pudo cargar el archivo de personajes.");
  return response.json();
}

// Usa todas las páginas del proveedor, sin fijar manualmente el total de personajes.
export async function getAllCharacters(): Promise<Character[]> {
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
}

export async function getCharacter(id: string): Promise<Character | null> {
  if (!/^[1-9]\d{0,6}$/.test(id)) return null;
  const response = await fetch(`${API}/${id}`, {
    cache: "force-cache",
    next: { revalidate: TEN_DAYS },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("No se pudo consultar el personaje.");
  return response.json();
}

export async function getEpisodes(): Promise<Episode[]> {
  const episodes: Episode[] = [];
  let page = 1;
  let pages = 1;
  do {
    const response = await fetch(
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

export async function getLocation(
  url: string,
): Promise<CharacterLocation | null> {
  const match =
    /^https:\/\/rickandmortyapi.com\/api\/location\/([1-9]\d*)$/.exec(url);
  if (!match) return null;
  const response = await fetch(
    `https://rickandmortyapi.com/api/location/${match[1]}`,
    {
      cache: "force-cache",
      next: { revalidate: TEN_DAYS },
    },
  );
  if (!response.ok) throw new Error("No se pudo consultar la ubicación.");
  return response.json();
}
