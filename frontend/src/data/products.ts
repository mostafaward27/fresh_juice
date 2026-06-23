import type { Product, Category } from '../types/types';

export const CATEGORIES: Category[] = [
  {
    id: 'juices',
    name: 'عصاير فريش',
    slug: 'juices',
    icon: 'Juice',
    description: 'عصائر طبيعية 100٪ محضرة يومياً من فاكهة طازجة'
  },
  {
    id: 'cocktails',
    name: 'كوكتيلات مشبرة',
    slug: 'cocktails',
    icon: 'GlassWater',
    description: 'تركيبات منعشة ومبتكرة من الفواكه والنكهات الصيفية'
  },
  {
    id: 'cold-coffee',
    name: 'قهوة باردة',
    slug: 'cold-coffee',
    icon: 'Coffee',
    description: 'إسبريسو فاخر مع الحليب البارد والنكهات الغنية والثلج'
  },
  {
    id: 'specials',
    name: 'مشروبات خاصة',
    slug: 'specials',
    icon: 'Sparkles',
    description: 'خلطات حصرية ومبتكرة لتجربة انتعاش استثنائية'
  }
];

// Sizes configuration shared across drinks
const DEFAULT_SIZES = [
  { name: 'small', label: 'صغير (300 مل)', priceModifier: -5 },
  { name: 'medium', label: 'وسط (400 مل)', priceModifier: 0 },
  { name: 'large', label: 'كبير (500 مل)', priceModifier: 8 }
] as const;

// Sugar options
const DEFAULT_SUGAR = [
  { value: 0, label: 'بدون سكر (0%)' },
  { value: 25, label: 'سكر خفيف (25%)' },
  { value: 50, label: 'سكر وسط (50%)' },
  { value: 100, label: 'سكر كامل (100%)' }
] as const;

// Ice options
const DEFAULT_ICE = [
  { value: 'none', label: 'بدون ثلج' },
  { value: 'normal', label: 'ثلج عادي' },
  { value: 'extra', label: 'ثلج إضافي (مشبر)' }
] as const;

