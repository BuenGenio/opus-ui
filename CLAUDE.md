# opus-ui — Claude Code reference

This file is the **canonical reference** for AI agents (Claude Code in particular) working in a project that depends on **opus-ui**. Reading it gives you the full vocabulary needed to build pages, dashboards, forms and games that match the OpusOS design language.

> **For consumers:** add this single line to your project's root `CLAUDE.md` so the conventions are auto-loaded for every Claude Code session:
>
> ```
> @./node_modules/opus-ui/CLAUDE.md
> ```

---

## 1. What this package gives you

A small set of Vue 3 + Tailwind-compatible components that compose into the OpusOS look-and-feel: dark animated background with glow blobs, translucent cards with soft borders, large couch-readable typography, neon accent colours, Smart-TV-friendly focus rings.

Everything is themeable via CSS variables (see §6 Theming). Nothing forces Tailwind on you — components use scoped CSS internally — but a `tailwind-preset` is shipped so consumers can layer utility classes on top.

The package is intentionally minimal. It owns the **scaffolding**: page shell, top bar, sidebar, menus, cards, buttons, typography, toasts. Domain UI (forms, tables, dialogs, modals) is left to the consumer.

---

## 2. Setup check

Before suggesting components in a session, confirm the package is installed:

```bash
npm ls opus-ui
```

If installed, the `tokens.css` import should be present in the project's Vite entry (usually `resources/js/app.ts` for Laravel + Inertia projects):

```ts
import 'opus-ui/tokens.css';
import 'opus-ui/styles.css'; // optional but recommended
```

If those imports are missing, **add them first** before suggesting components — without `tokens.css` the components have no design tokens to read from.

For Laravel + Inertia projects, the package ships ready-made stubs at `node_modules/opus-ui/stubs/`: `app.blade.php`, `app.ts`, `vite.config.example.js`, `tailwind.config.example.js`. Direct the user there.

---

## 3. Page anatomy — top horizontal menu is the default

Every page in an opus-ui project has the same outer shape. **Default nav pattern: a top `<OTopBar>` with a horizontal `<OMenu>` for primary links and an `<ODropdown>` for the user / account menu.** Reach for `<OSidebar>` only when the user explicitly asks for it (deep IA, settings-style apps, kiosks).

```vue
<script setup lang="ts">
import {
  OPageShell, OTopBar, OMenu, OMenuItem,
  ODropdown, ODivider, OButton,
  OHeading, OText, OCardGrid,
} from 'opus-ui';
import { Link } from '@inertiajs/vue3'; // or RouterLink / 'a'
</script>

<template>
  <OPageShell accent="#6366f1">
    <template #bar>
      <OTopBar>
        <template #brand>
          <strong class="text-xl">⚡ AppName</strong>
        </template>

        <!-- Primary nav: a horizontal OMenu -->
        <template #nav>
          <OMenu orientation="horizontal" aria-label="Primary">
            <OMenuItem :as="Link" href="/dashboard">Dashboard</OMenuItem>
            <OMenuItem :as="Link" href="/projects">Projects</OMenuItem>
            <OMenuItem :as="Link" href="/team">Team</OMenuItem>
          </OMenu>
        </template>

        <!-- Right rail: user / account dropdown -->
        <template #actions>
          <ODropdown placement="bottom-end" aria-label="Account">
            <template #trigger="{ open, toggle }">
              <OButton variant="ghost" @click="toggle">
                ⚙ {{ user.name }} {{ open ? '▴' : '▾' }}
              </OButton>
            </template>
            <OMenuItem :as="Link" href="/settings" icon="⚙">Settings</OMenuItem>
            <OMenuItem :as="Link" href="/billing"  icon="💳">Billing</OMenuItem>
            <ODivider />
            <OMenuItem icon="🚪" @click="logout">Sign out</OMenuItem>
          </ODropdown>
        </template>
      </OTopBar>
    </template>

    <OHeading level="1" size="hero" glow balance>Page title</OHeading>
    <OText variant="lead" class="mt-3">One-sentence page description.</OText>

    <OCardGrid class="mt-8">
      <!-- content cards -->
    </OCardGrid>

    <template #footer>
      <small>© AppName · all rights reserved</small>
    </template>
  </OPageShell>
</template>
```

