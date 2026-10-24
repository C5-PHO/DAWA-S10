import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export default function CharacterCard({ character }: { character: Character }) {
  return (
    <Link href={`/characters/${character.id}`} className="character-card">
      <div className="character-image">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          loading="lazy"
          sizes="(max-width:640px) 45vw, (max-width:1000px) 30vw, 280px"
        />
      </div>
      <div className="character-caption">
        <p className="character-id">
          DOSSIER / {String(character.id).padStart(3, "0")}
        </p>
        <h2>{character.name}</h2>
        <p className="character-species">{character.species}</p>
        <span className="character-status" data-status={character.status}>
          {character.status === "Alive"
            ? "Con vida"
            : character.status === "Dead"
              ? "Fallecido"
              : "Estado desconocido"}
        </span>
      </div>
    </Link>
  );
}
