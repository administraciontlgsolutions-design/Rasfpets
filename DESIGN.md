---
name: RASF Pets
description: Nutrición natural personalizada y suscripción para mascotas en Concepción, Chile
colors:
  primary: "#ec101d"
  primary-dark: "#c00814"
  primary-light: "#fff0f1"
  background: "#fffaf8"
  foreground: "#181313"
  muted: "#736766"
  line: "#eadfdb"
  card: "#ffffff"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 900
    letterSpacing: "-0.04em"
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "14px 32px"
---

# Design System: RASF Pets

## Overview
RASF Pets es una marca de alimentación natural premium para perros y gatos con sede en Concepción, Chile. La identidad visual combina calidez orgánica, rigor nutricional y una jerarquía enfocada en la conversión directa a través de WhatsApp.

## Colors
- **Primario (#ec101d)**: Reservado exclusivamente para botones de llamada a la acción (CTAs), badges clave y acentos de alta prioridad.
- **Primario Dark (#c00814)**: Estado hover para botones primarios.
- **Primario Soft (#fff0f1)**: Fondos sutiles de badges y tarjetas de comparativa destacada.
- **Fondo General (#fffaf8)**: Crema cálido que aporta cercanía y bienestar natural.
- **Texto Principal (#181313)**: Tinta carbón de alto contraste y legibilidad.
- **Muted (#736766)**: Subtítulos, textos secundarios y explicaciones.
- **Bordes y Líneas (#eadfdb)**: Delimitación suave sin generar ruido visual.

## Typography
- **Fuente Principal**: Geist Sans (`var(--font-geist-sans)`).
- **H1 (Hero)**: Único en la página, 36px–64px, peso 900, tracking ajustado.
- **H2 (Secciones)**: 28px–40px, peso 900, jerarquía visual limpia.
- **H3 / Títulos de Tarjetas**: 18px–24px, peso 700–800.
- **Cuerpo**: 14px–16px, peso 400–500, interlineado generoso (1.5–1.7).

## Layout
- **Mobile First**: Diseño adaptativo desde 375px hasta 1440px.
- **Contenedores**: `max-w-7xl` para grillas generales, `max-w-4xl` para flujos concentrados (Quiz, FAQ).
- **Espaciado**: Secciones separadas con padding generoso (`py-16` / `py-24`).

## Elevation & Depth
- **Bordes sobre sombras**: Se priorizan bordes sutiles `1px solid var(--line)`.
- **Sombras suaves**: `shadow-md` y `shadow-xl` para tarjetas de producto y selector.
- **Efecto Pulso**: Micro-respiración sutil en CTAs principales (`@keyframes cta-pulse`), desactivada en `prefers-reduced-motion`.

## Shapes
- **Bordes redondeados orgánicos**: `rounded-2xl` (16px), `rounded-3xl` (24px) y botones en píldora `rounded-full` (9999px).

## Components
- **Header Minimalista**: Logotipo y un único botón directo a WhatsApp.
- **Selector Interactivo (Quiz)**: Flujo en 3 pasos con cálculo de porción y recomendación.
- **Ficha de Producto**: Selector de formato y modalidad (Saco individual vs. Plan Suscripción -15%).
- **Tabla Comparativa**: Contraste explícito entre alimento tradicional ultraprocesado y nutrición natural RASF.
- **FAQ Acordeón**: 5 respuestas accesibles con animación de altura suave.

## Do's and Don'ts
- **DO**: Usar `#ec101d` únicamente en elementos de acción o conversión.
- **DO**: Respetar `prefers-reduced-motion` en todas las animaciones GSAP y CSS.
- **DO**: Señalizar claramente los datos demostrativos con badges editables.
- **DON'T**: Usar degradados genéricos de tonos incompatibles (morados/azules).
- **DON'T**: Saturar la pantalla con múltiples CTAs que compitan entre sí.
