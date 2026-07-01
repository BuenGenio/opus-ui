<script setup lang="ts">
/**
 * Right-side slide-over panel. Teleports to <body>, locks background scroll
 * while open, and dismisses on backdrop click or Escape (restoring focus to
 * whatever was focused before it opened). Controlled via `open` + `@close`.
 *
 * @example
 *   <ODrawer :open="editing" title="Edit sensor" eyebrow="Fleet" @close="editing = false">
 *     <SensorForm :id="id" />
 *     <template #footer>
 *       <OButton variant="ghost" @click="editing = false">Cancel</OButton>
 *       <OButton variant="primary" @click="save">Save</OButton>
 *     </template>
 *   </ODrawer>
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        open: boolean;
        title?: string;
        /** Small uppercase label above the title. */
        eyebrow?: string;
        /** Max panel width — any CSS length. */
        width?: string;
        /** Which edge the panel slides from. */
        side?: 'right' | 'left';
        accent?: string;
        /** Disable backdrop-click dismissal (Escape still works). */
        persistent?: boolean;
    }>(),
    { width: '42rem', side: 'right', persistent: false },
);

const emit = defineEmits<{ close: [] }>();

const panel = ref<HTMLElement | null>(null);
let lastActive: HTMLElement | null = null;

function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
        e.preventDefault();
        emit('close');
    }
}

function lock(): void {
    lastActive = (document.activeElement as HTMLElement) ?? null;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
}
function unlock(): void {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
}

watch(
    () => props.open,
    async (val) => {
        if (val) {
            lock();
            await nextTick();
            // Move focus into the panel for keyboard users.
            (panel.value?.querySelector<HTMLElement>('[autofocus], button, a, input, select, textarea') ?? panel.value)?.focus();
        } else {
            unlock();
            lastActive?.focus?.();
            lastActive = null;
        }
    },
);

onBeforeUnmount(() => {
    if (props.open) unlock();
});

function onBackdrop(): void {
    if (!props.persistent) emit('close');
}
</script>

<template>
    <teleport to="body">
        <Transition name="ou-drawer">
            <div
                v-if="open"
                class="ou-drawer"
                :class="`ou-drawer--${side}`"
                :style="accent ? { '--ou-drawer-accent': accent } : undefined"
            >
                <div class="ou-drawer__backdrop" @click="onBackdrop" />
                <aside
                    ref="panel"
                    class="ou-drawer__panel"
                    :style="{ maxWidth: width }"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="title"
                    tabindex="-1"
                >
                    <header v-if="title || eyebrow || $slots.header" class="ou-drawer__header">
                        <slot name="header">
                            <div class="ou-drawer__titles">
                                <p v-if="eyebrow" class="ou-drawer__eyebrow">{{ eyebrow }}</p>
                                <h2 v-if="title" class="ou-drawer__title">{{ title }}</h2>
                            </div>
                        </slot>
                        <button type="button" class="ou-drawer__close" aria-label="Close" @click="emit('close')">✕</button>
                    </header>
                    <div class="ou-drawer__body">
                        <slot />
                    </div>
                    <footer v-if="$slots.footer" class="ou-drawer__footer">
                        <slot name="footer" />
                    </footer>
                </aside>
            </div>
        </Transition>
    </teleport>
</template>

<style scoped>
.ou-drawer {
    --ou-drawer-accent: var(--opus-accent, #6366f1);
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    font-family: var(--opus-font);
}
.ou-drawer--right { justify-content: flex-end; }
.ou-drawer--left { justify-content: flex-start; }

.ou-drawer__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.6);
    backdrop-filter: blur(4px);
}

.ou-drawer__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: color-mix(in srgb, var(--opus-bg, #070b18) 92%, transparent);
    color: var(--opus-fg, #fff);
    box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.65);
}
.ou-drawer--right .ou-drawer__panel { border-left: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1)); }
.ou-drawer--left .ou-drawer__panel { border-right: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1)); }
.ou-drawer__panel:focus { outline: none; }

.ou-drawer__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-shrink: 0;
    padding: 1.1rem 1.5rem;
    border-bottom: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
}
.ou-drawer__eyebrow {
    margin: 0;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ou-drawer-accent);
}
.ou-drawer__title {
    margin: 0.15rem 0 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--opus-fg, #fff);
}
.ou-drawer__close {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: var(--opus-radius-sm, 0.6rem);
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
    cursor: pointer;
    transition: color var(--opus-transition, 150ms), background var(--opus-transition, 150ms);
}
.ou-drawer__close:hover {
    color: var(--opus-fg, #fff);
    background: var(--opus-surface-hover, rgba(255, 255, 255, 0.09));
}

.ou-drawer__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.5rem;
}
.ou-drawer__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-shrink: 0;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
}

/* Transition: backdrop fades, panel slides in from its edge. */
.ou-drawer-enter-active,
.ou-drawer-leave-active { transition: opacity 160ms ease; }
.ou-drawer-enter-active .ou-drawer__panel,
.ou-drawer-leave-active .ou-drawer__panel { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.ou-drawer-enter-from,
.ou-drawer-leave-to { opacity: 0; }
.ou-drawer--right.ou-drawer-enter-from .ou-drawer__panel,
.ou-drawer--right.ou-drawer-leave-to .ou-drawer__panel { transform: translateX(100%); }
.ou-drawer--left.ou-drawer-enter-from .ou-drawer__panel,
.ou-drawer--left.ou-drawer-leave-to .ou-drawer__panel { transform: translateX(-100%); }
</style>
