export interface DialColorSwatch {
  accent: string;
  background: string;
  border?: string;
  boxShadow?: string;
}

export const DIAL_COLOR_OPTIONS: string[] = [
  'Black',
  'White',
  'Silver',
  'Grey',
  'Blue',
  'Navy Blue',
  'Sky Blue',
  'Tiffany Blue',
  'Green',
  'Olive Green',
  'Red',
  'Burgundy',
  'Brown',
  'Champagne',
  'Gold',
  'Rose Gold',
  'Yellow',
  'Orange',
  'Pink',
  'Salmon',
  'Purple',
  'Cream',
  'Ivory',
  'Beige',
  'Bronze',
  'Copper',
  'Turquoise',
  'Teal',
  'Slate',
  'Anthracite',
  'Charcoal',
  'Meteorite',
  'Mother of Pearl',
  'Skeleton / Open-Worked',
  'Panda',
  'Reverse Panda',
  'Smoked / Fumé',
  'Gradient',
];

const DIAL_COLOR_STYLE_ENTRIES: Array<[string, DialColorSwatch]> = [
  ['black', { accent: '#000000', background: '#000000' }],
  [
    'white',
    {
      accent: '#c9c9c9',
      background: '#ffffff',
      border: '1px solid #d9d9d9',
    },
  ],
  ['silver', { accent: '#9ea4aa', background: '#c0c0c0' }],
  ['grey', { accent: '#6b7280', background: '#808080' }],
  ['gray', { accent: '#6b7280', background: '#808080' }],
  ['blue', { accent: '#0057b8', background: '#0057b8' }],
  ['navy blue', { accent: '#1b2951', background: '#1b2951' }],
  ['sky blue', { accent: '#4aa3d8', background: '#87ceeb' }],
  ['tiffany blue', { accent: '#0abab5', background: '#0abab5' }],
  ['green', { accent: '#008000', background: '#008000' }],
  ['olive green', { accent: '#556b2f', background: '#556b2f' }],
  ['red', { accent: '#c00000', background: '#c00000' }],
  ['burgundy', { accent: '#800020', background: '#800020' }],
  ['brown', { accent: '#8b4513', background: '#8b4513' }],
  ['champagne', { accent: '#c7b79a', background: '#f7e7ce' }],
  ['gold', { accent: '#b18a2d', background: '#d4af37' }],
  ['rose gold', { accent: '#b76e79', background: '#b76e79' }],
  ['yellow', { accent: '#d4a000', background: '#ffd700' }],
  ['orange', { accent: '#ff8c00', background: '#ff8c00' }],
  ['pink', { accent: '#e67ca4', background: '#ffc0cb' }],
  ['salmon', { accent: '#d46f63', background: '#fa8072' }],
  ['purple', { accent: '#800080', background: '#800080' }],
  [
    'cream',
    {
      accent: '#d5caa4',
      background: '#fffdd0',
      border: '1px solid #ddd5b4',
    },
  ],
  [
    'ivory',
    {
      accent: '#d7cfb1',
      background: '#fffff0',
      border: '1px solid #ddd8c2',
    },
  ],
  [
    'beige',
    {
      accent: '#c9b79c',
      background: '#f5f5dc',
      border: '1px solid #d9cfb8',
    },
  ],
  ['bronze', { accent: '#9e622a', background: '#cd7f32' }],
  ['copper', { accent: '#9f5c2e', background: '#b87333' }],
  ['turquoise', { accent: '#2cb6aa', background: '#40e0d0' }],
  ['teal', { accent: '#006d6d', background: '#008080' }],
  ['slate', { accent: '#51606f', background: '#708090' }],
  ['anthracite', { accent: '#2f3438', background: '#383e42' }],
  ['charcoal', { accent: '#2a363f', background: '#36454f' }],
  [
    'meteorite',
    {
      accent: '#4a4f57',
      background: 'linear-gradient(135deg, #606775 0%, #4a4f57 50%, #383c44 100%)',
    },
  ],
  [
    'mother of pearl',
    {
      accent: '#d8cfc4',
      background:
        'linear-gradient(135deg, #f7f3ee 0%, #ffffff 28%, #ebe3db 52%, #f8e8ef 76%, #f0ede8 100%)',
      border: '1px solid #ddd6cf',
    },
  ],
  [
    'skeleton open worked',
    {
      accent: '#7e8790',
      background:
        'repeating-linear-gradient(45deg, #232323 0 3px, #8d98a3 3px 6px, #4b5259 6px 9px)',
    },
  ],
  [
    'panda',
    {
      accent: '#222222',
      background: 'linear-gradient(90deg, #ffffff 0 50%, #1b1b1b 50% 100%)',
      border: '1px solid #d9d9d9',
    },
  ],
  [
    'reverse panda',
    {
      accent: '#f4f4f4',
      background: 'linear-gradient(90deg, #1b1b1b 0 50%, #ffffff 50% 100%)',
      border: '1px solid #d9d9d9',
    },
  ],
  [
    'smoked fume',
    {
      accent: '#5c4b51',
      background:
        'radial-gradient(circle at 50% 35%, #8c7b82 0%, #5c4b51 45%, #2f2f35 100%)',
    },
  ],
  [
    'gradient',
    {
      accent: '#1f6feb',
      background: 'linear-gradient(135deg, #1f6feb 0%, #00b8a9 45%, #f59e0b 100%)',
    },
  ],
];

export const normalizeDialColor = (color: string): string =>
  color
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const DIAL_COLOR_STYLE_MAP = DIAL_COLOR_STYLE_ENTRIES.reduce(
  (styleMap, [color, style]) => {
    styleMap[normalizeDialColor(color)] = style;
    return styleMap;
  },
  {} as Record<string, DialColorSwatch>,
);

export const DEFAULT_DIAL_COLOR_SWATCH: DialColorSwatch = {
  accent: '#8a8f6a',
  background: '#d4d4d4',
  border: '1px solid #d9d9d9',
};

export const getDialColorSwatch = (color: string): DialColorSwatch =>
  DIAL_COLOR_STYLE_MAP[normalizeDialColor(color)] ?? DEFAULT_DIAL_COLOR_SWATCH;
