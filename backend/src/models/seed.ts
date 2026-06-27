import { getDb, initDb } from '../config/db';
import { hashPassword } from '../utils/hash';

const DEFAULT_SIZES = [
  { name: 'small', label: 'صغير (300 مل)', priceModifier: -5 },
  { name: 'medium', label: 'وسط (400 مل)', priceModifier: 0 },
  { name: 'large', label: 'كبير (500 مل)', priceModifier: 8 }
];

const DEFAULT_SUGAR = [
  { value: 0, label: 'بدون سكر (0%)' },
  { value: 25, label: 'سكر خفيف (25%)' },
  { value: 50, label: 'سكر وسط (50%)' },
  { value: 100, label: 'سكر كامل (100%)' }
];

const DEFAULT_ICE = [
  { value: 'none', label: 'بدون ثلج' },
  { value: 'normal', label: 'ثلج عادي' },
  { value: 'extra', label: 'ثلج إضافي (مشبر)' }
];

const DEFAULT_EXTRAS = [
  { name: 'honey', label: 'عسل طبيعي', price: 5 },
  { name: 'milk', label: 'حليب إضافي', price: 4 },
  { name: 'cream', label: 'قشطة غنية', price: 10 }
];

const seedProducts = [
  {
    id: '1',
    name: 'عصير مانجو فريش مشبر',
    description: 'عصير مانجو طبيعي 100٪ مثلج ومنعش، مصنوع من ثمار المانجو الفريش المحضرة يومياً لتمنحك طاقة وانتعاشاً لا يُنسى.',
    image: 'https://theallnaturalvegan.com/wp-content/uploads/2025/07/mango-pineapple-juice.jpg',
    category: 'juices',
    price: 35,
    rating: 4.9,
    reviewsCount: 124,
    isFeatured: 1,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
    availableExtras: DEFAULT_EXTRAS
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
    isFeatured: 1,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 1,
    isSpecial: 1,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 0,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: [
      { value: 50, label: 'سكر وسط (50%)' },
      { value: 100, label: 'سكر كامل (100%)' }
    ],
    availableIce: DEFAULT_ICE,
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
    isFeatured: 1,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: [
      { value: 0, label: 'بدون محلي (0%)' },
      { value: 50, label: 'حلاوة متوسطة' },
      { value: 100, label: 'حلاوة كاملة' }
    ],
    availableIce: DEFAULT_ICE,
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
    isFeatured: 0,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 1,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 0,
    isSpecial: 0,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 0,
    isSpecial: 1,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
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
    isFeatured: 1,
    isSpecial: 1,
    availableSizes: DEFAULT_SIZES,
    availableSugar: DEFAULT_SUGAR,
    availableIce: DEFAULT_ICE,
    availableExtras: [
      { name: 'nuts', label: 'مكسرات إضافية', price: 12 },
      { name: 'honey', label: 'عسل طبيعي', price: 5 }
    ]
  }
];

const seed = async () => {
  try {
    await initDb();
    const db = await getDb();

    // Clear existing data
    await db.run('DELETE FROM users');
    await db.run('DELETE FROM products');
    await db.run('DELETE FROM orders');
    await db.run('DELETE FROM order_items');

    console.log('Database tables cleared.');

    // Seed default users
    const adminPassword = await hashPassword('admin123');
    const userPassword = await hashPassword('user123');

    await db.run(
      `INSERT INTO users (id, name, email, phone, role, password, savedAddresses) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['usr_admin', 'مدير النظام', 'admin@mshabar.com', '01012345678', 'admin', adminPassword, '[]']
    );

    await db.run(
      `INSERT INTO users (id, name, email, phone, role, password, savedAddresses) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'usr_customer',
        'أحمد علي',
        'user@mshabar.com',
        '01234567890',
        'customer',
        userPassword,
        JSON.stringify(['12 شارع التحرير، الدقي، الجيزة', 'مول العرب، الشيخ زايد'])
      ]
    );

    console.log('Seeded users (admin and customer).');

    // Seed products
    for (const prod of seedProducts) {
      await db.run(
        `INSERT INTO products (
          id, name, description, image, category, price, rating, reviewsCount, 
          isFeatured, isSpecial, availableSizes, availableSugar, availableIce, availableExtras
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          prod.name,
          prod.description,
          prod.image,
          prod.category,
          prod.price,
          prod.rating,
          prod.reviewsCount,
          prod.isFeatured,
          prod.isSpecial,
          JSON.stringify(prod.availableSizes),
          JSON.stringify(prod.availableSugar),
          JSON.stringify(prod.availableIce),
          JSON.stringify(prod.availableExtras)
        ]
      );
    }

    console.log(`Seeded ${seedProducts.length} products successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
};

seed();
