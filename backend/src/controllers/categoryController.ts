import { Request, Response } from 'express';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = [
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

  res.status(200).json(categories);
};
