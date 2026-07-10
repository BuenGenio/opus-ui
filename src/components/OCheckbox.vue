<script setup lang="ts">
/**
 * Checkbox with an optional inline label (default slot). Boolean `v-model`.
 *
 * @example
 *   <OCheckbox v-model="enabled">Enabled</OCheckbox>
 */
withDefaults(
    defineProps<{
        modelValue?: boolean;
        disabled?: boolean;
        accent?: string;
    }>(),
    {
        modelValue: false,
        disabled: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

function onChange(e: Event): void {
    emit('update:modelValue', (e.target as HTMLInputElement).checked);
}
</script>

<template>
    <label
        class="ou-check"
        :class="{ 'ou-check--disabled': disabled }"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <input
            type="checkbox"
            class="ou-check__box"
            :checked="modelValue"
            :disabled="disabled"
            @change="onChange"
        />
        <span v-if="$slots.default" class="ou-check__label"><slot /></span>
    </label>
</template>

<style scoped>
.ou-check {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--opus-fg, #fff);
    cursor: pointer;
    user-select: none;
}
.ou-check--disabled { opacity: 0.5; cursor: not-allowed; }

.ou-check__box {
    appearance: none;
    -webkit-appearance: none;
    width: 1.1rem;
    height: 1.1rem;
    flex-shrink: 0;
    margin: 0;
    border: 1px solid var(--opus-border-strong, rgba(255, 255, 255, 0.18));
    border-radius: var(--opus-radius-sm, 0.6rem);
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    cursor: inherit;
    transition:
        border-color var(--opus-transition, 150ms),
        background var(--opus-transition, 150ms),
        box-shadow var(--opus-transition, 150ms);
}
.ou-check__box:checked {
    border-color: var(--ou-accent);
    background: var(--ou-accent);
    /* checkmark */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3.5 8.5l3 3 6-7'/%3E%3C/svg%3E");
    background-size: 0.8rem;
    background-position: center;
    background-repeat: no-repeat;
}
.ou-check__box:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ou-accent) 28%, transparent);
}
.ou-check__label { font-size: 0.95rem; }
</style>
