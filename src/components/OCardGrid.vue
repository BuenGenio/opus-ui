<script setup lang="ts">
/**
 * Responsive grid for OCard / OCardLink children. Pass `cols` as a
 * mobile-first object — missing breakpoints inherit from the previous one.
 *
 * @example
 *   <OCardGrid :cols="{ base: 1, sm: 2, lg: 3, xl: 4 }">
 *     <OCardLink v-for="x in items" :key="x.id" :href="x.href">…</OCardLink>
 *   </OCardGrid>
 */
import { computed } from 'vue';
import type { OuResponsiveCols } from '../types';

const props = withDefaults(
    defineProps<{
        cols?: OuResponsiveCols;
        gap?: string;
    }>(),
    {
        cols: () => ({ base: 1, sm: 2, lg: 3, xl: 4 }),
        gap: '1.25rem',
    },
);

const style = computed(() => {
    const c = props.cols;
    const base = c.base ?? 1;
    const sm = c.sm ?? base;
    const md = c.md ?? sm;
    const lg = c.lg ?? md;
    const xl = c.xl ?? lg;
    return {
        '--ou-grid-gap': props.gap,
        '--ou-grid-base': String(base),
        '--ou-grid-sm': String(sm),
        '--ou-grid-md': String(md),
        '--ou-grid-lg': String(lg),
        '--ou-grid-xl': String(xl),
    } as Record<string, string>;
});
</script>

<template>
    <div class="ou-grid" :style="style">
        <slot />
    </div>
</template>

<style scoped>
.ou-grid {
    display: grid;
    gap: var(--ou-grid-gap);
    grid-template-columns: repeat(var(--ou-grid-base), minmax(0, 1fr));
}
@media (min-width: 640px)  { .ou-grid { grid-template-columns: repeat(var(--ou-grid-sm), minmax(0, 1fr)); } }
@media (min-width: 768px)  { .ou-grid { grid-template-columns: repeat(var(--ou-grid-md), minmax(0, 1fr)); } }
@media (min-width: 1024px) { .ou-grid { grid-template-columns: repeat(var(--ou-grid-lg), minmax(0, 1fr)); } }
@media (min-width: 1280px) { .ou-grid { grid-template-columns: repeat(var(--ou-grid-xl), minmax(0, 1fr)); } }
</style>
