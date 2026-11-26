---
name: y4-web-design-system
description: Apply the y4 Web Design System when creating or refreshing y4 websites and product UI with realistic smoked glass, reflections, metallic highlights, and layered shadows.
metadata:
  short-description: Apply y4 glass, reflection, and shadow language to web UI
---

# y4 Web Design System

Use this skill when a y4 website needs the shared y4 visual language. Start from the product’s existing identity and interaction model, then add the system’s shared material treatment.

## Source of truth

- Read [references/tokens.json](references/tokens.json) for semantic colors, type scale, spacing, radius, breakpoints, and motion values.
- Import or adapt [references/tokens.css](references/tokens.css) at the application’s global style entry point.
- Open [assets/design-sheet.html](assets/design-sheet.html) for interactive examples of foundations, states, and page patterns.
- Use [assets/y4-web-design-system.fig](assets/y4-web-design-system.fig) when a Figma source is useful.

## Applying the system

1. Inspect the existing routes, components, product palette, fonts, light and dark behavior, and the most important task flows before changing styles.
2. Keep the product’s distinctive identity. Choose one y4 accent palette that supports the product, then map its existing primary, muted, border, card, input, ring, and destructive roles to the semantic tokens.
3. Add the material layer to shared surface primitives first. Panels use a subtle radial reflection, a restrained top rim, a dark or light gradient, an inset highlight, and near plus far shadows. Keep the treatment legible at mobile sizes.
4. Use metallic gradients for small, meaningful icon tiles, marks, or controls. Keep the brightest highlight near the upper edge and use a darker lower inset to give the surface depth.
5. Keep hierarchy. Use a high-contrast primary action, a quieter secondary surface, and a tinted accent state for selected navigation. Pair status color with a text label.
6. Keep touch targets at least 44 px. Keep visible field labels, inline error text, keyboard focus rings, and reduced-motion behavior.
7. Adapt page patterns to the product. A dashboard can use a rail on wide layouts and a bottom bar or menu on compact layouts. A focused tool should keep its task in view. A mobile-first app should keep the main action reachable.
8. Test the product’s normal routes and interaction paths. Run its existing lint, typecheck, tests, and production build when available.

## Material recipes

Use these recipes as a starting point and tune them to the host product.

<code>background: radial-gradient(ellipse at 14% 0%, var(--reflection), transparent 68%), linear-gradient(150deg, var(--glass-top), var(--glass-base) 78%);</code>

<code>box-shadow: inset 0 1px var(--glass-inset), 0 2px 5px var(--shadow-near), 0 16px 30px -16px var(--shadow-far);</code>

<code>background: radial-gradient(ellipse at 24% 0%, #ffffffb0, transparent 65%), linear-gradient(155deg, var(--metal-light), var(--metal-base));</code>

<code>box-shadow: inset 0 1px #ffffffb5, inset 0 -2px 4px #27324f36, 0 3px 5px var(--shadow-near);</code>

Do not flatten every element into a glass card. Use the material treatment for hierarchy, keep content areas calm, and avoid decorative textures that reduce contrast or obscure controls.
