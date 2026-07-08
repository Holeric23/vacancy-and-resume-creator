import { Size } from './geometry.ts';

export type PageOrientation = 'portrait' | 'landscape';

export type PagePresetName = 'A3' | 'A4' | 'A5' | 'letter';

export interface PageFormatPreset {
  name: string;
  widthMm: number;
  heightMm: number;
  displayName: string;
}

export const PAGE_PRESETS: Record<PagePresetName, PageFormatPreset> = {
  A3: {
    name: 'A3',
    widthMm: 297,
    heightMm: 420,
    displayName: 'A3 (Постер)',
  },
  A4: {
    name: 'A4',
    widthMm: 210,
    heightMm: 297,
    displayName: 'A4 (Стандарт)',
  },
  A5: {
    name: 'A5',
    widthMm: 148,
    heightMm: 210,
    displayName: 'A5 (Брошюра)',
  },
  letter: {
    name: 'letter',
    widthMm: 215.9,
    heightMm: 279.4,
    displayName: 'US Letter (США)',
  },
} as const;

export const getPageSize = (preset: PagePresetName, orientation: PageOrientation): Size => {
  const base = PAGE_PRESETS[preset];
  if (orientation === 'portrait') {
    return { width: base.widthMm, height: base.heightMm };
  }
  return { width: base.heightMm, height: base.widthMm };
};