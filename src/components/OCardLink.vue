<script setup lang="ts">
/**
 * Clickable card — renders an <a> by default; pass `as` to render an Inertia
 * <Link>, Vue Router <RouterLink>, etc. Slots: icon (or `emoji` prop),
 * default (title + description), footer, cta.
 *
 * @example
 *   <OCardLink href="/games/tetris" accent="#22d3ee" emoji="🟦">
 *     <OHeading level="3" size="h3">Tetris</OHeading>
 *     <OText muted size="sm">Stack the blocks. Clear the lines.</OText>
 *     <template #footer>High score · 12,400</template>
 *   </OCardLink>
 */
import { ref, watch } from 'vue';
import type { Component } from 'vue';

const props = withDefaults(
    defineProps<{
        href?: string;
        as?: string | Component;
        accent?: string;
        focused?: boolean;
        external?: boolean;
        emoji?: string;
    }>(),
    {
        focused: false,
        external: false,
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
</script>

<template>
    <component
        :is="as ?? (href ? 'a' : 'button')"
        ref="el"
        :href="href"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noopener noreferrer' : undefined"
        class="ou-card-link"
        :class="{ 'ou-card-link--focused': focused }"
        :style="accent ? { '--ou-accent': accent } : undefined"
    >
        <div v-if="emoji || $slots.icon" class="ou-card-link__icon" aria-hidden="true">
            <slot name="icon">{{ emoji }}</slot>
        </div>
        <div class="ou-card-link__body">
            <slot />
        </div>
        <div v-if="$slots.footer" class="ou-card-link__footer">
            <slot name="footer" />
        </div>
        <div v-if="$slots.cta || href" class="ou-card-link__cta">
            <slot name="cta">Open ▸</slot>
        </div>
    </component>
</template>

<style scoped>
.ou-card-link {
    --ou-accent: var(--opus-accent, #6366f1);
    font-family: var(--opus-font);
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 1.4rem;
    border-radius: var(--opus-radius-lg, 1.35rem);
    border: 2px solid var(--opus-border);
    background: var(--opus-surface);
    color: var(--opus-fg);
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition:
        transform var(--opus-transition),
        border-color var(--opus-transition),
        background var(--opus-transition),
        box-shadow var(--opus-transition);
}
.ou-card-link:hover,
.ou-card-link:focus-visible,
.ou-card-link--focused {
    border-color: var(--ou-accent);
    background: color-mix(in srgb, var(--ou-accent) 14%, var(--opus-surface));
    box-shadow:
        0 0 0 4px color-mix(in srgb, var(--ou-accent) 26%, transparent),
        0 18px 50px -12px color-mix(in srgb, var(--ou-accent) 60%, transparent);
    transform: translateY(-4px);
}
.ou-card-link__icon {
    font-size: 3.2rem;
    line-height: 1;
    margin-bottom: 0.75rem;
    filter: drop-shadow(0 0 16px color-mix(in srgb, var(--ou-accent) 70%, transparent));
    transition: transform var(--opus-transition);
}
.ou-card-link:hover .ou-card-link__icon,
.ou-card-link--focused .ou-card-link__icon {
    transform: scale(1.1) rotate(-3deg);
}
.ou-card-link__body { flex: 1; min-width: 0; }
.ou-card-link__footer {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--opus-border);
    font-size: 0.85rem;
    color: var(--opus-fg-muted);
}
.ou-card-link__cta {
    margin-top: 0.9rem;
    align-self: flex-start;
    font-weight: 800;
    font-size: 0.95rem;
    letter-spacing: 0.06em;
    color: var(--ou-accent);
    opacity: 0.7;
    transition:
        opacity var(--opus-transition),
        transform var(--opus-transition);
}
.ou-card-link:hover .ou-card-link__cta,
.ou-card-link--focused .ou-card-link__cta {
    opacity: 1;
    transform: translateX(4px);
}
</style>
