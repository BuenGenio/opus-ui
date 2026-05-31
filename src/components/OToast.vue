<script setup lang="ts">
/**
 * A single toast card. Normally you don't render this directly — drop one
 * <OToastViewport /> at the app root and call `useToast()` from anywhere.
 */
import type { OuToast } from '../types';

defineProps<{ toast: OuToast }>();
defineEmits<{ dismiss: [number] }>();
</script>

<template>
    <div class="ou-toast" :class="`ou-toast--${toast.variant}`" role="status">
        <span v-if="toast.icon" class="ou-toast__icon" aria-hidden="true">{{ toast.icon }}</span>
        <div class="ou-toast__body">
            <strong v-if="toast.title" class="ou-toast__title">{{ toast.title }}</strong>
            <div class="ou-toast__message">{{ toast.message }}</div>
        </div>
        <button
            type="button"
            class="ou-toast__close"
            aria-label="Dismiss notification"
            @click="$emit('dismiss', toast.id)"
        >
            ×
        </button>
    </div>
</template>

<style scoped>
.ou-toast {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border-radius: var(--opus-radius-md, 0.95rem);
    background: color-mix(in srgb, var(--opus-bg) 70%, transparent);
    border: 1px solid var(--opus-border);
    backdrop-filter: blur(12px);
    color: var(--opus-fg);
    min-width: 18rem;
    max-width: 24rem;
    box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.5);
    font-family: var(--opus-font);
}
.ou-toast--success { border-color: color-mix(in srgb, var(--opus-success) 60%, var(--opus-border)); }
.ou-toast--warning { border-color: color-mix(in srgb, var(--opus-warning) 60%, var(--opus-border)); }
.ou-toast--danger  { border-color: color-mix(in srgb, var(--opus-danger) 60%, var(--opus-border)); }
.ou-toast--info    { border-color: color-mix(in srgb, var(--opus-info) 60%, var(--opus-border)); }
.ou-toast--accent  { border-color: color-mix(in srgb, var(--opus-accent) 60%, var(--opus-border)); }

.ou-toast__icon {
    font-size: 1.25rem;
    line-height: 1;
    flex-shrink: 0;
}
.ou-toast__body { flex: 1; min-width: 0; }
.ou-toast__title {
    display: block;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.1rem;
}
.ou-toast__message {
    font-size: 0.875rem;
    color: var(--opus-fg-muted);
    line-height: 1.4;
}
.ou-toast__close {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    line-height: 0.9;
    color: var(--opus-fg-dim);
    cursor: pointer;
    padding: 0 0.25rem;
    flex-shrink: 0;
}
.ou-toast__close:hover { color: var(--opus-fg, #fff); }
</style>
