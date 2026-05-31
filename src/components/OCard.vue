<script setup lang="ts">
/**
 * Base card — a rounded translucent surface. Compose freely via slots.
 * Pass `accent` to drive `--ou-accent`, which controls hover/focus glow on
 * interactive children (OButton, OCardLink, etc.) nested inside.
 *
 * @example
 *   <OCard accent="#22d3ee" padded glow>
 *     <OHeading level="3" size="h3">Stats</OHeading>
 *     <OText muted>Last 30 days</OText>
 *   </OCard>
 */
withDefaults(
    defineProps<{
        accent?: string;
        padded?: boolean | 'sm' | 'md' | 'lg';
        glow?: boolean;
        interactive?: boolean;
        as?: string;
    }>(),
    {
        padded: true,
        glow: false,
        interactive: false,
        as: 'div',
    },
);
</script>

<template>
    <component
        :is="as"
        class="ou-card"
        :class="[
            { 'ou-card--glow': glow, 'ou-card--interactive': interactive },
            padded === true ? 'ou-card--padded-md' : padded ? `ou-card--padded-${padded}` : '',
        ]"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <slot />
    </component>
</template>

<style scoped>
.ou-card {
    --ou-accent: var(--opus-accent, #6366f1);
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--opus-radius-md, 0.95rem);
    color: var(--opus-fg, #fff);
    transition:
        border-color var(--opus-transition, 150ms),
        background var(--opus-transition, 150ms),
        box-shadow var(--opus-transition, 150ms);
}
.ou-card--padded-sm { padding: 0.75rem; }
.ou-card--padded-md { padding: 1rem; }
.ou-card--padded-lg { padding: 1.5rem; }
.ou-card--glow { box-shadow: var(--opus-glow, 0 0 28px rgba(99, 102, 241, 0.3)); }
.ou-card--interactive { cursor: pointer; }
.ou-card--interactive:hover,
.ou-card--interactive:focus-within {
    border-color: var(--ou-accent);
    background: var(--opus-surface-hover, rgba(255, 255, 255, 0.09));
}
</style>