**Why this shape:**
- `<OPageShell>` provides the animated dark gradient + glow + grid background and handles `min-height: 100vh` (or `fixed inset-0` when `fullscreen` is set, for game / kiosk pages).
- All slots (`bar`, `sidebar`, default, `footer`) are optional — empty slots render nothing.
- The `accent` prop sets `--ou-accent` for the whole shell; descendants that opt in (OButton, OCardLink, etc.) glow in that colour on hover/focus.
- `<OMenu orientation="horizontal">` swaps the active-state side rail for a bottom underline so it reads as proper top-bar nav.

---

## 4. Component catalogue

### Layout

| Component | Purpose | Key props |
| --- | --- | --- |
| `<OPageShell>` | **Outer** page wrapper (animated bg, top bar slot, sidebar slot) | `accent`, `glow`, `fullscreen`, `maxWidth`, `padded` |
| `<OPageScaffold>` | **Inner** content scaffold (centered max-width + rounded card; `bare` for full-bleed) | `bare`, `maxWidth`, `padded`, `accent` |
| `<OTopBar>` | Top navigation bar with brand/nav/actions slots | `sticky`, `bordered`, `blur` |
| `<OSidebar>` | Collapsible side rail with header/body/footer slots | `v-model:open`, `width`, `position` |

> **OPageShell vs OPageScaffold** — `OPageShell` is the outer chrome (background, top bar, optional sidebar). `OPageScaffold` is the inner content container: a max-width-centered card that goes inside `OPageShell`'s default slot for narrative pages (settings, forms, profile, articles). Use `<OPageScaffold bare>` when you want centered max-width without the card chrome (dashboards, kanbans, full-bleed lists). Many pages skip `OPageScaffold` entirely and let `OPageShell`'s `maxWidth` + `padded` props do the job — reach for `OPageScaffold` when you want the explicit "content card" visual separation.

### Primitives

| Component | Purpose | Key props |
| --- | --- | --- |
| `<OCard>` | Base rounded translucent surface | `accent`, `padded`, `glow`, `interactive`, `as` |
| `<OButton>` | Button (or link or any tag via `as`) | `variant`, `size`, `focused`, `accent`, `as`, `href`, `loading` |
| `<OHeading>` | Semantic heading with display sizes | `level` (1-6 tag), `size` ('hero'\|'h1'..'h5'), `glow`, `balance` |
| `<OText>` | Body copy variants | `size`, `variant` ('default'\|'muted'\|'dim'\|'mono'\|'lead'), `as` |
| `<OBadge>` | Inline status / category chip | `variant`, `size`, `accent` |
| `<ODivider>` | Hairline rule (horizontal or vertical) | `vertical`, `spacing` |

### Navigation

| Component | Purpose | Key props |
| --- | --- | --- |
| `<OMenu>` | Menu container — vertical (default) or horizontal | `orientation` ('vertical'\|'horizontal'), `as`, `ariaLabel` |
| `<OMenuItem>` | Menu row with icon + label + active state | `href`, `as`, `active`, `focused`, `icon`, `accent` |
| `<ODropdown>` | Click-to-open popover menu (user menu, action menu, …) | `placement` ('bottom-end' default), `open` (v-model), `offset`, `closeOnItemClick`, `minWidth` |
| `<OCardGrid>` | Mobile-first responsive grid | `cols` (`{base,sm,md,lg,xl}`), `gap` |
| `<OCardLink>` | Clickable card with icon + body + cta | `href`, `as`, `accent`, `focused`, `emoji`, `external` |

### Notifications

| Component / Composable | Purpose |
| --- | --- |
| `<OToastViewport>` | Single mount point — drop one at app root |
| `<OToast>` | The single toast card (rendered by Viewport, not used directly) |
| `useToast()` | Toast API: `show`/`info`/`success`/`warning`/`danger` |

### Composables

| Composable | Purpose |
| --- | --- |
| `useTvRemote(handler, opts?)` | Normalised D-pad/keyboard input for Smart-TV apps. Maps `ArrowLeft`/`ArrowRight`/`Enter`/Tizen 10009/webOS 461 onto `'left'`/`'right'`/`'enter'`/`'back'`. |
| `useToast()` | Returns the toast API |

---

## 5. Page patterns

Use these as templates. Adapt the content; keep the structure.

### 5.1 Marketing / landing page

