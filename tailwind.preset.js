/**
 * Tailwind preset for opus-ui.
 *
 * Consumer setup:
 *   // tailwind.config.js
 *   import opusPreset from 'opus-ui/tailwind-preset';
 *   export default { presets: [opusPreset], content: ['./resources/**\/*.{vue,ts,js,blade.php}'] };
 *
 * Exposes the design tokens (defined in tokens.css) as Tailwind utilities so
 * consumers can mix arbitrary utilities with the bundled components — e.g.
 * `bg-opus-surface text-opus-muted rounded-opus-md shadow-opus-glow`.
 */
export default {
    theme: {
        extend: {
            colors: {
                opus: {
                    bg: 'var(--opus-bg)',
                    surface: 'var(--opus-surface)',
                    'surface-hover': 'var(--opus-surface-hover)',
                    border: 'var(--opus-border)',
                    'border-strong': 'var(--opus-border-strong)',
                    fg: 'var(--opus-fg)',
                    muted: 'var(--opus-fg-muted)',
                    dim: 'var(--opus-fg-dim)',
                    accent: 'var(--opus-accent)',
                    'accent-fg': 'var(--opus-accent-fg)',
                    success: 'var(--opus-success)',
                    warning: 'var(--opus-warning)',
                    danger: 'var(--opus-danger)',
                    info: 'var(--opus-info)',
                },
            },
            borderRadius: {
                'opus-sm': 'var(--opus-radius-sm)',
                'opus-md': 'var(--opus-radius-md)',
                'opus-lg': 'var(--opus-radius-lg)',
            },
            fontFamily: {
                opus: 'var(--opus-font)',
                'opus-mono': 'var(--opus-font-mono)',
            },
            boxShadow: {
                'opus-glow': 'var(--opus-glow)',
                'opus-glow-strong': 'var(--opus-glow-strong)',
            },
            transitionDuration: {
                opus: 'var(--opus-transition)',
            },
        },
    },
};
