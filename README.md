# opus-ui

> Re-usable Vue 3 + Tailwind UI scaffolding — page shells, cards, menus, buttons, typography — extracted from [OpusOS](https://opus.anthill.hk). Drop into any Laravel + Inertia or plain Vue/Vite project.

- **14 components** that compose into the OpusOS look-and-feel
- **Themeable via CSS variables** — no fights with Tailwind specificity
- **Smart-TV friendly** — D-pad input composable + non-broken styles on Tizen / webOS
- **Plug-and-play with Claude Code** — ships a [`CLAUDE.md`](./CLAUDE.md) so agents pick up your project's conventions automatically
- **TypeScript-first**, source-only ESM, no build step in the consumer

---

## Install

```bash
npm install opus-ui
```

Peer dependency: `vue ^3.4`. Works in any Vite-powered Vue 3 project (Laravel + Inertia, Nuxt, plain Vite).

---

## Quick start

```ts
// resources/js/app.ts
import 'opus-ui/tokens.css';       // design tokens (required)
import 'opus-ui/styles.css';       // optional base styles
// ... your usual Vue / Inertia bootstrap
```

```vue
<!-- resources/js/Pages/Home.vue -->
<script setup lang="ts">
import {
  OPageShell, OTopBar,
  OHeading, OText,
  OCardGrid, OCardLink,
  OButton,
} from 'opus-ui';
import { Link } from '@inertiajs/vue3';
</script>

<template>
  <OPageShell accent="#6366f1">
    <template #bar>
      <OTopBar>
        <template #brand><strong>⚡ My App</strong></template>
        <template #actions>
          <OButton :as="Link" href="/login">Sign in</OButton>
        </template>
      </OTopBar>
    </template>

    <OHeading level="1" size="hero" glow balance>Welcome.</OHeading>
    <OText variant="lead" class="mt-3">A short page intro.</OText>

    <OCardGrid class="mt-8" :cols="{ base: 1, md: 2, lg: 3 }">
      <OCardLink :as="Link" href="/dashboard" emoji="📊" accent="#22d3ee">
        <OHeading level="3" size="h3">Dashboard</OHeading>
        <OText variant="muted" size="sm" class="mt-1">Your numbers at a glance.</OText>
      </OCardLink>
      <!-- … -->
    </OCardGrid>
  </OPageShell>
</template>
```

That's the whole API — pick a page pattern, drop in components.

---

## Components

| Layout | Primitives | Navigation | Notifications |
| --- | --- | --- | --- |
| `OPageShell` | `OCard` | `OMenu` (vertical / horizontal) | `OToastViewport` |
| `OTopBar` | `OButton` | `OMenuItem` | `useToast()` |
| `OSidebar` | `OHeading` | `ODropdown` | |
| | `OText` | `OCardGrid` | |
| | `OBadge` | `OCardLink` | |
| | `ODivider` | | |

Composables: `useTvRemote()` (Smart-TV / D-pad input), `useToast()` (notifications).

The full catalogue with props, examples and patterns is in [**CLAUDE.md**](./CLAUDE.md) — written for both humans and AI agents.

---

## Theming

Every visual choice reads from a CSS variable. Override globally on `:root`, per-section on a parent, or per-component via the `accent` prop.

```css
/* resources/css/app.css */
:root {
  --opus-accent: #d946ef;     /* swap the default indigo for fuchsia */
  --opus-radius-md: 1.25rem;  /* rounder cards */
  --opus-font: 'Inter', sans-serif;
}

/* dark / light is built-in: */
body.opus-light { /* tokens auto-swap */ }
```

```vue
<!-- per-component accent -->
<OCardLink accent="#22d3ee">Cyan card</OCardLink>
<OButton accent="#fbbf24">Yellow button</OButton>
```

The complete token surface lives in [`src/tokens.css`](./src/tokens.css).

---

## Tailwind preset (optional)

If you use Tailwind in your project, extend your config with the bundled preset to expose the tokens as utility classes (`bg-opus-surface`, `text-opus-muted`, `rounded-opus-md`, `shadow-opus-glow`, etc.):

```js
// tailwind.config.js
import opusPreset from 'opus-ui/tailwind-preset';

export default {
  presets: [opusPreset],
  content: [
    './resources/**/*.{vue,ts,js,blade.php}',
    './node_modules/opus-ui/src/**/*.{vue,ts}',
  ],
};
```

---

## Laravel + Inertia integration

The package ships ready-to-copy stubs at `node_modules/opus-ui/stubs/`:

| File | Drop into | What it is |
| --- | --- | --- |
| `app.blade.php` | `resources/views/app.blade.php` | Inertia blade entry with the Figtree font preloaded |
| `app.ts` | `resources/js/app.ts` | Inertia bootstrap with opus-ui CSS imports |
| `vite.config.example.js` | `vite.config.js` (root) | Vite config with a Smart-TV-safe build target |
| `tailwind.config.example.js` | `tailwind.config.js` (root) | Tailwind config using the opus-ui preset |

A fresh Laravel + Inertia app reaches "looks like OpusOS" by copying those four files in.

---

## Plug-and-play with Claude Code

Add this single line to your project's root `CLAUDE.md`:

```
@./node_modules/opus-ui/CLAUDE.md
```

Claude Code will then automatically know:

- the conventional **page anatomy** (`<OPageShell>` root, top bar slot, sidebar slot, …)
- the **full component catalogue** with API + examples
- the **page patterns** (landing, dashboard, hub, detail) it should reach for
- the **DO / DON'T** rules (e.g. *don't hardcode colours, always use `:as="Link"` for nav, …*)
- which **APIs are private** (e.g. `_subscribeToast` — use `useToast()` instead)
- Smart-TV browser **gotchas** (e.g. no `ctx.roundRect`, build-target floor)

This means a fresh project using opus-ui starts coherent on day one — Claude won't reinvent a card or guess a colour.

---

## Smart-TV browsers

Components work on Samsung Tizen 5.5+ / LG webOS 5+ (Chromium 69+). Two things to know:

1. **Down-level the JS build** so older Chromium can parse it — the shipped Vite config stub does this:
   ```js
   build: { target: ['es2019', 'chrome69', 'edge79', 'firefox68', 'safari12'] }
   ```
2. **D-pad navigation** — drive menus with `useTvRemote()`. It maps Tizen's `keyCode 10009` and webOS `461` onto `'back'` along with arrow keys / Enter onto `'left'`/`'right'`/`'enter'`, etc.

---

## TypeScript

The package is shipped as TypeScript source. Vite handles compilation in the consumer; no separate build step.

```ts
import type { OuColorVariant, OuResponsiveCols, OuToast, OuRemoteKey } from 'opus-ui';
```

---

## License

MIT
