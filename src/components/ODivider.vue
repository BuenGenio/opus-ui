<script setup lang="ts">
/**
 * Thin visual separator. Use inside ODropdown panels, between sections in a
 * card, or anywhere a hairline rule looks right.
 *
 * @example
 *   <ODivider />
 *   <ODivider vertical />
 */
withDefaults(
    defineProps<{
        vertical?: boolean;
        /** Override the default margin (e.g. '0' for flush, '1rem' for more breathing room). */
        spacing?: string;
    }>(),
    { vertical: false },
);
</script>

<template>
    <hr
        v-if="!vertical"
        class="ou-divider"
        :style="spacing ? { margin: `${spacing} 0` } : undefined"
        aria-hidden="true"
    />
    <span
        v-else
        class="ou-divider ou-divider--vertical"
        :style="spacing ? { margin: `0 ${spacing}` } : undefined"
        aria-hidden="true"
    />
</template>

<style scoped>
.ou-divider {
    border: none;
    height: 1px;
    background: var(--opus-border, rgba(255, 255, 255, 0.12));
    margin: 0.35rem 0;
}
.ou-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 1em;
    background: var(--opus-border, rgba(255, 255, 255, 0.12));
    margin: 0 0.5rem;
    vertical-align: middle;
}
</style>
