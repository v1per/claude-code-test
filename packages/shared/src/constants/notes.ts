/**
 * Note Constants
 * Sticky note colors and defaults
 */

export const STICKY_NOTE_COLORS = {
  YELLOW: '#fef08a',
  PINK: '#fbcfe8',
  BLUE: '#bfdbfe',
  GREEN: '#bbf7d0',
  PURPLE: '#e9d5ff',
  ORANGE: '#fed7aa',
} as const;

export const DEFAULT_NOTE_COLOR = STICKY_NOTE_COLORS.YELLOW;

export const DEFAULT_NOTE_POSITION = {
  X: 100,
  Y: 100,
} as const;

export type StickyNoteColor = typeof STICKY_NOTE_COLORS[keyof typeof STICKY_NOTE_COLORS];
