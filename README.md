# R/M Field Archive

Laboratorio 10 de Desarrollo de Aplicaciones Web Avanzado. Archivo de personajes de Rick and Morty con Next.js App Router, TypeScript, React y Tailwind CSS. Incluye el ejercicio de Pokédex en `/pokemon`.

## Ejecución

```powershell
npm ci
npm run dev
```

Abre http://localhost:3000. La API pública no requiere credenciales.

## Funcionalidades

- Listado inicial generado en el servidor y almacenado en caché.
- Búsqueda CSR por nombre, estado, tipo, género y especie, con paginación, cancelación de solicitudes y espera de 350 ms al escribir.
- Fichas por identificador con todos los campos del personaje: identidad, imagen, estado, especie, tipo, género, origen, ubicación, episodios, URL y fecha de creación.
- Datos relacionados: dimensión, tipo y residentes registrados de las ubicaciones; código, título y fecha de emisión de cada episodio.
- Imágenes con carga bajo demanda; vistas de error, reintento y personaje inexistente.
- Tema claro con esquinas rectas y estilos adaptables a móvil.

## Renderizado y caché

La portada consulta desde un componente de servidor usando `cache: 'force-cache'`. Se prerenderiza durante el build (SSG), por lo que no realiza una consulta al proveedor en cada visita. La búsqueda interactiva usa `useState` y `useEffect` en el navegador para consultar filtros sin recargar la página.

`generateStaticParams` recorre todas las páginas de la API y genera `/characters/[id]` para cada personaje disponible. Las fichas y las consultas del servidor usan ISR de **864000 segundos (10 días)**. Tras ese plazo, nuevas solicitudes pueden provocar la revalidación; no se ejecuta una actualización programada. Los nuevos personajes requieren un nuevo build para incorporarse a los parámetros generados, aunque una ruta nueva puede generarse bajo demanda.

Las fichas mantienen enlaces a los recursos originales. Una dimensión desconocida o un tipo vacío se presentan según los datos del proveedor, sin inventar información.

## Organización

| Ubicación | Responsabilidad |
| --- | --- |
| `src/types/character.ts` | Tipos de personajes, episodios y ubicaciones |
| `src/lib/characters.ts` | Consultas del servidor y caché |
| `src/components/characters/` | Tarjetas y búsqueda interactiva |
| `src/app/characters/[id]/` | Fichas estáticas y Not Found |
| `src/app/archive.css` | Diseño del archivo |
| `src/app/pokemon/` | Pokédex, ISR diario y demostraciones de errores |

## Verificación y producción

```powershell
npm run lint
npx tsc --noEmit
npm run build
npm start
```

Detén `npm run dev` o `npm start` antes de reconstruir el mismo directorio. El build necesita acceso a la API para generar todas las fichas. Para comprobar la tarea, captura la portada, filtros combinados, ficha con episodios y tabla de rutas del build.

Para Vercel, importa `C5-PHO/DAWA-S10`, selecciona Next.js y deja la raíz del proyecto en `./`. No se requieren variables de entorno para estas APIs públicas.

## Referencias

- [Rick and Morty API](https://rickandmortyapi.com/documentation)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

## Movimiento y accesibilidad

`ProjectMotion.tsx` comparte las apariciones al entrar en pantalla entre el archivo de personajes y la Pokédex. Utiliza un observador por ruta, detecta resultados nuevos de búsqueda y libera observadores y animaciones al navegar. El contenido nunca depende de JavaScript para permanecer visible. `motion.css` define las entradas de títulos, estados de carga y transiciones de controles. Se respeta `prefers-reduced-motion`, incluido su cambio mientras la página está abierta. El desplazamiento y los enlaces conservan su comportamiento nativo.
