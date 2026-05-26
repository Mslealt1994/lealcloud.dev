/**
 * @fileoverview Fuente única de verdad (SSoT) para la topología de navegación de la aplicación.
 * Centraliza las estructuras de datos de enrutamiento y provee la lógica determinista de validación
 * de estados activos para componentes independientes de la UI (Header, Footer, Sidebar, etc.).
 * @module Config/Navigation
 */

export interface NavLink {
  /** Ruta o URI destino del enlace (ej. '/projects'). Usa "#" para placeholders o anclas deshabilitadas. */
  href: string;
  /** Etiqueta de texto semántica que se renderizará de forma visible en la interfaz de usuario. */
  label: string;
  /** * Determina si la coincidencia de la ruta actual debe evaluarse de forma literal y estricta.
   * Si es `true`, deshabilita la herencia de estado activo en subrutas.
   */
  exact?: boolean;
}

/**
 * Matriz inmutable de enlaces de navegación principal para la interfaz global.
 * * @remarks
 * Utiliza el operador `as const satisfies` de TypeScript para asegurar que el arreglo y sus
 * propiedades sean tratados como lectura exclusiva (`readonly`) a nivel de literales string,
 * impidiendo mutaciones en tiempo de ejecución pero validando la conformidad con la interfaz `NavLink`.
 */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio', exact: true },
  { href: '/projects', label: 'Proyectos' },
  { href: '/lab', label: 'Laboratorio' },
  { href: '/blog', label: 'Blog' },
] as const satisfies readonly NavLink[];

/**
 * Evalúa mediante precedencia lógica si una ruta actual del navegador (pathname) coincide
 * con un enlace de navegación específico para determinar su estado activo en la interfaz.
 * * @param {string} pathname - La ruta de ubicación actual expuesta por el enrutador (ej. `usePathname()`).
 * @param {NavLink} link - El objeto de configuración del enlace que se desea evaluar.
 * @returns {boolean} `true` si la ruta cumple con los criterios de activación, de lo contrario `false`.
 * * @example
 * // Coincidencia por prefijo (exact: false por defecto):
 * isNavLinkActive('/blog/mi-primer-articulo', { href: '/blog', label: 'Blog' }) // Retorna true
 * * @example
 * // Coincidencia estricta (exact: true):
 * isNavLinkActive('/projects/sistema-core', { href: '/', label: 'Inicio', exact: true }) // Retorna false
 */
export function isNavLinkActive(
  pathname: string,
  { href, exact }: NavLink,
): boolean {
  if (href === '#') return false;
  if (exact) return pathname === href;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
