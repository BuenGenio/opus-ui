<script setup lang="ts">
/**
 * "Nothing here yet" placeholder for empty lists, search results, etc.
 * Dashed-border container, an icon slot, title, optional description and
 * an optional CTA button.
 *
 * @example
 *   <OEmptyState
 *     title="No projects yet"
 *     description="Create your first project to start organising work."
 *     action="New project"
 *     @action="createProject"
 *   >
 *     <template #icon>📁</template>
 *   </OEmptyState>
 */
import OButton from './OButton.vue';

defineProps<{
    title: string;
    description?: string;
    action?: string;
    accent?: string;
}>();

defineEmits<{ action: [] }>();
</script>

<template>
    <div class="ou-empty" :style="accent ? { '--ou-accent': accent } : undefined">
        <div class="ou-empty__icon" aria-hidden="true">
            <slot name="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </slot>
        </div>
        <h3 class="ou-empty__title">{{ title }}</h3>
        <p v-if="description" class="ou-empty__desc">{{ description }}</p>
        <OButton
            v-if="action"
            :accent="accent"
            class="ou-empty__cta"
            @click="$emit('action')"
        >
            {{ action }}
        </OButton>
    </div>
</template>

<style scoped>
.ou-empty {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    color: var(--opus-fg, #fff);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
    border: 1px dashed var(--opus-border-strong, rgba(255, 255, 255, 0.18));
    border-radius: var(--opus-radius-lg, 1.35rem);
}
.ou-empty__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    background: var(--opus-surface);
    color: var(--opus-fg-muted);
    font-size: 1.5rem;
    margin-bottom: 0.85rem;
}
.ou-empty__icon svg { width: 1.5rem; height: 1.5rem; }
.ou-empty__title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--opus-fg);
    margin: 0 0 0.25rem;
}
.ou-empty__desc {
    font-size: 0.875rem;
    color: var(--opus-fg-muted);
    margin: 0;
    max-width: 28rem;
    line-height: 1.5;
}
.ou-empty__cta { margin-top: 1.1rem; }
</style>
