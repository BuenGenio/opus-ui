<script setup lang="ts">
/**
 * Inner page content scaffold — centers content within a max-width and
 * wraps it in a rounded card (or skips the card with `bare`). Drop inside
 * an OPageShell's default slot when you want the classic OpusOS
 * "translucent card on the animated background" page treatment.
 *
 * Use `bare` for full-bleed layouts (dashboards, kanbans, calendars) that
 * still want centered max-width but no surrounding card.
 *
 * @example narrative page (settings, profile, forms)
 *   <OPageShell>
 *     <template #bar><OTopBar>…</OTopBar></template>
 *     <OPageScaffold max-width="48rem">
 *       <OHeading level="1" size="h1">Settings</OHeading>
 *       <OText variant="muted">…</OText>
 *     </OPageScaffold>
 *   </OPageShell>
 *
 * @example full-bleed dashboard
 *   <OPageShell :padded="false">
 *     <template #bar><OTopBar>…</OTopBar></template>
 *     <OPageScaffold bare max-width="96rem" padded="lg">
 *       <OCardGrid :cols="{ base: 1, lg: 4 }">…</OCardGrid>
 *     </OPageScaffold>
 *   </OPageShell>
 */
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        /** Skip the card chrome — only apply the max-width centering. */
        bare?: boolean;
        /** Any CSS length. Default `72rem` (same as OPageShell). */
        maxWidth?: string;
        /** Inner padding. `true` = md. Default `true`. */
        padded?: boolean | 'sm' | 'md' | 'lg';
        accent?: string;
    }>(),
    {
        bare: false,
        maxWidth: '72rem',
        padded: true,
    },
);

const paddedClass = computed(() => {
    if (!props.padded) return '';
    return props.padded === true
        ? 'ou-scaffold__inner--padded-md'
        : `ou-scaffold__inner--padded-${props.padded}`;
});

const wrapperStyle = computed(() => {
    const s: Record<string, string> = { '--ou-scaffold-max': props.maxWidth };
    if (props.accent) s['--ou-accent'] = props.accent;
    return s;
});
</script>

<template>
    <div class="ou-scaffold" :style="wrapperStyle">
        <div
            v-if="!bare"
            class="ou-scaffold__card ou-scaffold__inner"
            :class="paddedClass"
        >
            <slot />
        </div>
        <div v-else class="ou-scaffold__bare ou-scaffold__inner" :class="paddedClass">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.ou-scaffold {
    --ou-scaffold-max: 72rem;
    --ou-accent: var(--opus-accent, #6366f1);
    width: 100%;
    max-width: var(--ou-scaffold-max);
    margin-left: auto;
    margin-right: auto;
    font-family: var(--opus-font);
    color: var(--opus-fg, #fff);
}
.ou-scaffold__card {
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--opus-radius-lg, 1.35rem);
    overflow: hidden;
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.3),
        0 20px 50px -12px rgba(0, 0, 0, 0.45);
}
.ou-scaffold__inner--padded-sm { padding: 1rem; }
.ou-scaffold__inner--padded-md { padding: 1.5rem; }
.ou-scaffold__inner--padded-lg { padding: 2.5rem; }

@media (min-width: 1024px) {
    .ou-scaffold__inner--padded-md { padding: 2rem; }
    .ou-scaffold__inner--padded-lg { padding: 3rem; }
}
</style>
