<script setup lang="ts">
/**
 * Form field wrapper: a label, an optional hint, and an error message around
 * any control (OInput / OSelect / OTextarea / OCheckbox or a native control).
 *
 * @example
 *   <OField label="Email" hint="We never share it." :error="errors.email">
 *     <OInput v-model="email" type="email" :invalid="!!errors.email" />
 *   </OField>
 */
withDefaults(
    defineProps<{
        label?: string;
        hint?: string;
        error?: string;
        required?: boolean;
    }>(),
    { required: false },
);
</script>

<template>
    <div class="ou-field">
        <label v-if="label" class="ou-field__label">
            {{ label }}<span v-if="required" class="ou-field__req">*</span>
        </label>
        <slot />
        <p v-if="error" class="ou-field__error">{{ error }}</p>
        <p v-else-if="hint" class="ou-field__hint">{{ hint }}</p>
    </div>
</template>

<style scoped>
.ou-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-family: var(--opus-font);
}
.ou-field__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
}
.ou-field__req { color: var(--opus-danger, #f87171); margin-left: 0.2rem; }
.ou-field__hint {
    font-size: 0.75rem;
    color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42));
    margin: 0;
}
.ou-field__error {
    font-size: 0.75rem;
    color: var(--opus-danger, #f87171);
    margin: 0;
}
</style>
