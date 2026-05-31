<script setup lang="ts">
/**
 * Domain status pill. Maps a status string (e.g. 'in_progress', 'paused',
 * 'resolved') to a semantic OBadge variant. Underscores are replaced with
 * spaces and the label is capitalised automatically. Unknown statuses
 * fall back to `neutral`; override the mapping with the `mapping` prop.
 *
 * @example
 *   <OStatusBadge status="in_progress" />
 *   <OStatusBadge status="approved" :mapping="{ approved: 'success' }" />
 */
import { computed } from 'vue';
import OBadge from './OBadge.vue';
import type { OuColorVariant } from '../types';

const props = withDefaults(
    defineProps<{
        status: string;
        size?: 'sm' | 'md';
        mapping?: Record<string, OuColorVariant>;
    }>(),
    { size: 'sm' },
);

const DEFAULTS: Record<string, OuColorVariant> = {
    pending:     'neutral',
    in_progress: 'accent',
    completed:   'success',
    cancelled:   'neutral',
    active:      'accent',
    paused:      'warning',
    archived:    'neutral',
    open:        'danger',
    resolved:    'success',
    dismissed:   'neutral',
    draft:       'warning',
    decided:     'success',
    revisit:     'warning',
};

const variant = computed<OuColorVariant>(() => {
    const key = props.status.toLowerCase();
    return props.mapping?.[key] ?? DEFAULTS[key] ?? 'neutral';
});

const label = computed(() => props.status.replace(/_/g, ' '));
</script>

<template>
    <OBadge :variant="variant" :size="size" class="ou-status">{{ label }}</OBadge>
</template>

<style scoped>
.ou-status { text-transform: capitalize; }
</style>
