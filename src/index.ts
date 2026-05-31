/**
 * opus-ui — re-usable Vue 3 + Tailwind UI scaffolding.
 *
 * @see ./CLAUDE.md for the canonical reference (page patterns + component
 *      catalogue + best practices). Consumers should reference that file
 *      from their project's CLAUDE.md so Claude Code picks it up.
 */

// ── Components ─────────────────────────────────────────────────────────
export { default as OBadge } from './components/OBadge.vue';
export { default as OButton } from './components/OButton.vue';
export { default as OCard } from './components/OCard.vue';
export { default as OCardGrid } from './components/OCardGrid.vue';
export { default as OCardLink } from './components/OCardLink.vue';
export { default as ODivider } from './components/ODivider.vue';
export { default as ODropdown } from './components/ODropdown.vue';
export { default as OHeading } from './components/OHeading.vue';
export { default as OMenu } from './components/OMenu.vue';
export { default as OMenuItem } from './components/OMenuItem.vue';
export { default as OPageScaffold } from './components/OPageScaffold.vue';
export { default as OPageShell } from './components/OPageShell.vue';
export { default as OSidebar } from './components/OSidebar.vue';
export { default as OText } from './components/OText.vue';
export { default as OToast } from './components/OToast.vue';
export { default as OToastViewport } from './components/OToastViewport.vue';
export { default as OTopBar } from './components/OTopBar.vue';

// ── Composables ────────────────────────────────────────────────────────
export { useTvRemote, normalizeRemoteKey, type OuRemoteKey } from './composables/useTvRemote';
export { useToast, type ToastApi, type ToastOptions } from './composables/useToast';

// ── Shared types ───────────────────────────────────────────────────────
export type {
    OuColorVariant,
    OuSize,
    OuAs,
    OuResponsiveCols,
    OuToast,
    OuLinkComponent,
} from './types';
