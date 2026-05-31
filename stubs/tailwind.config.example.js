/*
 * Example Tailwind config for a Laravel + Inertia + Vue 3 project using
 * opus-ui. Drop this at the project root as `tailwind.config.js`.
 *
 * The preset exposes the opus-ui design tokens as Tailwind utilities, so
 * you can mix them with the bundled components — e.g.
 *   <div class="bg-opus-surface text-opus-muted rounded-opus-md p-4">
 */
import opusPreset from 'opus-ui/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [opusPreset],
    content: [
        './resources/**/*.{vue,ts,js,blade.php}',
        // Tell Tailwind to scan opus-ui's source too, so its utilities are
        // generated even though they live in node_modules.
        './node_modules/opus-ui/src/**/*.{vue,ts}',
    ],
    theme: {
        extend: {
            // Add your project-specific extensions here.
        },
    },
    plugins: [],
};