```vue
<template>
  <OPageShell accent="#6366f1">
    <template #bar>
      <OTopBar>
        <template #brand><strong>⚡ AppName</strong></template>
        <template #actions>
          <OButton variant="ghost" :as="Link" href="/login">Sign in</OButton>
          <OButton :as="Link" href="/register">Get started</OButton>
        </template>
      </OTopBar>
    </template>

    <div class="text-center pt-12">
      <OHeading level="1" size="hero" glow balance>
        The app that turns reflection into leverage.
      </OHeading>
      <OText variant="lead" class="mt-4 mx-auto max-w-2xl">
        A short, balanced sentence describing what the product does.
      </OText>
      <div class="mt-8 flex justify-center gap-3">
        <OButton size="lg" :as="Link" href="/register">Get started ▸</OButton>
        <OButton size="lg" variant="secondary" :as="Link" href="#features">Learn more</OButton>
      </div>
    </div>

    <OCardGrid class="mt-16" :cols="{ base: 1, md: 3 }">
      <OCard v-for="f in features" :key="f.title" accent="#6366f1">
        <OHeading level="3" size="h3">{{ f.title }}</OHeading>
        <OText variant="muted" class="mt-2">{{ f.body }}</OText>
      </OCard>
    </OCardGrid>
  </OPageShell>
</template>
```

### 5.2 Dashboard (top horizontal menu — preferred default)

```vue
<template>
  <OPageShell accent="#6366f1">
    <template #bar>
      <OTopBar>
        <template #brand><strong>⚡ AppName</strong></template>
        <template #nav>
          <OMenu orientation="horizontal" aria-label="Primary">
            <OMenuItem :as="Link" href="/" :active="$page.url === '/'">Home</OMenuItem>
            <OMenuItem :as="Link" href="/tasks" :active="$page.url === '/tasks'">Tasks</OMenuItem>
            <OMenuItem :as="Link" href="/insights" :active="$page.url === '/insights'">Insights</OMenuItem>
          </OMenu>
        </template>
        <template #actions>
          <ODropdown placement="bottom-end" aria-label="Account">
            <template #trigger="{ open, toggle }">
              <OButton variant="ghost" @click="toggle">
                ⚙ {{ user.name }} {{ open ? '▴' : '▾' }}
              </OButton>
            </template>
            <OMenuItem :as="Link" href="/settings" icon="⚙">Settings</OMenuItem>
            <OMenuItem :as="Link" href="/billing"  icon="💳">Billing</OMenuItem>
            <ODivider />
            <OMenuItem icon="🚪" @click="logout">Sign out</OMenuItem>
          </ODropdown>
        </template>
      </OTopBar>
    </template>

    <OHeading level="1" size="h1">Dashboard</OHeading>
    <OText variant="muted">An overview of your activity.</OText>

    <OCardGrid class="mt-6" :cols="{ base: 1, sm: 2, lg: 4 }">
      <OCard v-for="s in stats" :key="s.label" :accent="s.accent">
        <OHeading level="3" size="h5">{{ s.label }}</OHeading>
        <p class="font-mono text-3xl font-black mt-1">{{ s.value }}</p>
        <OText variant="dim" size="xs" class="mt-1">{{ s.delta }}</OText>
      </OCard>
    </OCardGrid>
  </OPageShell>
</template>
```

### 5.3 Dashboard with sidebar (alternate — for deep IA or kiosk layouts)

```vue
<template>
  <OPageShell>
    <template #bar>
      <OTopBar><template #brand><strong>⚡ AppName</strong></template></OTopBar>
    </template>

    <template #sidebar>
      <OSidebar :open="true">
        <OMenu aria-label="Main">
          <OMenuItem :as="Link" href="/" icon="🏠" :active="$page.url === '/'">Home</OMenuItem>
          <OMenuItem :as="Link" href="/tasks" icon="✓" :active="$page.url === '/tasks'">Tasks</OMenuItem>
          <OMenuItem :as="Link" href="/insights" icon="📊" :active="$page.url === '/insights'">Insights</OMenuItem>
          <OMenuItem :as="Link" href="/settings" icon="⚙">Settings</OMenuItem>
        </OMenu>
      </OSidebar>
    </template>

    <OHeading level="1" size="h1">Dashboard</OHeading>
    <OText variant="muted">An overview of your activity.</OText>

    <OCardGrid class="mt-6" :cols="{ base: 1, sm: 2, lg: 4 }">
      <OCard v-for="s in stats" :key="s.label" :accent="s.accent">
        <OHeading level="3" size="h5">{{ s.label }}</OHeading>
        <p class="font-mono text-3xl font-black mt-1">{{ s.value }}</p>
        <OText variant="dim" size="xs" class="mt-1">{{ s.delta }}</OText>
      </OCard>
    </OCardGrid>
  </OPageShell>
</template>
```

