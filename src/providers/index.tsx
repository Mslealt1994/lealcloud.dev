import React from 'react';

import { ThemeProvider } from './Theme';

/**
 * @fileoverview Orquestador central de proveedores de contexto (Context Providers) del lado del cliente.
 * Este componente envuelve el árbol de renderizado global para inyectar capacidades reactivas
 * y estados compartidos (como el sistema de temas) sin transformar el RootLayout en un Client Component.
 * @module Providers/Root
 */

/**
 * Componente contenedor de proveedores globales de la aplicación.
 * * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Nodos hijos (páginas y layouts) que consumirán los contextos.
 * * @returns {JSX.Element} Árbol de componentes envuelto por los proveedores declarados.
 * * @remarks
 * **Patrón de Arquitectura (Next.js App Router):**
 * Este archivo cuenta implícitamente con la directiva de entorno de cliente para manejar estados de React.
 * Al centralizar aquí el `ThemeProvider` (y futuros contextos), evitamos colocar la directiva `'use client'`
 * en el `layout.tsx` raíz, permitiendo que el layout base se siga renderizando e indexando en el servidor (SSR).
 */
export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
