"use client";
import Link from "next/link";
import "./archive.css";
export default function ArchiveError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="archive-shell min-h-screen">
      <section className="archive-main archive-detail" role="alert">
        <p className="archive-eyebrow">CONEXIÓN INTERRUMPIDA</p>
        <h1>No pudimos consultar el archivo.</h1>
        <p className="archive-intro">
          El proveedor no respondió correctamente. Intenta nuevamente en unos
          momentos.
        </p>
        <button className="archive-button mt-8" onClick={reset}>
          Reintentar
        </button>
        <Link className="ml-6" href="/">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
