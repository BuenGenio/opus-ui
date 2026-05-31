<script setup lang="ts">
/**
 * Top navigation bar. Three slots: `brand` (left), `nav` (middle), `actions`
 * (right). Sticky and blurred by default.
 *
 * @example
 *   <OTopBar>
 *     <template #brand>
 *       <OHeading level="1" size="h4" glow>⚡ My App</OHeading>
 *     </template>
 *     <template #nav>
 *       <OMenuItem :as="Link" href="/about">About</OMenuItem>
 *       <OMenuItem :as="Link" href="/pricing">Pricing</OMenuItem>
 *     </template>
 *     <template #actions>
 *       <OButton variant="ghost" :as="Link" href="/login">Sign in</OButton>
 *       <OButton :as="Link" href="/signup">Get started</OButton>
 *     </template>
 *   </OTopBar>
 */
withDefaults(
    defineProps<{
        sticky?: boolean;
        bordered?: boolean;
        blur?: boolean;
    }>(),
    {
        sticky: true,
        bordered: true,
        blur: true,
    },
);
</script>

<template>
    <header
        class="ou-topbar"
        :class="{
            'ou-topbar--sticky': sticky,
            'ou-topbar--bordered': bordered,
            'ou-topbar--blur': blur,
        }"
    >
        <div class="ou-topbar__brand">
            <slot name="brand" />
        </div>
        <nav v-if="$slots.nav" class="ou-topbar__nav">
            <slot name="nav" />
        </nav>
        <div class="ou-topbar__actions">
            <slot name="actions" />
        </div>
    </header>
</template>

<style scoped>
.ou-topbar {
    font-family: var(--opus-font);
    color: var(--opus-fg);
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.75rem 1.25rem;
    z-index: 30;
}
.ou-topbar--sticky {
    position: sticky;
    top: 0;
}
.ou-topbar--bordered { border-bottom: 1px solid var(--opus-border); }
.ou-topbar--blur {
    backdrop-filter: blur(12px);
    background: color-mix(in srgb, var(--opus-bg) 65%, transparent);
}
.ou-topbar__brand { flex-shrink: 0; }
.ou-topbar__nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}
.ou-topbar__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.65rem;
}
</style>
