import Link from "next/link";
import "../../archive.css";
export default function CharacterNotFound() {
  return (
    <main className="archive-shell min-h-screen">
      <div className="archive-main archive-detail">
        <p className="archive-eyebrow">ERROR 404 / ARCHIVO NO DISPONIBLE</p>
        <h1>Este personaje no está en el registro.</h1>
        <p className="archive-intro">
          Comprueba el identificador o vuelve al archivo para continuar
          explorando.
        </p>
        <Link className="archive-button mt-8" href="/">
          Volver al archivo
        </Link>
      </div>
    </main>
  );
}
