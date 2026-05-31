<script setup lang="ts">
/**
 * KPI card — big number with a label and an optional trend delta. Drops
 * into OCardGrid alongside other metrics.
 *
 * @example
 *   <OScoreCard label="Revenue" value="$12,400" :trend="14" color="success" />
 *   <OScoreCard label="Open tasks" :value="27" :trend="-3" />
 */
import { computed } from 'vue';

const props = defineProps<{
    label: string;
    value: number | string;
    /** Percent delta. Positive = up arrow + success colour; negative = down arrow + danger. */
    trend?: number;
    /** Override the value colour. Otherwise uses the current accent. */
    color?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
    accent?: string;
}>();

const valueColorClass = computed(() => `ou-score__value--${props.color ?? 'accent'}`);
const trendDir = computed<'up' | 'down' | 'flat'>(() => {
    if (props.trend === undefined || props.trend === 0) return 'flat';
    return props.trend > 0 ? 'up' : 'down';
});
const trendSign = computed(() => (props.trend !== undefined && props.trend > 0 ? '+' : ''));
</script>

<template>
    <div class="ou-score" :style="accent ? { '--ou-accent': accent } : undefined">
        <div class="ou-score__head">
            <span class="ou-score__label">{{ label }}</span>
            <span
                v-if="trend !== undefined"
                class="ou-score__trend"
                :class="`ou-score__trend--${trendDir}`"
            >
                <span aria-hidden="true">{{ trendDir === 'up' ? '▲' : trendDir === 'down' ? '▼' : '·' }}</span>
                {{ trendSign }}{{ trend }}%
            </span>
        </div>
        <div class="ou-score__value" :class="valueColorClass">{{ value }}</div>
        <div v-if="$slots.footer" class="ou-score__footer">
            <slot name="footer" />
        </div>
    </div>
</template>

<style scoped>
.ou-score {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    color: var(--opus-fg);
    padding: 1.25rem;
    border-radius: var(--opus-radius-md, 0.95rem);
    border: 1px solid var(--opus-border);
    background: var(--opus-surface);
}
.ou-score__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}
.ou-score__label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--opus-fg-muted);
}
.ou-score__trend {
    font-size: 0.72rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
.ou-score__trend--up   { color: var(--opus-success); }
.ou-score__trend--down { color: var(--opus-danger); }
.ou-score__trend--flat { color: var(--opus-fg-dim); }

.ou-score__value {
    margin-top: 0.6rem;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    font-family: var(--opus-font-mono);
    line-height: 1.05;
}
.ou-score__value--accent  { color: var(--ou-accent); }
.ou-score__value--success { color: var(--opus-success); }
.ou-score__value--warning { color: var(--opus-warning); }
.ou-score__value--danger  { color: var(--opus-danger); }
.ou-score__value--info    { color: var(--opus-info); }

.ou-score__footer {
    margin-top: 0.6rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--opus-border);
    font-size: 0.75rem;
    color: var(--opus-fg-dim);
}
</style>
