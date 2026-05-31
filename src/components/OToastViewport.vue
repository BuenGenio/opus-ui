<script setup lang="ts">
/**
 * Single mount point for `useToast()` notifications. Drop one of these at
 * your app root and toasts dispatched anywhere will appear here.
 *
 * @example
 *   // App.vue
 *   <template>
 *     <OPageShell>…</OPageShell>
 *     <OToastViewport position="bottom-right" />
 *   </template>
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { OuToast } from '../types';
import { _subscribeToast } from '../composables/useToast';
import OToast from './OToast.vue';

withDefaults(
    defineProps<{
        position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
        max?: number;
    }>(),
    {
        position: 'bottom-right',
        max: 6,
    },
);

const toasts = ref<OuToast[]>([]);
const timers = new Map<number, number>();

function dismiss(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id);
    const tm = timers.get(id);
    if (tm !== undefined) {
        window.clearTimeout(tm);
        timers.delete(id);
    }
}

let unsub: (() => void) | null = null;
onMounted(() => {
    unsub = _subscribeToast((t) => {
        const next = [...toasts.value, t];
        toasts.value = next.length > 6 ? next.slice(-6) : next;
        if (t.duration > 0) {
            const tm = window.setTimeout(() => dismiss(t.id), t.duration);
            timers.set(t.id, tm);
        }
    });
});
onBeforeUnmount(() => {
    unsub?.();
    for (const tm of timers.values()) {
        window.clearTimeout(tm);
    }
    timers.clear();
});
</script>

<template>
    <Teleport to="body">
        <div class="ou-toast-viewport" :class="`ou-toast-viewport--${position}`">
            <TransitionGroup name="ou-toast" tag="div" class="ou-toast-viewport__list">
                <OToast v-for="t in toasts" :key="t.id" :toast="t" @dismiss="dismiss" />
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.ou-toast-viewport {
    position: fixed;
    z-index: 100;
    pointer-events: none;
}
.ou-toast-viewport__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: auto;
}
.ou-toast-viewport--bottom-right { bottom: 1rem; right: 1rem; }
.ou-toast-viewport--bottom-left  { bottom: 1rem; left: 1rem; }
.ou-toast-viewport--top-right    { top: 1rem; right: 1rem; }
.ou-toast-viewport--top-left     { top: 1rem; left: 1rem; }
.ou-toast-viewport--top-center {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
}
.ou-toast-viewport--bottom-center {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
}

.ou-toast-enter-active,
.ou-toast-leave-active {
    transition: opacity 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
        transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ou-toast-enter-from {
    opacity: 0;
    transform: translateY(18px);
}
.ou-toast-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
.ou-toast-leave-active { position: absolute; }
</style>
