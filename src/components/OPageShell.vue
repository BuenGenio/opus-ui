<script setup lang="ts">
/**
 * Page-level scaffold. Wraps every page with an animated gradient + grid
 * background, an optional top bar / sidebar / footer, and a centred main
 * content area.
 *
 * Use this as the root of every page in your app. Set `fullscreen` for
 * game / kiosk pages that should cover the whole viewport (z-50 overlay).
 *
 * Slots:
 *   - `bar`      — top bar (usually <OTopBar>)
 *   - `sidebar`  — left rail (usually <OSidebar>)
 *   - default    — main content
 *   - `footer`   — page footer rendered inside <main>
 *
 * @example
 *   <OPageShell accent="#6366f1">
 *     <template #bar>
 *       <OTopBar>
 *         <template #brand><strong>⚡ OPUS</strong></template>
 *         <template #actions>
 *           <OButton :as="Link" href="/login">Sign in</OButton>
 *         </template>
 *       </OTopBar>
 *     </template>
 *     <OHeading level="1" size="hero" glow balance>Welcome.</OHeading>
 *     <OText variant="lead" class="mt-3">A short page intro.</OText>
 *     <OCardGrid class="mt-8">…</OCardGrid>
 *   </OPageShell>
 */
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        accent?: string;
        glow?: boolean;
        fullscreen?: boolean;
        maxWidth?: string;
        padded?: boolean | 'sm' | 'md' | 'lg';
    }>(),
    {
        glow: true,
        fullscreen: false,
        maxWidth: '72rem',
        padded: true,
    },
);

const paddedClass = computed(() => {
    if (!props.padded) return '';
    return props.padded === true
        ? 'ou-shell__main--padded-md'
        : `ou-shell__main--padded-${props.padded}`;
});
</script>

<template>
    <div
        class="ou-shell"
        :class="{ 'ou-shell--fullscreen': fullscreen }"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <div class="ou-shell__bg" aria-hidden="true">
            <div v-if="glow" class="ou-shell__glow ou-shell__glow--a" />
            <div v-if="glow" class="ou-shell__glow ou-shell__glow--b" />
            <div class="ou-shell__grid" />
        </div>

        <slot name="bar" />

        <div class="ou-shell__row">
            <slot name="sidebar" />
            <main
                class="ou-shell__main"
                :class="paddedClass"
                :style="{ '--ou-max-width': maxWidth }"
            >
                <slot />
                <footer v-if="$slots.footer" class="ou-shell__footer">
                    <slot name="footer" />
                </footer>
            </main>
        </div>
    </div>
</template>

<style scoped>
.ou-shell {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    color: var(--opus-fg);
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.ou-shell--fullscreen {
    position: fixed;
    inset: 0;
    z-index: 50;
    overflow-y: auto;
    min-height: 0;
}

.ou-shell__bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--opus-bg-gradient);
    overflow: hidden;
}
.ou-shell__glow {
    position: absolute;
    width: 46rem;
    height: 46rem;
    border-radius: 9999px;
    filter: blur(120px);
    background: var(--ou-accent);
    opacity: 0.22;
}
.ou-shell__glow--a {
    top: -16rem;
    left: -12rem;
    animation: ou-shell-float-a 18s ease-in-out infinite alternate;
}
.ou-shell__glow--b {
    bottom: -18rem;
    right: -14rem;
    opacity: 0.16;
    animation: ou-shell-float-b 22s ease-in-out infinite alternate;
}
.ou-shell__grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
}
@keyframes ou-shell-float-a {
    to { transform: translate(6rem, 4rem); }
}
@keyframes ou-shell-float-b {
    to { transform: translate(-5rem, -3rem); }
}

.ou-shell__row {
    display: flex;
    flex: 1;
    min-height: 0;
    position: relative;
}
.ou-shell__main {
    flex: 1;
    min-width: 0;
    width: 100%;
    margin: 0 auto;
    max-width: var(--ou-max-width);
}
.ou-shell__main--padded-sm { padding: 1rem; }
.ou-shell__main--padded-md { padding: 2rem 1.5rem; }
.ou-shell__main--padded-lg { padding: 3rem 2rem; }

.ou-shell__footer {
    margin-top: 4rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--opus-border);
    font-size: 0.85rem;
    color: var(--opus-fg-dim);
    text-align: center;
}
</style>
