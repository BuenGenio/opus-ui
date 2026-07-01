<script setup lang="ts">
/**
 * Underline tab switcher with `v-model`. Purely a view switcher — render the
 * active panel yourself based on the bound value. Tokens drive every colour so
 * it re-themes automatically.
 *
 * Handles: click + ← / → / Home / End keyboard nav · ARIA `tablist` / `tab`
 * roles · roving tabindex so the active tab is the single tab-stop.
 *
 * @example
 *   <OTabs v-model="tab" :tabs="[
 *     { key: 'overview', label: 'Overview' },
 *     { key: 'activity', label: 'Activity', badge: 3 },
 *   ]" />
 *   <section v-if="tab === 'overview'"> … </section>
 */
import { ref } from 'vue';

interface Tab {
    key: string;
    label: string;
    /** Optional trailing count/label pill. */
    badge?: string | number;
    disabled?: boolean;
}

withDefaults(
    defineProps<{
        tabs: Tab[];
        modelValue: string;
        /** Accent for the active tab + underline. Defaults to `--opus-accent`. */
        accent?: string;
        /** `md` (default) or `sm` for denser toolbars. */
        size?: 'sm' | 'md';
    }>(),
    { size: 'md' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const tablist = ref<HTMLElement | null>(null);

function select(tab: Tab): void {
    if (tab.disabled) return;
    emit('update:modelValue', tab.key);
}

function onKeydown(e: KeyboardEvent, tabs: Tab[], current: string): void {
    const enabled = tabs.filter((t) => !t.disabled);
    if (enabled.length === 0) return;
    const i = enabled.findIndex((t) => t.key === current);
    let next = i;
    switch (e.key) {
        case 'ArrowRight': next = (i + 1) % enabled.length; break;
        case 'ArrowLeft': next = (i - 1 + enabled.length) % enabled.length; break;
        case 'Home': next = 0; break;
        case 'End': next = enabled.length - 1; break;
        default: return;
    }
    e.preventDefault();
    const tab = enabled[next];
    emit('update:modelValue', tab.key);
    // Move focus to the newly-selected tab (roving tabindex).
    tablist.value
        ?.querySelector<HTMLElement>(`[data-tab-key="${CSS.escape(tab.key)}"]`)
        ?.focus();
}
</script>

<template>
    <div
        ref="tablist"
        class="ou-tabs"
        :class="`ou-tabs--${size}`"
        role="tablist"
        :style="accent ? { '--ou-tabs-accent': accent } : undefined"
        @keydown="onKeydown($event, tabs, modelValue)"
    >
        <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            role="tab"
            :data-tab-key="tab.key"
            :aria-selected="modelValue === tab.key"
            :tabindex="modelValue === tab.key ? 0 : -1"
            :disabled="tab.disabled"
            class="ou-tabs__tab"
            :class="{ 'ou-tabs__tab--active': modelValue === tab.key }"
            @click="select(tab)"
        >
            <span class="ou-tabs__label">{{ tab.label }}</span>
            <span v-if="tab.badge !== undefined" class="ou-tabs__badge">{{ tab.badge }}</span>
            <span v-if="modelValue === tab.key" class="ou-tabs__underline" aria-hidden="true" />
        </button>
    </div>
</template>

<style scoped>
.ou-tabs {
    --ou-tabs-accent: var(--opus-accent, #6366f1);
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    font-family: var(--opus-font);
}

.ou-tabs__tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42));
    outline: none;
    transition:
        color var(--opus-transition, 150ms),
        background var(--opus-transition, 150ms);
}
.ou-tabs--sm .ou-tabs__tab { padding: 0.45rem 0.75rem; font-size: 0.9rem; }
.ou-tabs--md .ou-tabs__tab { font-size: 1rem; }

.ou-tabs__tab:hover:not(:disabled):not(.ou-tabs__tab--active) {
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
}
.ou-tabs__tab:focus-visible {
    color: var(--opus-fg, #fff);
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ou-tabs-accent) 45%, transparent);
    border-radius: var(--opus-radius-sm, 0.6rem) var(--opus-radius-sm, 0.6rem) 0 0;
}
.ou-tabs__tab--active { color: var(--ou-tabs-accent); }
.ou-tabs__tab:disabled { opacity: 0.4; cursor: not-allowed; }

.ou-tabs__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    padding: 0 0.35rem;
    height: 1.25rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 700;
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
}
.ou-tabs__tab--active .ou-tabs__badge {
    background: color-mix(in srgb, var(--ou-tabs-accent) 20%, transparent);
    color: var(--ou-tabs-accent);
}

.ou-tabs__underline {
    position: absolute;
    inset-inline: 0;
    bottom: -1px;
    height: 2px;
    background: var(--ou-tabs-accent);
    border-radius: 2px 2px 0 0;
    box-shadow: 0 0 12px color-mix(in srgb, var(--ou-tabs-accent) 55%, transparent);
}
</style>
