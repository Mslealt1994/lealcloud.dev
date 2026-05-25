// src/providers/ThemeProvider.tsx
'use client';

import React, {
  createContext,
  useCallback,
  use,
  useEffect,
  useState,
} from 'react';

import {
  type Theme,
  type ThemeContextType,
  themeLocalStorageKey,
  defaultTheme,
  isClient,
  themeIsValid,
  getSystemPreference,
} from '../theme-types';

/**
 * @fileoverview Orquestador reactivo del estado del tema (ThemeProvider).
 * Administra el ciclo de vida, la persistencia en almacenamiento local y la sincronización
 * del atributo `data-theme` en el nodo raíz del DOM, totalmente compatible con Next.js SSR.
 * @module Providers/ThemeProvider
 */

// 1. Estado inicial por defecto del contexto (Null Object Pattern para evitar excepciones)
const initialContext: ThemeContextType = {
  theme: undefined,
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialContext);

// 2. Algoritmo secuencial de resolución de tema (Garantiza consistencia y mitiga el FOUC)
function resolveTheme(): Theme {
  if (!isClient) return defaultTheme;

  // Prioridad 1: Inspeccionar si el HTML ya viene con un tema inyectado por el script crítico (FOUC Protection)
  const fromDom = document.documentElement.getAttribute('data-theme');
  if (themeIsValid(fromDom)) return fromDom;

  // Prioridad 2: Recuperar la última selección explícita guardada por el usuario
  const preference = window.localStorage.getItem(themeLocalStorageKey);
  if (themeIsValid(preference)) return preference;

  // Prioridad 3: Adoptar la preferencia del sistema operativo (Fallback dinámico final)
  return getSystemPreference();
}

// 3. Componente Proveedor Principal
/**
 * Proveedor de contexto encargado de inyectar el estado del tema y suspender de forma segura
 * el renderizado visual hasta validar el entorno de ejecución.
 */

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicialización diferida (Lazy evaluation): Se monta en 'undefined' para simular el estado de servidor
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);

  // Efecto de sincronización post-montaje: Resuelve el tema en el cliente evitando el Hydration Mismatch
  useEffect(() => {
    setThemeState(resolveTheme());
  }, []);

  // Mutador reactivo encargado de persistir y propagar el nuevo estado visual
  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (!isClient) return;

    if (themeToSet === null) {
      // Evento de reset: Restablece el ecosistema a las preferencias del sistema operativo
      window.localStorage.removeItem(themeLocalStorageKey);
      const systemTheme = getSystemPreference();
      document.documentElement.setAttribute('data-theme', systemTheme);
      setThemeState(systemTheme);
    } else {
      // Selección explícita: Almacena la preferencia del usuario y muta el árbol DOM
      window.localStorage.setItem(themeLocalStorageKey, themeToSet);
      document.documentElement.setAttribute('data-theme', themeToSet);
      setThemeState(themeToSet);
    }
  }, []);

  // Mecanismo defensivo de resguardo: Asegura la coincidencia atómica entre el estado de React y el atributo del DOM
  useEffect(() => {
    if (!isClient || !theme) return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sintaxis moderna de React 19 para la provisión de contextos (<Context> en lugar de <Context.Provider>)
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
};

// 4. Hook de consumo optimizado para React 19
/**
 * Hook de alto nivel para consumir el estado y mutador del tema actual.
 * Utiliza la nueva función nativa `use` de React 19 para un desempaquetado de contexto eficiente.
 * * @returns {ThemeContextType} Conjunto de propiedades { theme, setTheme }.
 */
export const useTheme = (): ThemeContextType => use(ThemeContext);
