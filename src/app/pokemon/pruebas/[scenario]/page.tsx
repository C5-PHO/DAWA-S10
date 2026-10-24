import { notFound } from "next/navigation";

interface ErrorScenarioProps {
  params: Promise<{ scenario: string }>;
}

// Activa las convenciones reales de Next.js sin alterar la API del ejercicio.
// Estas demostraciones no generan errores intencionales en producción.
export default async function ErrorScenario({ params }: ErrorScenarioProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { scenario } = await params;
  if (scenario === "error") {
    throw new Error("Fallo controlado para comprobar el Error Handler de la Pokédex.");
  }

  notFound();
}
