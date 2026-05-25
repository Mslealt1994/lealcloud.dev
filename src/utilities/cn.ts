import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @fileoverview Utilidad core para la conciliación y fusión condicional de clases de Tailwind CSS.
 * Resuelve conflictos de especificidad atómica en tiempo de ejecución.
 * @module Lib/Utils
 */

/**
 * Combina múltiples nombres de clases condicionales utilizando `clsx` y resuelve de forma 
 * determinista los conflictos de especificidad de Tailwind CSS mediante `twMerge`.
 * * @param {...ClassValue[]} inputs - Lista de arreglos, objetos, cadenas o expresiones booleanas que representan clases CSS.
 * @returns {string} Una cadena limpia de clases CSS concatenadas y sin colisiones de estilos.
 * * @example
 * // Combinación condicional simple:
 * cn('bg-red-500 p-4', isHovered && 'bg-blue-500')
 * * @example
 * // Resolución de conflictos (Especificidad de Tailwind):
 * // El comportamiento nativo de CSS daría prioridad según el orden del archivo de estilos.
 * // 'twMerge' asegura que la última clase declarada ('p-8') anule y elimine a la anterior ('p-4').
 * cn('p-4 text-white', 'p-8') // Resultado: 'text-white p-8'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}