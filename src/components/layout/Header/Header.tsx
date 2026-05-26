'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { NAV_LINKS, isNavLinkActive, type NavLink } from '@/config/nav.config';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/utilities/cn';
import './lamp.css';

/**
 * @fileoverview Componente de cabecera flotante principal (Header) con efecto cinético de lámpara (Lamp Effect).
 * Implementa optimizaciones avanzadas de renderizado (Memoization), desacoplamiento de enrutamiento,
 * detección pasiva de desplazamiento de scroll y especificaciones ARIA estrictas para accesibilidad.
 * @module Components/Layout/Header
 */

/**
 * Configuración estructural de las capas de gradientes que componen el efecto óptico de la lámpara.
 * Se definen de forma estática para mitigar la recreación de objetos en el ciclo de vida de React.
 */
const LAMP_LAYERS = [
  {
    key: 'halo',
    style: {
      top: -20,
      width: 480,
      height: 88,
      background:
        'radial-gradient(ellipse 50% 100% at 50% 0%, var(--lamp-halo) 0%, transparent 100%)',
      transform: 'translateX(-50%)',
      willChange: 'transform, opacity',
      animation: 'lampPulse 4s ease-in-out infinite',
      animationDelay: '0s',
    },
  },
  {
    key: 'core',
    style: {
      top: -10,
      width: 320,
      height: 56,
      background:
        'radial-gradient(ellipse 50% 100% at 50% 0%, var(--lamp-core) 0%, transparent 100%)',
      transform: 'translateX(-50%)',
      willChange: 'transform, opacity',
      animation: 'lampPulse 4s ease-in-out infinite',
      animationDelay: '-1.3s',
    },
  },
  {
    key: 'beam',
    style: {
      top: -4,
      width: 120,
      height: 32,
      background:
        'radial-gradient(ellipse 50% 100% at 50% 0%, var(--lamp-beam) 0%, transparent 100%)',
      transform: 'translateX(-50%)',
      willChange: 'transform, opacity',
      animation: 'lampPulse 4s ease-in-out infinite',
      animationDelay: '-2.6s',
    },
  },
  {
    key: 'rim',
    style: {
      top: 17,
      width: '55%',
      height: 1,
      transform: 'translateX(-50%)',
      background:
        'linear-gradient(to right, transparent 0%, var(--lamp-rim) 25%, var(--lamp-rim) 75%, transparent 100%)',
      borderRadius: 1,
      zIndex: 2,
    },
  },
] as const;

/**
 * Subcomponente optimizado que renderiza las capas volumétricas de luz superior.
 * Encapsulado con `memo` para aislarlo por completo de los cambios de estado por scroll o enrutamiento.
 */
const LampEffect = memo(function LampEffect() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
      style={{ width: 520, height: 0, zIndex: 51 }}
    >
      {LAMP_LAYERS.map(({ key, style }) => (
        <div key={key} className="lamp-layer" style={style as CSSProperties} />
      ))}
    </div>
  );
});

/**
 * Subcomponente atómico optimizado que representa un nodo individual en la lista de navegación.
 * Utiliza `aria-current` para informar de manera accesible la página activa actual.
 */
const NavItem = memo(function NavItem({
  link,
  active,
}: {
  link: NavLink;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={link.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative inline-flex items-center px-3.5 py-1.5',
          'rounded-full text-xs font-medium tracking-wide',
          'transition-all duration-200 ease-out',
          'focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:outline-none',
          active
            ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
            : 'text-foreground/80 hover:bg-foreground/10 hover:text-foreground',
        )}
      >
        {link.label}
        {active && (
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--accent)]"
          />
        )}
      </Link>
    </li>
  );
});

/**
 * Componente Header estructural. Controla la barra de navegación tipo píldora flotante.
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Suscripción pasiva al evento scroll de la ventana para mutar sombras y elevación visual
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mapea en una sola operación O(N) indexada los estados activos para evitar re-evaluaciones en el bucle de renderizado
  const activeByHref = useMemo(
    () =>
      Object.fromEntries(
        NAV_LINKS.map((link) => [link.href, isNavLinkActive(pathname, link)]),
      ) as Record<string, boolean>,
    [pathname],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <LampEffect />

      <header
        role="banner"
        className={cn(
          'pointer-events-auto w-full max-w-3xl rounded-full',
          'backdrop-blur-md',
          'transition-all duration-500 ease-out',
          'animate-[navIn_0.6s_cubic-bezier(0.16,1,0.3,1)_both]',
          scrolled &&
            'shadow-[0_8px_32px_-4px_var(--lamp-shadow),0_2px_8px_-2px_oklch(0_0_0/0.10)]',
          !scrolled && 'shadow-[0_4px_16px_-2px_oklch(0_0_0/0.06)]',
        )}
        style={{
          background: 'var(--nav-bg)',
          border: '1px solid var(--nav-border)',
        }}
      >
        <div className="flex h-12 items-center justify-between gap-6 px-5">
          <Link
            href="/"
            aria-label="Ir al inicio"
            className={cn(
              'font-heading shrink-0 text-sm font-black tracking-[0.2em] uppercase',
              'text-foreground/90 transition-colors duration-300 hover:text-[var(--accent)]',
            )}
          >
            lealcloud.dev
          </Link>

          <div
            aria-hidden="true"
            className="bg-foreground/10 h-4 w-px shrink-0"
          />

          <nav aria-label="Navegación principal" className="flex-1">
            <ul
              className="flex items-center justify-center gap-0.5"
              role="list"
            >
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  active={activeByHref[link.href]}
                />
              ))}
            </ul>
          </nav>

          <div
            aria-hidden="true"
            className="bg-foreground/10 h-4 w-px shrink-0"
          />

          <div className="flex shrink-0 items-center">
            <ThemeToggle size={18} />
          </div>
        </div>
      </header>
    </div>
  );
}
