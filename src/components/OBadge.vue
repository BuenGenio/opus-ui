<script setup lang="ts">
/**
 * Inline status / category chip.
 *
 * @example
 *   <OBadge variant="success">Live</OBadge>
 *   <OBadge variant="accent" accent="#22d3ee">Beta</OBadge>
 */
withDefaults(
    defineProps<{
        variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
        size?: 'sm' | 'md';
        accent?: string;
    }>(),
    {
        variant: 'neutral',
        size: 'sm',
    },
);
</script>

<template>
    <span
        class="ou-badge"
        :class="[`ou-badge--${variant}`, `ou-badge--${size}`]"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <slot />
    </span>
</template>

<style scoped>
.ou-badge {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    font-weight: 700;
    border-radius: 9999px;
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.04em;
}
.ou-badge--sm { font-size: 0.7rem; padding: 0.3em 0.7em; }
.ou-badge--md { font-size: 0.85rem; padding: 0.4em 0.9em; }

.ou-badge--neutral {
    background: var(--opus-surface);
    color: var(--opus-fg-muted);
    border: 1px solid var(--opus-border);
}
.ou-badge--accent  { background: color-mix(in srgb, var(--ou-accent) 22%, transparent); color: var(--ou-accent); }
.ou-badge--success { background: color-mix(in srgb, var(--opus-success) 22%, transparent); color: var(--opus-success); }
.ou-badge--warning { background: color-mix(in srgb, var(--opus-warning) 22%, transparent); color: var(--opus-warning); }
.ou-badge--danger  { background: color-mix(in srgb, var(--opus-danger) 22%, transparent); color: var(--opus-danger); }
.ou-badge--info    { background: color-mix(in srgb, var(--opus-info) 22%, transparent); color: var(--opus-info); }
</style>
