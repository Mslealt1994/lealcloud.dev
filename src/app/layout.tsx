import type { Metadata } from "next";
import { Lato, Lexend } from "next/font/google";
import "./globals.css";

// 1. Configuración de Lato (Títulos)
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

// 2. Configuración de Lexend (Cuerpo de texto por defecto)
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marlon Leal | Portfolio",
  description: "Software Developer Portfolio & Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lato.variable} ${lexend.variable} h-full`}>
      {/* Mantenemos font-sans aquí; abajo la enlazaremos a Lexend en Tailwind */}
      <body className="min-h-full flex flex-col font-sans antialiased text-[var(--text)] bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
