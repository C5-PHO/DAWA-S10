import Link from "next/link";
import "./archive.css";

export default function NotFound() {
  return (
    <main className="archive-shell min-h-screen">
      <section className="archive-main archive-detail">
        <p className="archive-eyebrow">404 / RUTA FUERA DEL ARCHIVO</p>
        <h1 className="text-4xl font-semibold tracking-tight">Esta página no existe.</h1>
        <p className="archive-intro">Comprueba la dirección o vuelve al archivo de personajes.</p>
        <Link href="/" className="archive-button mt-8">Explorar personajes</Link>
      </section>
    </main>
  );
}
