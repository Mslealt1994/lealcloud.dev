// src/providers/theme-types.ts

/**
 * @fileoverview Definiciones de tipos, constantes de infraestructura y utilidades defensivas
 * para el sistema de gestión de temas visuales (Light/Dark mode).
 * @module Providers/ThemeTypes
 */

// 1. Definición del Universo de Temas (Inmutable)
/**
 * Representa los estados válidos del tema visual de la aplicación.
 */
export type Theme = 'dark' | 'light';

// 2. Interfaz Limpia para el Contexto (Optimizada para React 19)
/**
 * Interfaz reguladora del contexto del tema.
 */
export interface ThemeContextType {
  theme: Theme | undefined; // Evita el uso de 'null' para reducir la complejidad cognitiva en componentes consumidores.
  setTheme: (theme: Theme | null) => void; // Permite pasar 'null' como señal explícita para restablecer la preferencia del sistema.
}

// 3. Constantes de Infraestructura Interna
/** Clave única de persistencia en el almacenamiento local del navegador. */
export const themeLocalStorageKey = 'lealCloud-theme';
export const defaultTheme: Theme = 'dark'; // Como Arquitecto, puedes elegir tu fallback favorito

// 4. Verificación Defensiva del Entorno (Reemplaza a canUseDOM.ts)
/** Flag booleano que determina si el código se está ejecutando en el hilo del cliente (Navegador). */
export const isClient = typeof window !== 'undefined';

// 5. Guarda de Tipo Segura (Type Guard Mejorada con 'unknown')
/**
 * Predicado de tipo (Type Guard) que evalúa si un valor arbitrario pertenece al universo `Theme`.
 * * @param {unknown} value - Cualquier valor proveniente de fuentes no seguras (ej. LocalStorage).
 * @returns {boolean} `true` si el valor es 'dark' o 'light', de lo contrario `false`.
 * * @example
 * const rawTheme = localStorage.getItem(themeLocalStorageKey);
 * if (themeIsValid(rawTheme)) {
 * // Aquí TypeScript infiere automáticamente que rawTheme es de tipo 'Theme'
 * }
 */
export function themeIsValid(value: unknown): value is Theme {
  if (typeof value !== 'string') return false;
  return ['dark', 'light'].includes(value);
}

// 6. Consulta Segura de Preferencias del Sistema Operativo (Blindada para SSR)
/**
 * Consulta la API `matchMedia` del navegador para obtener la preferencia del sistema operativo.
 * * @returns {Theme} Retorna 'dark' o 'light' según la preferencia del sistema, o `defaultTheme` en SSR.
 * @remarks
 * Esta función está completamente blindada contra errores de referencia de ejecución en el servidor (Node.js).
 */
export const getSystemPreference = (): Theme => {
  if (!isClient) return defaultTheme; // Si está en el servidor, retorna el default de inmediato

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  return mql.matches ? 'dark' : 'light';
};