// Extras
const DEFAULT_EXTRAS = [
  { name: 'honey', label: 'عسل طبيعي', price: 5 },
  { name: 'milk', label: 'حليب إضافي', price: 4 },
  { name: 'cream', label: 'قشطة غنية', price: 10 }
] as const;

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'عصير مانجو فريش مشبر',
    description: 'عصير مانجو طبيعي 100٪ مثلج ومنعش، مصنوع من ثمار المانجو الفريش المحضرة يومياً لتمنحك طاقة وانتعاشاً لا يُنسى.',
    image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&q=80&w=600',
    category: 'juices',
    price: 35,
    rating: 4.9,
    reviewsCount: 124,
    isFeatured: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [...DEFAULT_EXTRAS]
  },
  {
    id: '2',
    name: 'ليمون بالنعناع الفريش',
    description: 'الليمون الحامض المنعش مع أوراق النعناع الطازجة والثلج المجروش لمقاومة حر الصيف. المشروب المثالي للترطيب الفوري.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    category: 'juices',
    price: 28,
    rating: 4.8,
    reviewsCount: 98,
    isFeatured: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'honey', label: 'عسل طبيعي', price: 5 },
      { name: 'ginger', label: 'زنجبيل فريش', price: 6 }
    ]
  },
  {
    id: '3',
    name: 'كوكتيل مشبر خاص (امبراطور)',
    description: 'مزيج فاخر من عصير المانجو الطازج والأفوكادو الغني مع العسل والمكسرات المقرمشة والقشطة البلدية. وجبة منعشة متكاملة.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600',
    category: 'specials',
    price: 55,
    rating: 5.0,
    reviewsCount: 210,
    isFeatured: true,
    isSpecial: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'nuts', label: 'مكسرات إضافية', price: 12 },
      { name: 'cream', label: 'قشطة إضافية', price: 10 },
      { name: 'honey', label: 'عسل طبيعي', price: 5 }
    ]
  },
  {
    id: '4',
    name: 'موهيتو التوت الأزرق',
    description: 'مشروب فوار صيفي منعش يمزج بين سيرب التوت الأزرق الغني، قطع الليمون الحامض، أوراق النعناع، والثلج المجروش والصودا.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    category: 'cocktails',
    price: 38,
    rating: 4.7,
    reviewsCount: 86,
    isFeatured: false,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [
      { value: 50, label: 'سكر وسط (50%)' },
      { value: 100, label: 'سكر كامل (100%)' }
    ],
    availableIce: [...DEFAULT_ICE],
    availableExtras: []
  },
  {
    id: '5',
    name: 'سبانش لاتيه مثلج',
    description: 'إسبريسو غني محضر من أجود حبوب البن يمتزج مع الحليب البارد المكثف والمحلى والثلج ليعطيك توازناً رائعاً بين الحلاوة ومرارة القهوة.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    category: 'cold-coffee',
    price: 42,
    rating: 4.9,
    reviewsCount: 154,
    isFeatured: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [
      { value: 0, label: 'بدون محلي (0%)' },
      { value: 50, label: 'حلاوة متوسطة' },
      { value: 100, label: 'حلاوة كاملة' }
    ],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'caramel', label: 'صوص كراميل', price: 6 },
      { name: 'espressoshot', label: 'شوت إسبريسو إضافي', price: 10 }
    ]
  },
  {
    id: '6',
    name: 'كراميل ماكياتو مثلج',
    description: 'إسبريسو مع الحليب البارد ونكهة الفانيلا المميزة، مغطى بخيوط صوص الكراميل الذهبي اللذيذ ومبرد بالثلج.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600',
    category: 'cold-coffee',
    price: 40,
    rating: 4.6,
    reviewsCount: 75,
    isFeatured: false,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'espressoshot', label: 'شوت إسبريسو إضافي', price: 10 }
    ]
  },
  {
    id: '7',
    name: 'موهيتو الفراولة والليمون',
    description: 'مزيج منعش من الفراولة الطازجة المهروسة، أوراق النعناع، الليمون الحامض، والصودا الفوارة مع الكثير من الثلج لمذاق صيفي فائق الانتعاش.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    category: 'cocktails',
    price: 36,
    rating: 4.8,
    reviewsCount: 112,
    isFeatured: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: []
  },
  {
    id: '8',
    name: 'عصير رمان طبيعي فريش',
    description: 'عصير رمان طبيعي وخالص 100٪ بدون إضافات صناعية، غني بالفيتامينات ومبرد بلطف ليمنحك مذاقاً متوازناً بين الحموضة والحلاوة.',
    image: 'https://images.unsplash.com/photo-1629115947386-64b91e2717ce?auto=format&fit=crop&q=80&w=600',
    category: 'juices',
    price: 32,
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'honey', label: 'عسل طبيعي', price: 5 }
    ]
  },
  {
    id: '9',
    name: 'مخفوق الفستق والباشن فروت البارد',
    description: 'مشروب مبتكر وخاص يجمع بين نكهة الباشن فروت المنعشة والمركزة وكريمة الفستق الحلبي الغنية مع الحليب المكثف والثلج.',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600',
    category: 'specials',
    price: 52,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    isSpecial: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'cream', label: 'قشطة إضافية', price: 10 },
      { name: 'pistachio', label: 'فستق حلبي مجروش', price: 15 }
    ]
  },
  {
    id: '10',
    name: 'عصير أفوكادو بالعسل والقشطة',
    description: 'قطع أفوكادو ناضجة ممزوجة بالكريمة الغنية والحليب الطازج، مغطاة بطبقة سخية من العسل والمكسرات والقشطة البلدية.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600',
    category: 'specials',
    price: 48,
    rating: 4.9,
    reviewsCount: 142,
    isFeatured: true,
    isSpecial: true,
    availableSizes: [...DEFAULT_SIZES],
    availableSugar: [...DEFAULT_SUGAR],
    availableIce: [...DEFAULT_ICE],
    availableExtras: [
      { name: 'nuts', label: 'مكسرات إضافية', price: 12 },
      { name: 'honey', label: 'عسل طبيعي', price: 5 }
    ]
  }
];
