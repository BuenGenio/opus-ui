<script setup lang="ts">
/**
 * A single menu row inside an OMenu. Renders an <a> by default; pass `as`
 * for Inertia <Link>, Vue Router <RouterLink>, etc.
 *
 * Use `active` to indicate the current page (applies an accent rail),
 * `focused` to programmatically focus from a parent for D-pad menus.
 *
 * @example
 *   <OMenuItem :as="Link" href="/dashboard" icon="🏠" :active="$page.url === '/dashboard'">
 *     Dashboard
 *   </OMenuItem>
 */
import { ref, watch } from 'vue';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        href?: string;
        as?: string | Component;
        active?: boolean;
        focused?: boolean;
        icon?: string;
        accent?: string;
        disabled?: boolean;
    }>(),
    {
        active: false,
        focused: false,
        disabled: false,
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
    <li class="ou-menu-item-wrap">
        <component
            :is="renderedAs"
            ref="el"
            :href="href"
            :type="isNativeButton ? 'button' : undefined"
            :disabled="isNativeButton ? disabled : undefined"
            :aria-current="active ? 'page' : undefined"
            class="ou-menu-item"
            :class="{
                'ou-menu-item--active': active,
                'ou-menu-item--focused': focused,
                'ou-menu-item--disabled': disabled,
            }"
            :style="accent ? { '--ou-accent': accent } : undefined"
        >
            <span v-if="icon || $slots.icon" class="ou-menu-item__icon" aria-hidden="true">
                <slot name="icon">{{ icon }}</slot>
            </span>
            <span class="ou-menu-item__label"><slot /></span>
            <span v-if="$slots.trailing" class="ou-menu-item__trailing">
                <slot name="trailing" />
            </span>
        </component>
    </li>
</template>

<style scoped>
.ou-menu-item-wrap { margin: 0; padding: 0; }

.ou-menu-item {
    --ou-accent: var(--opus-accent, #6366f1);
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    padding: 0.55rem 0.85rem 0.55rem 1.05rem;
    font-family: var(--opus-font);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--opus-fg-muted);
    background: transparent;
    border: none;
    border-radius: var(--opus-radius-sm, 0.6rem);
    text-decoration: none;
    cursor: pointer;
    text-align: left;
    outline: none;
    transition: background var(--opus-transition), color var(--opus-transition);
}
.ou-menu-item:hover,
.ou-menu-item:focus-visible,
.ou-menu-item--focused {
    color: var(--opus-fg, #fff);
    background: var(--opus-surface);
}
.ou-menu-item--active {
    color: var(--opus-fg, #fff);
    background: color-mix(in srgb, var(--ou-accent) 18%, transparent);
}
.ou-menu-item--active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.45rem;
    bottom: 0.45rem;
    width: 3px;
    background: var(--ou-accent);
    border-radius: 3px;
}
.ou-menu-item__icon {
    font-size: 1.15em;
    width: 1.4em;
    text-align: center;
    flex-shrink: 0;
}
.ou-menu-item__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ou-menu-item__trailing {
    margin-left: auto;
    font-size: 0.8em;
    color: var(--opus-fg-dim);
}
.ou-menu-item--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}
</style>
