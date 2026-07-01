<script setup lang="ts">
/**
 * Centered modal dialog. Teleports to <body>, locks background scroll, traps
 * nothing heavier than Escape + backdrop dismissal, and restores focus to the
 * opener on close. Controlled via `open` + `@close`.
 *
 * Compose freely: `#header` (falls back to title/eyebrow), default slot = body,
 * `#footer` for actions. For a ready-made yes/no dialog use `OConfirmModal`.
 *
 * @example
 *   <OModal :open="show" title="Rename vessel" @close="show = false">
 *     <OInput v-model="name" />
 *     <template #footer>
 *       <OButton variant="ghost" @click="show = false">Cancel</OButton>
 *       <OButton variant="primary" @click="save">Save</OButton>
 *     </template>
 *   </OModal>
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        open: boolean;
        title?: string;
        eyebrow?: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
        accent?: string;
        /** Disable backdrop-click dismissal (Escape still works). */
        persistent?: boolean;
        /** Hide the built-in ✕ close button. */
        hideClose?: boolean;
    }>(),
    { size: 'md', persistent: false, hideClose: false },
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
        <Transition name="ou-modal">
            <div
                v-if="open"
                class="ou-modal"
                :style="accent ? { '--ou-modal-accent': accent } : undefined"
            >
                <div class="ou-modal__backdrop" @click="onBackdrop" />
                <div
                    ref="panel"
                    class="ou-modal__panel"
                    :class="`ou-modal__panel--${size}`"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="title"
                    tabindex="-1"
                >
                    <header v-if="title || eyebrow || $slots.header || !hideClose" class="ou-modal__header">
                        <slot name="header">
                            <div class="ou-modal__titles">
                                <p v-if="eyebrow" class="ou-modal__eyebrow">{{ eyebrow }}</p>
                                <h2 v-if="title" class="ou-modal__title">{{ title }}</h2>
                            </div>
                        </slot>
                        <button v-if="!hideClose" type="button" class="ou-modal__close" aria-label="Close" @click="emit('close')">✕</button>
                    </header>
                    <div class="ou-modal__body">
                        <slot />
                    </div>
                    <footer v-if="$slots.footer" class="ou-modal__footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<style scoped>
.ou-modal {
    --ou-modal-accent: var(--opus-accent, #6366f1);
    position: fixed;
    inset: 0;
    z-index: 70;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: var(--opus-font);
}
.ou-modal__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(3, 7, 18, 0.6);
    backdrop-filter: blur(4px);
}
.ou-modal__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: calc(100vh - 3rem);
    background: color-mix(in srgb, var(--opus-bg, #070b18) 92%, transparent);
    color: var(--opus-fg, #fff);
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--opus-radius-lg, 1.35rem);
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.7);
}
.ou-modal__panel--sm { max-width: 24rem; }
.ou-modal__panel--md { max-width: 32rem; }
.ou-modal__panel--lg { max-width: 44rem; }
.ou-modal__panel--xl { max-width: 60rem; }
.ou-modal__panel:focus { outline: none; }

.ou-modal__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-shrink: 0;
    padding: 1.1rem 1.4rem 0.75rem;
}
.ou-modal__eyebrow {
    margin: 0;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ou-modal-accent);
}
.ou-modal__title {
    margin: 0.15rem 0 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--opus-fg, #fff);
}
.ou-modal__close {
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
.ou-modal__close:hover {
    color: var(--opus-fg, #fff);
    background: var(--opus-surface-hover, rgba(255, 255, 255, 0.09));
}
.ou-modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 1.4rem 1.4rem;
}
.ou-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-shrink: 0;
    padding: 1rem 1.4rem;
    border-top: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
}

.ou-modal-enter-active,
.ou-modal-leave-active { transition: opacity 160ms ease; }
.ou-modal-enter-active .ou-modal__panel,
.ou-modal-leave-active .ou-modal__panel { transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1); }
.ou-modal-enter-from,
.ou-modal-leave-to { opacity: 0; }
.ou-modal-enter-from .ou-modal__panel,
.ou-modal-leave-to .ou-modal__panel { transform: translateY(12px) scale(0.98); }
</style>
