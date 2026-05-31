<script setup lang="ts">
/**
 * Priority pill — a tiny colour-coded dot + label. Accepts the four
 * standard levels (`low` / `medium` / `high` / `critical`); unknown
 * values fall back to a neutral dot.
 *
 * @example
 *   <OPriorityBadge priority="high" />
 *   <OPriorityBadge priority="critical" label="Urgent" />
 */
import { computed } from 'vue';

const props = defineProps<{
    priority: string;
    /** Override the displayed label. Defaults to the priority value. */
    label?: string;
}>();

type Level = 'low' | 'medium' | 'high' | 'critical';

const variant = computed<Level | 'neutral'>(() => {
    const p = props.priority.toLowerCase();
    if (p === 'low' || p === 'medium' || p === 'high' || p === 'critical') return p;
    return 'neutral';
});
</script>

<template>
    <span class="ou-priority" :class="`ou-priority--${variant}`">
        <span class="ou-priority__dot" aria-hidden="true" />
        <span class="ou-priority__label">{{ label ?? priority }}</span>
    </span>
</template>

<style scoped>
.ou-priority {
    font-family: var(--opus-font);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: 0.02em;
}
.ou-priority__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    flex-shrink: 0;
}
.ou-priority--low      { color: var(--opus-fg-dim); }
.ou-priority--medium   { color: var(--opus-info); }
.ou-priority--high     { color: var(--opus-warning); }
.ou-priority--critical { color: var(--opus-danger); }
.ou-priority--neutral  { color: var(--opus-fg-muted); }

.ou-priority--low      .ou-priority__dot { background: var(--opus-fg-dim); }
.ou-priority--medium   .ou-priority__dot { background: var(--opus-info); box-shadow: 0 0 8px currentColor; }
.ou-priority--high     .ou-priority__dot { background: var(--opus-warning); box-shadow: 0 0 8px currentColor; }
.ou-priority--critical .ou-priority__dot { background: var(--opus-danger); box-shadow: 0 0 10px currentColor; }
.ou-priority--neutral  .ou-priority__dot { background: var(--opus-fg-dim); }
</style>
