import "../archive.css";

export default function LoadingCharacter() {
  return (
    <main className="archive-shell min-h-screen" aria-busy="true">
      <section className="archive-main archive-detail">
        <p className="archive-eyebrow">R/M FIELD ARCHIVE</p>
        <h1 className="text-3xl font-semibold" role="status">Cargando ficha del personaje…</h1>
        <div className="character-skeleton mt-8 max-w-sm" aria-hidden="true" />
      </section>
    </main>
  );
}
