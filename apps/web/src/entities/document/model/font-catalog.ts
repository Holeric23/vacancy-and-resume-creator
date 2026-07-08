export interface FontDefinition {
  family: string;
  fallback: 'sans-serif' | 'serif' | 'monospace';
  displayName: string;
  isGoogleFont: boolean;
}

export const APPROVED_FONTS: Record<string, FontDefinition> = {
  Inter: {
    family: 'Inter',
    fallback: 'sans-serif',
    displayName: 'Inter (Основной)',
    isGoogleFont: true,
  },
  Roboto: {
    family: 'Roboto',
    fallback: 'sans-serif',
    displayName: 'Roboto',
    isGoogleFont: true,
  },
  'Playfair Display': {
    family: 'Playfair Display',
    fallback: 'serif',
    displayName: 'Playfair Display (Заголовки)',
    isGoogleFont: true,
  },
  'JetBrains Mono': {
    family: 'JetBrains Mono',
    fallback: 'monospace',
    displayName: 'JetBrains Mono (Код)',
    isGoogleFont: true,
  },
  System: {
    family: 'system-ui',
    fallback: 'sans-serif',
    displayName: 'Системный шрифт',
    isGoogleFont: false,
  },
};

/**
 * Превращает шрифт из каталога в безопасную CSS-строку для инлайн-стилей.
 */
export const getSafeFontStack = (fontFamilyKey: string): string => {
  const font = APPROVED_FONTS[fontFamilyKey];
  if (!font) {
    return 'system-ui, sans-serif';
  }
  return `"${font.family}", ${font.fallback}`;
};