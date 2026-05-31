<script setup lang="ts">
/**
 * Vertical side navigation, collapsible via `v-model:open`. Three slots:
 * `header`, default (body — usually an OMenu), `footer`.
 *
 * @example
 *   <OSidebar v-model:open="navOpen" width="15rem">
 *     <template #header>
 *       <OHeading level="2" size="h4" glow>⚡ My App</OHeading>
 *     </template>
 *     <OMenu>
 *       <OMenuItem :as="Link" href="/" icon="🏠">Home</OMenuItem>
 *       <OMenuItem :as="Link" href="/tasks" icon="✓">Tasks</OMenuItem>
 *     </OMenu>
 *     <template #footer>
 *       <OButton variant="ghost" block @click="logout">Sign out</OButton>
 *     </template>
 *   </OSidebar>
 */
withDefaults(
    defineProps<{
        open?: boolean;
        width?: string;
        position?: 'left' | 'right';
    }>(),
    {
        open: true,
        width: '15rem',
        position: 'left',
    },
);

defineEmits<{ 'update:open': [boolean] }>();
</script>

<template>
    <aside
        class="ou-sidebar"
        :class="[`ou-sidebar--${position}`, { 'ou-sidebar--closed': !open }]"
        :style="{ '--ou-sidebar-w': width }"
        :aria-hidden="!open"
    >
        <div class="ou-sidebar__inner">
            <div v-if="$slots.header" class="ou-sidebar__header">
                <slot name="header" />
            </div>
            <div class="ou-sidebar__body">
                <slot />
            </div>
            <div v-if="$slots.footer" class="ou-sidebar__footer">
                <slot name="footer" />
            </div>
        </div>
    </aside>
</template>

<style scoped>
.ou-sidebar {
    --ou-sidebar-w: 15rem;
    width: var(--ou-sidebar-w);
    flex-shrink: 0;
    overflow: hidden;
    background: color-mix(in srgb, var(--opus-bg) 75%, transparent);
    font-family: var(--opus-font);
    color: var(--opus-fg);
    transition: width var(--opus-transition);
}
.ou-sidebar--left  { border-right: 1px solid var(--opus-border); }
.ou-sidebar--right { border-left: 1px solid var(--opus-border); }
.ou-sidebar--closed { width: 0; }
.ou-sidebar__inner {
    width: var(--ou-sidebar-w);
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 0.75rem;
}
.ou-sidebar__header {
    padding: 0.25rem 0.5rem 0.75rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid var(--opus-border);
}
.ou-sidebar__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}
.ou-sidebar__footer {
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--opus-border);
}
</style>
