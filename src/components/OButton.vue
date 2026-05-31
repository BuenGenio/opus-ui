<script setup lang="ts">
/**
 * Button — works as <button>, <a> or any component via `as` (Inertia <Link>,
 * Vue Router <RouterLink>, …). Setting `focused` programmatically focuses
 * the DOM element so D-pad / arrow-key menus work without managing tabindex.
 *
 * @example
 *   <OButton variant="primary" :focused="focusIndex === 0" @click="start">
 *     ▸ Start
 *   </OButton>
 *
 *   <OButton :as="Link" href="/dashboard" variant="secondary">Dashboard</OButton>
 */
import { ref, watch } from 'vue';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
        size?: 'sm' | 'md' | 'lg';
        focused?: boolean;
        block?: boolean;
        disabled?: boolean;
        loading?: boolean;
        accent?: string;
        as?: string | Component;
        href?: string;
        type?: 'button' | 'submit' | 'reset';
    }>(),
    {
        variant: 'primary',
        size: 'md',
        focused: false,
        block: false,
        disabled: false,
        loading: false,
        type: 'button',
    },
);

defineEmits<{ click: [MouseEvent] }>();

const el = ref<HTMLElement | null>(null);
watch(
    () => props.focused,
    (f) => {
        if (f && el.value) el.value.focus();
    },
);

const renderedAs = ((): string | Component => {
    if (props.as) return props.as;
    return props.href ? 'a' : 'button';
})();
const isNativeButton = renderedAs === 'button';
</script>

<template>
    <component
        :is="renderedAs"
        ref="el"
        :href="href"
        @click="$emit('click', $event)"
        :type="isNativeButton ? type : undefined"
        :disabled="isNativeButton ? disabled || loading : undefined"
        :aria-disabled="disabled || loading || undefined"
        class="ou-btn"
        :class="[
            `ou-btn--${variant}`,
            `ou-btn--${size}`,
            {
                'ou-btn--block': block,
                'ou-btn--loading': loading,
                'ou-btn--focused': focused,
                'ou-btn--disabled': disabled || loading,
            },
        ]"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <span v-if="loading" class="ou-btn__spinner" aria-hidden="true" />
        <span class="ou-btn__label"><slot /></span>
    </component>
</template>

<style scoped>
.ou-btn {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    border-radius: var(--opus-radius-md, 0.95rem);
    border: 2px solid transparent;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    transition:
        transform var(--opus-transition, 150ms),
        border-color var(--opus-transition, 150ms),
        background var(--opus-transition, 150ms),
        box-shadow var(--opus-transition, 150ms),
        color var(--opus-transition, 150ms);
}
.ou-btn--block { width: 100%; }

.ou-btn--sm { padding: 0.45rem 0.95rem; font-size: 0.9rem; }
.ou-btn--md { padding: 0.7rem 1.4rem; font-size: 1.05rem; }
.ou-btn--lg { padding: 1rem 2rem; font-size: 1.4rem; }

.ou-btn--primary {
    color: var(--opus-fg, #fff);
    background: var(--opus-surface);
    border-color: var(--opus-border-strong);
}
.ou-btn--primary:hover:not(.ou-btn--disabled),
.ou-btn--primary:focus-visible,
.ou-btn--primary.ou-btn--focused:not(.ou-btn--disabled) {
    border-color: var(--ou-accent);
    background: color-mix(in srgb, var(--ou-accent) 22%, transparent);
    box-shadow:
        0 0 0 4px color-mix(in srgb, var(--ou-accent) 28%, transparent),
        0 0 24px color-mix(in srgb, var(--ou-accent) 42%, transparent);
    transform: translateY(-2px) scale(1.02);
}

.ou-btn--secondary {
    color: var(--opus-fg, #fff);
    background: transparent;
    border-color: var(--opus-border-strong);
}
.ou-btn--secondary:hover:not(.ou-btn--disabled),
.ou-btn--secondary:focus-visible,
.ou-btn--secondary.ou-btn--focused:not(.ou-btn--disabled) {
    border-color: var(--ou-accent);
    background: color-mix(in srgb, var(--ou-accent) 12%, transparent);
}

.ou-btn--ghost {
    color: var(--opus-fg-muted);
    background: transparent;
    border-color: transparent;
}
.ou-btn--ghost:hover:not(.ou-btn--disabled),
.ou-btn--ghost:focus-visible,
.ou-btn--ghost.ou-btn--focused:not(.ou-btn--disabled) {
    color: var(--opus-fg, #fff);
    background: var(--opus-surface);
}

.ou-btn--danger {
    color: var(--opus-danger);
    background: color-mix(in srgb, var(--opus-danger) 10%, transparent);
    border-color: color-mix(in srgb, var(--opus-danger) 35%, transparent);
}
.ou-btn--danger:hover:not(.ou-btn--disabled),
.ou-btn--danger:focus-visible,
.ou-btn--danger.ou-btn--focused:not(.ou-btn--disabled) {
    background: color-mix(in srgb, var(--opus-danger) 25%, transparent);
    border-color: var(--opus-danger);
    color: #fff;
}

.ou-btn:active:not(.ou-btn--disabled) { transform: translateY(0) scale(0.98); }

.ou-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.ou-btn__spinner {
    width: 1em;
    height: 1em;
    border-radius: 9999px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    animation: ou-btn-spin 0.85s linear infinite;
}
@keyframes ou-btn-spin {
    to { transform: rotate(360deg); }
}
</style>
