export const CATEGORIES = {
  'Silver 925': {
    'Sets': ['Earrings & Pendant Set'],
    'Individual Items': ['Bangles', 'Bracelets', 'Brooches', 'Chains', 'Earrings', 'Mangalsutra', 'Nose Pin', 'Pendant', 'Rings']
  },
  'Imitation': {
    'Sets': ['Earrings & Pendant Set'],
    'Individual Items': ['Bangles', 'Bracelets', 'Brooches', 'Chains', 'Earrings', 'Mangalsutra', 'Nose Pin', 'Pendant', 'Rings']
  }
} as const;

export const COLLECTIONS = [
  'Everyday Essentials',
  'Office Wear',
  'Festive Edition',
  'Party Wear',
  'Wedding Essentials',
  'Gifting',
] as const;

export const FEATURES_MARQUEE = [
  '✦ Exclusive Designs',
  '✦ Pair with Indian or Western',
  '✦ 100% Payment Secure',
  '✦ Free Shipping',
  '✦ 7 Days Return Policy',
  '✦ Happy Customers',
];

export type MainCategory = keyof typeof CATEGORIES;
export type SubCategory = typeof CATEGORIES[MainCategory][keyof typeof CATEGORIES[MainCategory]][number];
