<script setup lang="ts">
/**
 * Semantic heading with display sizes. `level` controls the HTML tag (h1-h6,
 * for accessibility), `size` controls the visual treatment — they are
 * independent so you can render `<h1>` with `size="hero"` for landings or
 * `<h2>` with `size="h5"` for compact section labels.
 *
 * @example
 *   <OHeading level="1" size="hero" glow balance>The Arcade</OHeading>
 *   <OHeading level="2" size="h2">Recent activity</OHeading>
 *   <OHeading level="3" size="h5">SETTINGS</OHeading>
 */
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        level?: 1 | 2 | 3 | 4 | 5 | 6;
        size?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
        accent?: string;
        glow?: boolean;
        balance?: boolean;
    }>(),
    {
        level: 2,
        glow: false,
        balance: false,
    },
);

const tag = computed(() => `h${props.level}`);
const sizeClass = computed(() => `ou-heading--${props.size ?? `h${props.level}`}`);
</script>

<template>
    <component
        :is="tag"
        class="ou-heading"
        :class="[sizeClass, { 'ou-heading--glow': glow, 'ou-heading--balance': balance }]"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <slot />
    </component>
</template>

<style scoped>
.ou-heading {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    font-weight: 800;
    color: var(--opus-fg, #fff);
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin: 0;
}
.ou-heading--balance { text-wrap: balance; }
.ou-heading--glow {
    text-shadow: 0 0 32px color-mix(in srgb, var(--ou-accent) 60%, transparent);
}
.ou-heading--hero {
    font-size: clamp(2.5rem, 4vw + 1rem, 4.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
}
.ou-heading--h1 { font-size: clamp(2rem, 2vw + 1rem, 3rem); }
.ou-heading--h2 { font-size: clamp(1.5rem, 1.5vw + 0.75rem, 2.1rem); }
.ou-heading--h3 { font-size: 1.4rem; }
.ou-heading--h4 { font-size: 1.15rem; }
.ou-heading--h5 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--opus-fg-muted);
}
</style>
