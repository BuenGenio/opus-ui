import type { Component } from 'vue';

/**
 * Shared type vocabulary used across opus-ui components.
 */

export type OuColorVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type OuSize = 'sm' | 'md' | 'lg';
export type OuAs = string | Component;

/** Responsive column counts for OCardGrid (mobile-first). */
export interface OuResponsiveCols {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

/** A pending toast as it travels from `useToast` to `<OToastViewport>`. */
export interface OuToast {
    id: number;
    variant: OuColorVariant;
    title?: string;
    message: string;
    /** Milliseconds before auto-dismiss; 0 = sticky. */
    duration: number;
    icon?: string;
}

/** Minimum surface a "link" component needs to be plugged into OCardLink / OMenuItem.
 *  Lets you pass Inertia's <Link>, Vue Router's <RouterLink>, or plain 'a'. */
export type OuLinkComponent = string | Component;
