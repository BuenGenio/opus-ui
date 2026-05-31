/**
 * Toast API. Call from anywhere; render with a single `<OToastViewport />`
 * mounted at the app root.
 *
 * @example
 *   const toast = useToast();
 *   toast.success('Saved.');
 *   toast.danger('Could not save.', { title: 'Network error', duration: 6000 });
 */
import type { OuToast } from '../types';

type ToastListener = (toast: OuToast) => void;

const listeners = new Set<ToastListener>();
let counter = 0;

export interface ToastOptions {
    title?: string;
    /** Auto-dismiss after this many ms. Pass 0 for sticky. Default 4000. */
    duration?: number;
    icon?: string;
}

function emit(variant: OuToast['variant'], message: string, opts: ToastOptions = {}): number {
    counter += 1;
    const toast: OuToast = {
        id: counter,
        variant,
        message,
        title: opts.title,
        icon: opts.icon,
        duration: opts.duration ?? 4000,
    };
    for (const l of listeners) l(toast);
    return toast.id;
}

/** Internal API for OToastViewport — not part of the public surface. */
export function _subscribeToast(fn: ToastListener): () => void {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
}

export interface ToastApi {
    show: (message: string, opts?: ToastOptions) => number;
    info: (message: string, opts?: ToastOptions) => number;
    success: (message: string, opts?: ToastOptions) => number;
    warning: (message: string, opts?: ToastOptions) => number;
    danger: (message: string, opts?: ToastOptions) => number;
}

export function useToast(): ToastApi {
    return {
        show: (message, opts) => emit('neutral', message, opts),
        info: (message, opts) => emit('info', message, opts),
        success: (message, opts) => emit('success', message, opts),
        warning: (message, opts) => emit('warning', message, opts),
        danger: (message, opts) => emit('danger', message, opts),
    };
}
