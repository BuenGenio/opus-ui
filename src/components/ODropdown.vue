<script setup lang="ts">
/**
 * Click-to-open dropdown menu. The trigger is a scoped slot exposing
 * `{ open, toggle, close }` so you can plug in any clickable. The default
 * slot is the panel content — typically OMenuItem rows with optional
 * ODivider separators.
 *
 * Handles: outside-click close · Escape close · ↑ / ↓ to navigate items ·
 * Home / End to jump · Tab away closes · focus returns to trigger on
 * Escape · ARIA `menu` role on the panel.
 *
 * @example
 *   <ODropdown placement="bottom-end">
 *     <template #trigger="{ open, toggle }">
 *       <OButton variant="ghost" @click="toggle">
 *         ⚙ Profile {{ open ? '▴' : '▾' }}
 *       </OButton>
 *     </template>
 *
 *     <OMenuItem :as="Link" href="/settings" icon="⚙">Settings</OMenuItem>
 *     <OMenuItem :as="Link" href="/billing"  icon="💳">Billing</OMenuItem>
 *     <ODivider />
 *     <OMenuItem icon="🚪" @click="logout">Sign out</OMenuItem>
 *   </ODropdown>
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

const props = withDefaults(
    defineProps<{
        /** Optional controlled state — pair with `@update:open`. Omit for uncontrolled. */
        open?: boolean;
        placement?: Placement;
        /** Pixel gap between trigger and panel. */
        offset?: number;
        /** Close the panel when the user activates an item. Default `true`. */
        closeOnItemClick?: boolean;
        ariaLabel?: string;
        /** Minimum panel width — any CSS length. */
        minWidth?: string;
    }>(),
    {
        placement: 'bottom-end',
        offset: 6,
        closeOnItemClick: true,
        minWidth: '12rem',
    },
);

const emit = defineEmits<{ 'update:open': [boolean] }>();

const internalOpen = ref(props.open ?? false);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? !!props.open : internalOpen.value));

watch(
    () => props.open,
    (v) => {
        if (v !== undefined) internalOpen.value = v;
    },
);

function setOpen(v: boolean): void {
    if (isControlled.value) emit('update:open', v);
    else internalOpen.value = v;
}
function toggle(): void { setOpen(!isOpen.value); }
function close(): void { setOpen(false); }

const wrapper = ref<HTMLElement | null>(null);
const triggerWrap = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);

function focusableItems(): HTMLElement[] {
    const p = panel.value;
    if (!p) return [];
    return Array.from(p.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => !el.hasAttribute('disabled'));
}
function focusFirst(): void { focusableItems()[0]?.focus(); }
function focusLast(): void {
    const items = focusableItems();
    items[items.length - 1]?.focus();
}
function focusRelative(dir: 1 | -1): void {
    const items = focusableItems();
    if (items.length === 0) return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = i + dir;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    items[next]?.focus();
}

function focusTrigger(): void {
    const t = triggerWrap.value?.querySelector<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])');
    t?.focus();
}

function onKeyDown(e: KeyboardEvent): void {
    if (!isOpen.value) return;
    switch (e.key) {
        case 'Escape':
            e.preventDefault();
            close();
            focusTrigger();
            break;
        case 'ArrowDown':
            e.preventDefault();
            focusRelative(1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            focusRelative(-1);
            break;
        case 'Home':
            e.preventDefault();
            focusFirst();
            break;
        case 'End':
            e.preventDefault();
            focusLast();
            break;
        case 'Tab':
            // Let the browser move focus naturally, then close.
            close();
            break;
    }
}

function onWindowPointerDown(e: PointerEvent): void {
    if (!isOpen.value || !wrapper.value) return;
    if (!wrapper.value.contains(e.target as Node)) close();
}

function onItemClick(e: MouseEvent): void {
    if (!props.closeOnItemClick) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) close();
}

watch(isOpen, async (v) => {
    if (v) {
        await nextTick();
        focusFirst();
    }
});

onMounted(() => window.addEventListener('pointerdown', onWindowPointerDown));
onBeforeUnmount(() => window.removeEventListener('pointerdown', onWindowPointerDown));
</script>

<template>
    <div
        ref="wrapper"
        class="ou-dropdown"
        :class="`ou-dropdown--${placement}`"
        @keydown="onKeyDown"
    >
        <div ref="triggerWrap" class="ou-dropdown__trigger">
            <slot name="trigger" :open="isOpen" :toggle="toggle" :close="close" />
        </div>
        <Transition name="ou-dropdown">
            <div
                v-if="isOpen"
                ref="panel"
                class="ou-dropdown__panel"
                role="menu"
                :aria-label="ariaLabel"
                :style="{
                    minWidth,
                    '--ou-dropdown-offset': offset + 'px',
                }"
                @click="onItemClick"
            >
                <slot :close="close" />
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.ou-dropdown {
    --ou-dropdown-offset: 6px;
    position: relative;
    display: inline-block;
    font-family: var(--opus-font);
}
.ou-dropdown__trigger { display: inline-block; }
.ou-dropdown__panel {
    position: absolute;
    z-index: 50;
    min-width: 12rem;
    padding: 0.4rem;
    background: color-mix(in srgb, var(--opus-bg, #070b18) 88%, transparent);
    border: 1px solid var(--opus-border, rgba(255, 255, 255, 0.12));
    border-radius: var(--opus-radius-md, 0.95rem);
    box-shadow:
        0 20px 50px -12px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    color: var(--opus-fg, #fff);
}
.ou-dropdown--bottom-start .ou-dropdown__panel { top: 100%; left: 0; margin-top: var(--ou-dropdown-offset); }
.ou-dropdown--bottom-end   .ou-dropdown__panel { top: 100%; right: 0; margin-top: var(--ou-dropdown-offset); }
.ou-dropdown--top-start    .ou-dropdown__panel { bottom: 100%; left: 0; margin-bottom: var(--ou-dropdown-offset); }
.ou-dropdown--top-end      .ou-dropdown__panel { bottom: 100%; right: 0; margin-bottom: var(--ou-dropdown-offset); }

.ou-dropdown-enter-active,
.ou-dropdown-leave-active {
    transition: opacity 140ms ease, transform 140ms ease;
}
.ou-dropdown-enter-from,
.ou-dropdown-leave-to {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
}
</style>
