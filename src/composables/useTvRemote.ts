/**
 * Smart-TV remote / keyboard input normaliser.
 *
 * TV browsers (Samsung Tizen, LG webOS, Android TV) deliver the D-pad as
 * arrow keys, OK as Enter, and "Back" through a handful of vendor-specific
 * key codes. This maps them all onto a tiny stable vocabulary so menus and
 * pages can be driven entirely from a remote.
 *
 * @example
 *   useTvRemote((key) => {
 *     if (key === 'left')  focus.value = (focus.value - 1 + n) % n;
 *     if (key === 'right') focus.value = (focus.value + 1) % n;
 *     if (key === 'enter') open(items[focus.value]);
 *     if (key === 'back')  router.visit('/');
 *   });
 */
import { onBeforeUnmount, onMounted } from 'vue';

export type OuRemoteKey = 'up' | 'down' | 'left' | 'right' | 'enter' | 'back' | 'pause';

export function normalizeRemoteKey(e: KeyboardEvent): OuRemoteKey | null {
    switch (e.key) {
        case 'ArrowUp':
        case 'Up':
            return 'up';
        case 'ArrowDown':
        case 'Down':
            return 'down';
        case 'ArrowLeft':
        case 'Left':
            return 'left';
        case 'ArrowRight':
        case 'Right':
            return 'right';
        case 'Enter':
        case ' ':
        case 'Spacebar':
            return 'enter';
        case 'Escape':
        case 'Backspace':
        case 'GoBack':
        case 'BrowserBack':
        case 'XF86Back':
            return 'back';
        case 'p':
        case 'P':
            return 'pause';
    }
    switch (e.keyCode) {
        case 38: return 'up';
        case 40: return 'down';
        case 37: return 'left';
        case 39: return 'right';
        case 13:
        case 32:
            return 'enter';
        case 8:
        case 27:
        case 10009: // Tizen Return
        case 461:   // webOS Back
            return 'back';
        default:
            return null;
    }
}

interface TvRemoteOptions {
    /** Skip handling while this returns false (e.g. game is paused, modal open). */
    enabled?: () => boolean;
    /** Call `preventDefault()` on recognised keys. Default `true` (stops TV scroll). */
    preventDefault?: boolean;
}

/**
 * Attach a normalised keydown handler for the lifetime of the component.
 */
export function useTvRemote(
    handler: (key: OuRemoteKey, event: KeyboardEvent) => void,
    options: TvRemoteOptions = {},
): void {
    function onKeyDown(e: KeyboardEvent): void {
        if (options.enabled && !options.enabled()) return;
        const key = normalizeRemoteKey(e);
        if (!key) return;
        if (options.preventDefault !== false) e.preventDefault();
        handler(key, e);
    }

    onMounted(() => window.addEventListener('keydown', onKeyDown));
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown));
}
