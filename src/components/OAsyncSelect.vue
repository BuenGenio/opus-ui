<script setup lang="ts">
/**
 * Debounced async search-select. Decoupled from any HTTP client: you pass a
 * `fetcher(query)` that returns `{ value, label }[]` — so it works with axios,
 * fetch, a local array, or anything else. `v-model` binds the chosen `value`.
 *
 * Handles: debounce · out-of-order response guard · outside-click / Escape
 * close · ↑ / ↓ / Enter keyboard selection · clearable.
 *
 * @example
 *   <OAsyncSelect
 *     v-model="vesselId" :selected-label="vesselName" placeholder="Search vessels…"
 *     :fetcher="q => axios.get('/api/vessels', { params: { search: q } })
 *                        .then(r => r.data.results.map(v => ({ value: v.id, label: v.name })))" />
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Option {
    value: string;
    label: string;
}

const props = withDefaults(
    defineProps<{
        modelValue: string;
        fetcher: (query: string) => Promise<Option[]>;
        placeholder?: string;
        /** Label to show for the current value before options have loaded. */
        selectedLabel?: string | null;
        /** Minimum characters before fetching (0 = fetch on focus). */
        minChars?: number;
        debounceMs?: number;
        disabled?: boolean;
        accent?: string;
    }>(),
    {
        placeholder: 'Select…',
        selectedLabel: null,
        minChars: 0,
        debounceMs: 250,
        disabled: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    change: [option: Option | null];
}>();

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const query = ref('');
const results = ref<Option[]>([]);
const loading = ref(false);
const active = ref(-1);
const selected = ref<Option | null>(
    props.modelValue ? { value: props.modelValue, label: props.selectedLabel ?? props.modelValue } : null,
);

let debounce: ReturnType<typeof setTimeout>;
let requestId = 0;

watch(
    () => props.modelValue,
    (val) => {
        if (!val) selected.value = null;
        else if (!selected.value || selected.value.value !== val) {
            selected.value = { value: val, label: props.selectedLabel ?? val };
        }
    },
);

async function fetchResults(): Promise<void> {
    if (query.value.length < props.minChars) {
        results.value = [];
        return;
    }
    const id = ++requestId;
    loading.value = true;
    try {
        const data = await props.fetcher(query.value);
        if (id === requestId) {
            results.value = Array.isArray(data) ? data : [];
            active.value = results.value.length ? 0 : -1;
        }
    } catch {
        if (id === requestId) results.value = [];
    } finally {
        if (id === requestId) loading.value = false;
    }
}

watch(query, () => {
    if (!open.value) return;
    clearTimeout(debounce);
    debounce = setTimeout(fetchResults, props.debounceMs);
});

function onFocus(): void {
    if (props.disabled) return;
    open.value = true;
    query.value = '';
    fetchResults();
}

function choose(option: Option): void {
    selected.value = option;
    emit('update:modelValue', option.value);
    emit('change', option);
    open.value = false;
    query.value = '';
}

function clear(): void {
    selected.value = null;
    emit('update:modelValue', '');
    emit('change', null);
    results.value = [];
    query.value = '';
}

function onKeydown(e: KeyboardEvent): void {
    if (!open.value) return;
    switch (e.key) {
        case 'ArrowDown': e.preventDefault(); active.value = Math.min(active.value + 1, results.value.length - 1); break;
        case 'ArrowUp': e.preventDefault(); active.value = Math.max(active.value - 1, 0); break;
        case 'Enter':
            if (active.value >= 0 && results.value[active.value]) { e.preventDefault(); choose(results.value[active.value]); }
            break;
        case 'Escape': open.value = false; break;
    }
}

function onDocumentMouseDown(event: MouseEvent): void {
    if (root.value && !root.value.contains(event.target as Node)) open.value = false;
}

onMounted(() => document.addEventListener('mousedown', onDocumentMouseDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentMouseDown));
</script>

<template>
    <div
        ref="root"
        class="ou-async"
        :class="{ 'ou-async--disabled': disabled }"
        :style="accent ? { '--ou-async-accent': accent } : undefined"
    >
        <div class="ou-async__control">
            <input
                :value="open ? query : (selected?.label ?? '')"
                type="text"
                :placeholder="placeholder"
                :disabled="disabled"
                class="ou-async__input"
                role="combobox"
                :aria-expanded="open"
                @input="query = ($event.target as HTMLInputElement).value"
                @focus="onFocus"
                @keydown="onKeydown"
            />
            <button
                v-if="selected && !disabled"
                type="button"
                class="ou-async__clear"
                aria-label="Clear"
                @click="clear"
            >✕</button>
        </div>

        <div v-if="open" class="ou-async__panel" role="listbox">
            <div v-if="loading" class="ou-async__hint">Searching…</div>
            <template v-else>
                <button
                    v-for="(option, i) in results"
                    :key="option.value"
                    type="button"
                    role="option"
                    :aria-selected="option.value === selected?.value"
                    class="ou-async__option"
                    :class="{
                        'ou-async__option--active': i === active,
                        'ou-async__option--selected': option.value === selected?.value,
                    }"
                    @mouseenter="active = i"
                    @click="choose(option)"
                >
                    {{ option.label }}
                </button>
                <div v-if="results.length === 0" class="ou-async__hint">No matches</div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.ou-async {
    --ou-async-accent: var(--opus-accent, #6366f1);
    position: relative;
    font-family: var(--opus-font);
}
.ou-async--disabled { opacity: 0.55; }

.ou-async__control {
    display: flex;
    align-items: center;
    background: var(--opus-surface, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--opus-radius-sm, 0.6rem);
    transition: border-color var(--opus-transition, 150ms), box-shadow var(--opus-transition, 150ms);
}
.ou-async__control:focus-within {
    border-color: var(--ou-async-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ou-async-accent) 22%, transparent);
}
.ou-async__input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    background: transparent;
    border: none;
    outline: none;
    color: var(--opus-fg, #fff);
    font-size: 0.95rem;
}
.ou-async__input::placeholder { color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42)); }
.ou-async__clear {
    padding: 0 0.6rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42));
    font-size: 0.85rem;
}
.ou-async__clear:hover { color: var(--opus-fg, #fff); }

.ou-async__panel {
    position: absolute;
    z-index: 50;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 15rem;
    overflow-y: auto;
    padding: 0.3rem;
    background: color-mix(in srgb, var(--opus-bg, #070b18) 92%, transparent);
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.1));
    border-radius: var(--opus-radius-md, 0.95rem);
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
}
.ou-async__option {
    display: block;
    width: 100%;
    padding: 0.5rem 0.65rem;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: var(--opus-radius-sm, 0.6rem);
    cursor: pointer;
    color: var(--opus-fg-muted, rgba(255, 255, 255, 0.62));
    font-size: 0.9rem;
}
.ou-async__option--active { background: var(--opus-surface-hover, rgba(255, 255, 255, 0.09)); color: var(--opus-fg, #fff); }
.ou-async__option--selected { color: var(--ou-async-accent); font-weight: 600; }
.ou-async__hint {
    padding: 0.5rem 0.65rem;
    color: var(--opus-fg-dim, rgba(255, 255, 255, 0.42));
    font-size: 0.8rem;
}
</style>
