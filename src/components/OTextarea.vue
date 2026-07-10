<script setup lang="ts">
/**
 * Multi-line text input — `v-model` on the value. Same token-driven styling
 * as OInput.
 *
 * @example
 *   <OTextarea v-model="notes" :rows="4" placeholder="Notes…" />
 */
import type { OuSize } from '../types';

withDefaults(
    defineProps<{
        modelValue?: string | null;
        rows?: number;
        size?: OuSize;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        invalid?: boolean;
        accent?: string;
    }>(),
    {
        rows: 3,
        size: 'md',
        disabled: false,
        readonly: false,
        invalid: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [string] }>();

function onInput(e: Event): void {
    emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
}
</script>

<template>
    <textarea
        class="ou-input ou-textarea"
        :class="[`ou-input--${size}`, { 'ou-input--invalid': invalid }]"
        :rows="rows"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="invalid || undefined"
        :style="accent ? { '--ou-accent': accent } : undefined"
        @input="onInput"
    />
</template>

<style scoped>
.ou-input {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    display: block;
    width: 100%;
    color: var(--opus-fg, #fff);
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--opus-border-strong, rgba(255, 255, 255, 0.18));
    border-radius: var(--opus-radius-md, 0.95rem);
    outline: none;
    transition:
        border-color var(--opus-transition, 150ms),
        box-shadow var(--opus-transition, 150ms),
        background var(--opus-transition, 150ms);
}
.ou-textarea { resize: vertical; line-height: 1.45; }
.ou-input::placeholder { color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42)); }

.ou-input--sm { padding: 0.45rem 0.75rem; font-size: 0.9rem; }
.ou-input--md { padding: 0.6rem 0.9rem; font-size: 1rem; }
.ou-input--lg { padding: 0.8rem 1.1rem; font-size: 1.15rem; }

.ou-input:focus,
.ou-input:focus-visible {
    border-color: var(--ou-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ou-accent) 25%, transparent);
}
.ou-input:disabled { opacity: 0.5; cursor: not-allowed; }

.ou-input--invalid { border-color: var(--opus-danger, #f87171); }
.ou-input--invalid:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--opus-danger, #f87171) 25%, transparent);
}
</style>
