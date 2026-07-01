<script setup lang="ts">
/**
 * Yes/no confirmation dialog built on OModal. Emits `confirm` / `cancel`;
 * `@close` (backdrop / Escape / ✕) is treated as cancel. Set `danger` for
 * destructive actions and `loading` to show a spinner on the confirm button
 * while an async action runs.
 *
 * @example
 *   <OConfirmModal
 *     :open="askDelete" danger title="Delete device?"
 *     message="This removes the device and its sensors. This can't be undone."
 *     confirm-label="Delete" :loading="deleting"
 *     @confirm="remove" @cancel="askDelete = false" />
 */
import OModal from './OModal.vue';
import OButton from './OButton.vue';

withDefaults(
    defineProps<{
        open: boolean;
        title?: string;
        message?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        danger?: boolean;
        loading?: boolean;
        accent?: string;
    }>(),
    {
        title: 'Confirm',
        message: 'Are you sure?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        danger: false,
        loading: false,
    },
);

const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
    <OModal
        :open="open"
        :title="title"
        :accent="accent"
        size="sm"
        @close="emit('cancel')"
    >
        <p v-if="message" class="ou-confirm__message">{{ message }}</p>
        <slot />
        <template #footer>
            <OButton variant="ghost" :disabled="loading" @click="emit('cancel')">{{ cancelLabel }}</OButton>
            <OButton
                :variant="danger ? 'danger' : 'primary'"
                :accent="accent"
                :loading="loading"
                @click="emit('confirm')"
            >
                {{ confirmLabel }}
            </OButton>
        </template>
    </OModal>
</template>

<style scoped>
.ou-confirm__message {
    margin: 0;
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
    font-size: 0.95rem;
    line-height: 1.5;
}
</style>
