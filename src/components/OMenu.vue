<script setup lang="ts">
/**
 * Menu container. Defaults to **vertical** (sidebars, settings menus,
 * inside ODropdown panels). Pass `orientation="horizontal"` for top-bar
 * navigation.
 *
 * @example vertical (sidebar nav)
 *   <OMenu aria-label="Main">
 *     <OMenuItem :as="Link" href="/" icon="🏠">Home</OMenuItem>
 *     <OMenuItem :as="Link" href="/tasks" icon="✓" active>Tasks</OMenuItem>
 *   </OMenu>
 *
 * @example horizontal (top bar)
 *   <OTopBar>
 *     <template #nav>
 *       <OMenu orientation="horizontal">
 *         <OMenuItem :as="Link" href="/pricing">Pricing</OMenuItem>
 *         <OMenuItem :as="Link" href="/blog">Blog</OMenuItem>
 *         <OMenuItem :as="Link" href="/docs">Docs</OMenuItem>
 *       </OMenu>
 *     </template>
 *   </OTopBar>
 */
withDefaults(
    defineProps<{
        as?: string;
        ariaLabel?: string;
        orientation?: 'vertical' | 'horizontal';
    }>(),
    {
        as: 'nav',
        orientation: 'vertical',
    },
);
</script>

<template>
    <component
        :is="as"
        :aria-label="ariaLabel"
        class="ou-menu"
        :class="`ou-menu--${orientation}`"
    >
        <ul class="ou-menu__list">
            <slot />
        </ul>
    </component>
</template>

<style scoped>
.ou-menu {
    font-family: var(--opus-font);
    color: var(--opus-fg);
}
.ou-menu__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.15rem;
}
.ou-menu--vertical .ou-menu__list { flex-direction: column; }
.ou-menu--horizontal .ou-menu__list {
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
}

/* Horizontal mode: tweak OMenuItem padding and swap the left-rail active
   indicator for a bottom underline. Reaches into the child component's
   scoped styles via :deep(). */
.ou-menu--horizontal :deep(.ou-menu-item) {
    padding: 0.55rem 0.95rem;
}
.ou-menu--horizontal :deep(.ou-menu-item--active::before) {
    left: 0.7rem;
    right: 0.7rem;
    top: auto;
    bottom: 0.25rem;
    width: auto;
    height: 2px;
    border-radius: 2px;
}
</style>
