import type { Metadata } from 'next';
import { Lato, Lexend } from 'next/font/google';
import { baseMetadata } from '@/config/seo';
import './globals.css';

import { Providers } from '@/providers';
import Header from '@/components/layout/Header/Header';

/**
 * @fileoverview Componente de Layout Raíz (RootLayout) del proyecto.
 * Define la estructura HTML base, la estrategia de carga de fuentes optimizadas,
 * la inyección de metadatos globales de SEO y la inicialización del tema visual.
 * * @module App/RootLayout
 */

/**
 * Configuración de la fuente Lato para titulares y elementos destacados.
 * Expone la variable CSS `--font-lato` cargando los pesos regular, bold y black.
 */
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

/**
 * Configuración de la fuente Lexend para el cuerpo de texto principal de la aplicación.
 * Expone la variable CSS `--font-lexend` con optimización de rendimiento en renderizado.
 */
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

/**
 * Metadatos globales de la aplicación (SEO, Robots, OpenGraph).
 * Next.js requiere estrictamente que esta constante sea exportada con el nombre `metadata`.
 * * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata Next.js Metadata API}
 */
export const metadata: Metadata = baseMetadata;

/**
 * Componente Layout principal que envuelve a todas las páginas de la aplicación.
 * * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes o páginas hijas a renderizar dentro del flujo principal.
 * * @returns {JSX.Element} Estructura HTML raíz (`<html>` y `<body>`) con clases globales aplicadas.
 * * @remarks
 * **Efectos Secundarios y Configuración de Plantilla:**
 * 1. **Inyección de Fuentes:** Agrega `--font-lato` y `--font-lexend` al árbol DOM mediante clases CSS variables.
 * Cualquier modificación o adición de fuentes requiere su correspondiente mapeo en `globals.css`.
 * 2. **Inyección de Proveedores Globales:** Envuelve los componentes hijos en `<Providers />`. Este componente
 * actúa como el orquestador del estado global, manejando la persistencia y la inyección dinámica del atributo `data-theme`
 * (Light/Dark mode) para mitigar el FOUC en conjunto con las reglas CSS base.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lato.variable} ${lexend.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
