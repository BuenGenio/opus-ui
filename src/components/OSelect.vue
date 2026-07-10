<script setup lang="ts">
/**
 * Native <select> with token-driven styling + a custom chevron. Pass the
 * <option>s via the default slot; `v-model` on the value.
 *
 * @example
 *   <OSelect v-model="type">
 *     <option value="">Any</option>
 *     <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
 *   </OSelect>
 */
import type { OuSize } from '../types';

withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        size?: OuSize;
        disabled?: boolean;
        invalid?: boolean;
        accent?: string;
    }>(),
    {
        size: 'md',
        disabled: false,
        invalid: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [string] }>();

function onChange(e: Event): void {
    emit('update:modelValue', (e.target as HTMLSelectElement).value);
}
</script>

<template>
    <div class="ou-select-wrap" :class="{ 'ou-select-wrap--disabled': disabled }">
        <select
            class="ou-input ou-select"
            :class="[`ou-input--${size}`, { 'ou-input--invalid': invalid }]"
            :value="modelValue ?? ''"
            :disabled="disabled"
            :aria-invalid="invalid || undefined"
            :style="accent ? { '--ou-accent': accent } : undefined"
            @change="onChange"
        >
            <slot />
        </select>
        <span class="ou-select__chevron" aria-hidden="true">▾</span>
    </div>
</template>

<style scoped>
.ou-select-wrap { position: relative; display: block; }
.ou-select-wrap--disabled { opacity: 0.5; }

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
.ou-select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 2.25rem;
    cursor: pointer;
}
/* Options render via the native popup; force readable colours where the OS lets us. */
.ou-select option { color: #111; background: #fff; }

.ou-input--sm { padding: 0.45rem 0.75rem; font-size: 0.9rem; }
.ou-input--md { padding: 0.6rem 0.9rem; font-size: 1rem; }
.ou-input--lg { padding: 0.8rem 1.1rem; font-size: 1.15rem; }

.ou-input:focus,
.ou-input:focus-visible {
    border-color: var(--ou-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ou-accent) 25%, transparent);
}
.ou-input:disabled { cursor: not-allowed; }

.ou-input--invalid { border-color: var(--opus-danger, #f87171); }
.ou-input--invalid:focus {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--opus-danger, #f87171) 25%, transparent);
}

.ou-select__chevron {
    position: absolute;
    top: 50%;
    right: 0.9rem;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
    font-size: 0.8em;
}
</style>
