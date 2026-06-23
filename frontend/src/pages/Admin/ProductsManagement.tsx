import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Plus, Edit3, Trash2, FolderHeart, Image, DollarSign, Layers } from 'lucide-react';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../data/products';
import type { Product } from '../../types/types';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';

interface ProductFormData {
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export const ProductsManagement: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      showToast('فشل تحميل قائمة المنتجات', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      image: '',
      category: 'juices',
      price: 30
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('image', product.image);
    setValue('category', product.category);
    setValue('price', product.price);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المشروب "${name}"؟`)) return;
    try {
      await productService.deleteProduct(id);
      showToast(`تم حذف المشروب "${name}" بنجاح`, 'success');
      loadProducts();
    } catch (err) {
      showToast('فشل حذف المشروب، حاول مرة أخرى', 'error');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Edit Mode
        await productService.updateProduct(editingProduct.id, {
          name: data.name,
          description: data.description,
          image: data.image,
          category: data.category,
          price: Number(data.price)
        });
        showToast('تم تحديث بيانات المنتج بنجاح!', 'success');
      } else {
        // Create Mode
        await productService.createProduct({
          name: data.name,
          description: data.description,
          image: data.image,
          category: data.category,
          price: Number(data.price),
          availableSizes: [
            { name: 'small', label: 'صغير', priceModifier: -5 },
            { name: 'medium', label: 'وسط', priceModifier: 0 },
            { name: 'large', label: 'كبير', priceModifier: 8 }
          ],
          availableSugar: [
            { value: 0, label: 'بدون سكر' },
            { value: 25, label: 'سكر خفيف' },
            { value: 50, label: 'سكر وسط' },
            { value: 100, label: 'سكر كامل' }
          ],
          availableIce: [
            { value: 'none', label: 'بدون ثلج' },
            { value: 'normal', label: 'ثلج عادي' },
            { value: 'extra', label: 'ثلج إضافي' }
          ],
          availableExtras: [
            { name: 'honey', label: 'عسل', price: 5 },
            { name: 'cream', label: 'قشطة', price: 10 }
          ]
        });
        showToast('تم إضافة المشروب الجديد بنجاح!', 'success');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      showToast('فشل حفظ البيانات، يرجى المحاولة لاحقاً', 'error');
    }
  };

  return (
    <div className="text-right">
      <Helmet>
        <title>لوحة التحكم | إدارة المنتجات</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FolderHeart className="w-7 h-7 text-brand-orange-500" />
            <span>إدارة المنتجات</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">إضافة، تعديل، وحذف مشروبات قائمة المتجر</p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4 ml-1" />}>
          إضافة مشروب جديد
        </Button>
      </div>

      {loading ? (
        <Loader text="جاري تحميل المنتجات..." />
      ) : (
        /* Products Table list */
        <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold">
                  <th className="p-5">الصورة</th>
                  <th className="p-5">الاسم</th>
                  <th className="p-5">التصنيف</th>
                  <th className="p-5">السعر الأساسي</th>
                  <th className="p-5 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                    </td>
                    <td className="p-5 font-bold text-slate-800">{prod.name}</td>
                    <td className="p-5">
                      <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                        {CATEGORIES.find(c => c.slug === prod.category)?.name || prod.category}
                      </span>
                    </td>
                    <td className="p-5 number-font font-bold text-brand-orange-500">{prod.price} ج.م</td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 text-slate-400 hover:text-brand-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                          title="تعديل المشروب"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="حذف المشروب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal popup */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'تعديل بيانات المشروب' : 'إضافة مشروب جديد القائمة'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-right">
          <Input
            label="اسم المشروب"
            placeholder="مثال: عصير مانجو مشبر"
            leftIcon={<Layers className="w-5 h-5" />}
            error={errors.name?.message}
            {...register('name', { required: 'الاسم مطلوب' })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">وصف المشروب</label>
            <textarea
              placeholder="اكتب وصفاً جذاباً للمشروب ومكوناته..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right"
              {...register('description', { required: 'الوصف مطلوب' })}
            />
            {errors.description && <span className="text-xs text-rose-500 font-semibold">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="السعر الأساسي (ج.م)"
              type="number"
              placeholder="35"
              leftIcon={<DollarSign className="w-5 h-5" />}
              error={errors.price?.message}
              {...register('price', { required: 'السعر مطلوب', min: { value: 1, message: 'يجب أن يكون أكبر من 0' } })}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">التصنيف</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange-500 rounded-2xl text-slate-800 text-sm transition-all text-right select-none"
                {...register('category', { required: 'التصنيف مطلوب' })}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="رابط صورة المشروب"
            placeholder="https://images.unsplash.com/..."
            leftIcon={<Image className="w-5 h-5" />}
            error={errors.image?.message}
            {...register('image', { required: 'رابط الصورة مطلوب' })}
          />

          <Button type="submit" className="mt-4">
            {editingProduct ? 'تحديث المشروب' : 'إضافة المشروب'}
          </Button>
        </form>
      </Modal>

    </div>
  );
};
export default ProductsManagement;
