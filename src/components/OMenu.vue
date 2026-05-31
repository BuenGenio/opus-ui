<script setup lang="ts">
/**
 * Vertical menu container. Drops in inside an OSidebar, a popover or a
 * card. Renders semantic `<nav><ul>` by default.
 *
 * @example
 *   <OMenu aria-label="Main navigation">
 *     <OMenuItem href="/dashboard" icon="🏠">Dashboard</OMenuItem>
 *     <OMenuItem href="/tasks" icon="✓" active>Tasks</OMenuItem>
 *     <OMenuItem href="/settings" icon="⚙">Settings</OMenuItem>
 *   </OMenu>
 */
withDefaults(
    defineProps<{
        as?: string;
        ariaLabel?: string;
    }>(),
    {
        as: 'nav',
    },
);
</script>

<template>
    <component :is="as" :aria-label="ariaLabel" class="ou-menu">
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
    flex-direction: column;
    gap: 0.15rem;
}
</style>