### 5.4 Hub / launcher (the OpusOS Games arcade pattern)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { OPageShell, OHeading, OText, OCardGrid, OCardLink, useTvRemote } from 'opus-ui';
import { Link, router } from '@inertiajs/vue3';

const games = [/* { slug, title, tagline, emoji, accent } */];
const focus = ref(0);

useTvRemote((key) => {
  const n = games.length;
  if (key === 'right' || key === 'down') focus.value = (focus.value + 1) % n;
  else if (key === 'left' || key === 'up') focus.value = (focus.value - 1 + n) % n;
  else if (key === 'enter') router.visit(`/games/${games[focus.value].slug}`);
});
</script>

<template>
  <OPageShell fullscreen accent="#6366f1">
    <div class="text-center pt-8">
      <OHeading level="1" size="hero" glow>🕹️ The Arcade</OHeading>
      <OText variant="lead">Pick something to play.</OText>
    </div>
    <OCardGrid class="mt-10" :cols="{ base: 1, sm: 2, lg: 4 }">
      <OCardLink
        v-for="(g, i) in games"
        :key="g.slug"
        :as="Link"
        :href="`/games/${g.slug}`"
        :accent="g.accent"
        :focused="focus === i"
        :emoji="g.emoji"
        @mouseenter="focus = i"
      >
        <OHeading level="3" size="h3">{{ g.title }}</OHeading>
        <OText variant="muted" size="sm" class="mt-1">{{ g.tagline }}</OText>
      </OCardLink>
    </OCardGrid>
  </OPageShell>
</template>
```

### 5.5 Detail / settings page

```vue
<template>
  <OPageShell>
    <template #bar>…</template>

    <div class="mb-8">
      <OHeading level="1" size="h1">Account settings</OHeading>
      <OText variant="muted">Manage your profile and preferences.</OText>
    </div>

    <div class="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <OMenu aria-label="Settings sections">
        <OMenuItem href="#profile" icon="👤" active>Profile</OMenuItem>
        <OMenuItem href="#security" icon="🔒">Security</OMenuItem>
        <OMenuItem href="#billing" icon="💳">Billing</OMenuItem>
      </OMenu>

      <OCard padded="lg">
        <OHeading level="2" size="h3">Profile</OHeading>
        <OText variant="muted" class="mt-1">
          Update your name and avatar.
        </OText>
        <!-- form … -->
      </OCard>
    </div>
  </OPageShell>
