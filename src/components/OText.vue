<script setup lang="ts">
/**
 * Body text with semantic variants. Renders `<p>` by default; pass `as="span"`
 * for inline use.
 *
 * @example
 *   <OText size="lg" variant="lead">A short paragraph for the page intro.</OText>
 *   <OText variant="muted" size="sm">Secondary detail line.</OText>
 *   <OText variant="mono">user@example.com</OText>
 */
withDefaults(
    defineProps<{
        size?: 'xs' | 'sm' | 'md' | 'lg';
        variant?: 'default' | 'muted' | 'dim' | 'mono' | 'lead';
        as?: string;
    }>(),
    {
        size: 'md',
        variant: 'default',
        as: 'p',
    },
);
</script>

<template>
    <component
        :is="as"
        class="ou-text"
        :class="[`ou-text--${size}`, `ou-text--${variant}`]"
    >
        <slot />
    </component>
</template>

<style scoped>
.ou-text {
    font-family: var(--opus-font);
    color: var(--opus-fg, #fff);
    line-height: 1.55;
    margin: 0;
}
.ou-text--xs { font-size: 0.75rem; }
.ou-text--sm { font-size: 0.875rem; }
.ou-text--md { font-size: 1rem; }
.ou-text--lg { font-size: 1.125rem; line-height: 1.5; }

.ou-text--muted { color: var(--opus-fg-muted); }
.ou-text--dim   { color: var(--opus-fg-dim); }
.ou-text--mono  { font-family: var(--opus-font-mono); letter-spacing: 0; }
.ou-text--lead  {
    color: var(--opus-fg-muted);
    font-size: 1.15rem;
    line-height: 1.55;
}
</style>
