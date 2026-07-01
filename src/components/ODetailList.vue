<script setup lang="ts">
/**
 * Label / value detail rows — the read-only counterpart to a form. Renders a
 * semantic <dl>. Pass plain `items`, or use the `#value` scoped slot to render
 * rich values (badges, links). Compose inside an `OCard` for a titled panel.
 *
 * @example
 *   <OCard title="Device">
 *     <ODetailList :items="[
 *       { label: 'DevEUI', value: dev.eui },
 *       { label: 'Vessel', value: dev.vessel },
 *       { label: 'Status' },
 *     ]">
 *       <template #value="{ item }">
 *         <OStatusBadge v-if="item.label === 'Status'" :status="dev.status" />
 *         <span v-else>{{ item.value ?? '—' }}</span>
 *       </template>
 *     </ODetailList>
 *   </OCard>
 */
interface DetailItem {
    label: string;
    value?: string | number | null;
}

withDefaults(
    defineProps<{
        items: DetailItem[];
        /** Stack label above value instead of side-by-side. */
        stacked?: boolean;
    }>(),
    { stacked: false },
);
</script>

<template>
    <dl class="ou-detail" :class="{ 'ou-detail--stacked': stacked }">
        <div v-for="item in items" :key="item.label" class="ou-detail__row">
            <dt class="ou-detail__label">{{ item.label }}</dt>
            <dd class="ou-detail__value">
                <slot name="value" :item="item">{{ item.value ?? '—' }}</slot>
            </dd>
        </div>
    </dl>
</template>

<style scoped>
.ou-detail {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    font-family: var(--opus-font);
}
.ou-detail__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.9rem;
}
.ou-detail--stacked .ou-detail__row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.15rem;
}
.ou-detail__label {
    flex-shrink: 0;
    color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42));
}
.ou-detail__value {
    margin: 0;
    text-align: right;
    color: var(--opus-fg, #fff);
    word-break: break-word;
}
.ou-detail--stacked .ou-detail__value { text-align: left; }
</style>