</template>
```

---

## 6. Theming

Every visual choice reads from a CSS variable. Override per-app by re-declaring the variable on `:root`, or per-section by setting it on a parent element / via the component's `accent` prop.

The complete token surface (defined in `src/tokens.css`):

```
--opus-bg                 page background
--opus-bg-gradient        background gradient (radial glow + base)
--opus-surface            card / panel background
--opus-surface-hover      hover variant
--opus-border             1-px subtle border
--opus-border-strong      2-px stronger border
--opus-fg                 default foreground
--opus-fg-muted           secondary text
--opus-fg-dim             tertiary text
--opus-accent             current accent (override per page/section)
--opus-accent-fg          text on accent backgrounds
--opus-success/-warning/-danger/-info   semantic state
--opus-radius-sm/-md/-lg  corner radii
--opus-font               default sans
--opus-font-mono          monospace
--opus-glow               default focus glow shadow
--opus-glow-strong        stronger focus glow
--opus-transition         default transition duration (150ms)
```

**Per-page accent** — pass `accent` to `<OPageShell>` and it cascades:

```vue
<OPageShell accent="#22d3ee"> ... </OPageShell>
```

**Per-component accent** — every interactive component takes an `accent` prop:

```vue
<OButton accent="#f472b6">Special action</OButton>
<OCardLink accent="#34d399" emoji="🌍"> ... </OCardLink>
```

**Light theme** — apply `.opus-light` on a parent:

```html
<body class="opus-light">…</body>
```

---

## 7. Best practices (DO / DON'T)

### DO

- ✅ **Always start a page with `<OPageShell>`.** Don't roll your own background gradient.
- ✅ **Default top-level navigation to a horizontal `<OMenu orientation="horizontal">` in `<OTopBar>`** + an `<ODropdown>` for the user/account menu. That's the canonical opus-ui pattern. `<OSidebar>` is for deep IA / kiosk layouts — use it only when explicitly asked.
- ✅ **Use `<OHeading level=… size=…>` not bare `<h1>`** — `level` is for semantics, `size` for visual scale, and they're independent so `<h1 size="h5">` is fine when SEO needs an h1 but visually it's a label.
- ✅ **Use `<OText variant="lead">` for the one-sentence intro under a page heading.**
- ✅ **Pass `:as="Link"`** (from `@inertiajs/vue3`) on any clickable component when in an Inertia app — that's what makes navigation SPA-fast. Vue Router projects pass `RouterLink`.
- ✅ **Set `accent` per section** to differentiate areas (the arcade does this — each game has a distinct accent).
- ✅ **Use `useTvRemote`** instead of hand-rolling keyboard listeners for menus — it handles Tizen/webOS back-key codes that plain `keydown` misses.
- ✅ **Put `<OToastViewport />` in your root layout exactly once** — call `useToast()` from anywhere; it just works.
- ✅ **Compose freely with Tailwind utilities** for spacing & layout (`class="mt-8 grid gap-6"`). The preset exposes `bg-opus-surface`, `text-opus-muted`, `rounded-opus-md`, etc.

### DON'T

- ❌ **Don't hardcode colours** in component code (`color: #fff`). Use tokens: `color: var(--opus-fg)`.
- ❌ **Don't write your own card div** — use `<OCard>` or `<OCardLink>` so the styling stays consistent.
- ❌ **Don't reach for `<OSidebar>` reflexively** for new pages. The horizontal top-bar nav is the default; sidebars are for genuinely deep IA.
- ❌ **Don't build a hand-rolled menu popover.** Use `<ODropdown>` — outside-click close, Escape, arrow-key nav and focus return to trigger are all wired up.
- ❌ **Don't bypass `<OPageShell>`** with a top-level `<div class="bg-…">`. The shell handles the animated background and z-index layering.
- ❌ **Don't use `<button @click="$inertia.visit(...)">`** for nav — use `<OCardLink :as="Link" :href="...">` or `<OButton :as="Link" :href="...">` so anchors stay anchors (right-click "open in new tab" works, prefetch works, accessibility tree is correct).
- ❌ **Don't reach into `_subscribeToast`** — it's private. Use `useToast()` and `<OToastViewport>`.
- ❌ **Don't use `roundRect` in canvas code** if you support Smart-TV browsers — older Chromium versions throw on it. Stick to `fillRect` + `arc`.

---

## 8. TypeScript notes

- The package is shipped as TypeScript source (`.ts` and `.vue`). Vite + `@vitejs/plugin-vue` + `vue-tsc` compile it in the consumer project — no separate build step.
- `strict` mode is fully supported.
- Common types are re-exported from the package root: `OuColorVariant`, `OuSize`, `OuResponsiveCols`, `OuToast`, `OuLinkComponent`.
- Components that accept an `as` prop type it as `string | Component`. Pass Inertia's `Link`, Vue Router's `RouterLink`, or any Vue component.

---

## 9. Browser support

- Modern evergreen browsers, fully.
- **Smart TVs** — the components work on Tizen 5.5+ / webOS 5+ (Chromium 69+). To support those, the consumer's Vite build target must be down-levelled — the shipped `stubs/vite.config.example.js` shows how (`target: ['chrome69', 'edge79', 'firefox68', 'safari12']`).
- `color-mix()` (used for accent tints) degrades gracefully on older browsers — the colour just won't tint, but layouts stay intact.

---

## 10. When the user asks for a new page

1. Start from one of the §5 patterns.
2. Pick an accent that reflects the page's purpose (calm pages: indigo `#6366f1` or cyan `#22d3ee`; alert pages: danger token).
3. Compose with the catalogue components — don't re-implement primitives.
4. If you need something not in the catalogue (form input, dialog, table), build it as a regular Vue component in the consumer project but follow the same conventions: read CSS variables, stick to the radii / typography tokens, use `OButton` / `OCard` as building blocks.

If something feels missing from the catalogue, ask the user before reinventing — opus-ui is small on purpose, and the right answer is often to extend it.
