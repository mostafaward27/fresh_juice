"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImage = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Zod schema validation for Product Customizations
const sizeSchema = zod_1.z.object({
    name: zod_1.z.enum(['small', 'medium', 'large']),
    label: zod_1.z.string(),
    priceModifier: zod_1.z.number()
});
const sugarSchema = zod_1.z.object({
    value: zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(25), zod_1.z.literal(50), zod_1.z.literal(100)]),
    label: zod_1.z.string()
});
const iceSchema = zod_1.z.object({
    value: zod_1.z.enum(['none', 'normal', 'extra']),
    label: zod_1.z.string()
});
const extraSchema = zod_1.z.object({
    name: zod_1.z.string(),
    label: zod_1.z.string(),
    price: zod_1.z.number()
});
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'اسم المنتج مطلوب'),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().url('رابط الصورة غير صالح'),
    category: zod_1.z.string().min(1, 'التصنيف مطلوب'),
    price: zod_1.z.number().positive('السعر الأساسي يجب أن يكون موجب'),
    isFeatured: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number()]).optional(),
    isSpecial: zod_1.z.union([zod_1.z.boolean(), zod_1.z.number()]).optional(),
    availableSizes: zod_1.z.array(sizeSchema).default([]),
    availableSugar: zod_1.z.array(sugarSchema).default([]),
    availableIce: zod_1.z.array(iceSchema).default([]),
    availableExtras: zod_1.z.array(extraSchema).default([])
});
// Configure Cloudinary if keys exist
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}
const getProducts = async (req, res) => {
    try {
        const { category, q } = req.query;
        const db = await (0, db_1.getDb)();
        let queryStr = 'SELECT * FROM products WHERE 1=1';
        const params = [];
        if (category) {
            queryStr += ' AND category = ?';
            params.push(category);
        }
        if (q) {
            queryStr += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        // Sort by order/newest
        queryStr += ' ORDER BY createdAt DESC';
        const products = await db.all(queryStr, params);
        // Parse JSON string fields back to arrays
        const formatted = products.map((p) => ({
            ...p,
            isFeatured: !!p.isFeatured,
            isSpecial: !!p.isSpecial,
            availableSizes: JSON.parse(p.availableSizes || '[]'),
            availableSugar: JSON.parse(p.availableSugar || '[]'),
            availableIce: JSON.parse(p.availableIce || '[]'),
            availableExtras: JSON.parse(p.availableExtras || '[]')
        }));
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error('getProducts error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المنتجات' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.getDb)();
        const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
        if (!product) {
            res.status(404).json({ error: 'المنتج غير موجود' });
            return;
        }
        const formatted = {
            ...product,
            isFeatured: !!product.isFeatured,
            isSpecial: !!product.isSpecial,
            availableSizes: JSON.parse(product.availableSizes || '[]'),
            availableSugar: JSON.parse(product.availableSugar || '[]'),
            availableIce: JSON.parse(product.availableIce || '[]'),
            availableExtras: JSON.parse(product.availableExtras || '[]')
        };
        res.status(200).json(formatted);
    }
    catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل المنتج' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const body = productSchema.parse(req.body);
        const db = await (0, db_1.getDb)();
        const id = `prod_${Date.now()}`;
        const isFeatured = body.isFeatured ? 1 : 0;
        const isSpecial = body.isSpecial ? 1 : 0;
        await db.run(`INSERT INTO products (
        id, name, description, image, category, price, rating, reviewsCount, 
        isFeatured, isSpecial, availableSizes, availableSugar, availableIce, availableExtras
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            body.name,
            body.description || '',
            body.image,
            body.category,
            body.price,
            5.0, // Initial rating
            1, // Initial review count
            isFeatured,
            isSpecial,
            JSON.stringify(body.availableSizes),
            JSON.stringify(body.availableSugar),
            JSON.stringify(body.availableIce),
            JSON.stringify(body.availableExtras)
        ]);
        const newProduct = {
            id,
            ...body,
            isFeatured: !!isFeatured,
            isSpecial: !!isSpecial,
            rating: 5.0,
            reviewsCount: 1
        };
        res.status(201).json(newProduct);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('createProduct error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء إضافة المنتج' });
        }
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.getDb)();
        const existing = await db.get('SELECT * FROM products WHERE id = ?', [id]);
        if (!existing) {
            res.status(404).json({ error: 'المنتج غير موجود' });
            return;
        }
        const partialSchema = productSchema.partial();
        const body = partialSchema.parse(req.body);
        const name = body.name ?? existing.name;
        const description = body.description !== undefined ? body.description : existing.description;
        const image = body.image ?? existing.image;
        const category = body.category ?? existing.category;
        const price = body.price ?? existing.price;
        let isFeatured = existing.isFeatured;
        if (body.isFeatured !== undefined) {
            isFeatured = body.isFeatured ? 1 : 0;
        }
        let isSpecial = existing.isSpecial;
        if (body.isSpecial !== undefined) {
            isSpecial = body.isSpecial ? 1 : 0;
        }
        const availableSizes = body.availableSizes
            ? JSON.stringify(body.availableSizes)
            : existing.availableSizes;
        const availableSugar = body.availableSugar
            ? JSON.stringify(body.availableSugar)
            : existing.availableSugar;
        const availableIce = body.availableIce
            ? JSON.stringify(body.availableIce)
            : existing.availableIce;
        const availableExtras = body.availableExtras
            ? JSON.stringify(body.availableExtras)
            : existing.availableExtras;
        await db.run(`UPDATE products SET 
        name = ?, description = ?, image = ?, category = ?, price = ?, 
        isFeatured = ?, isSpecial = ?, availableSizes = ?, availableSugar = ?, 
        availableIce = ?, availableExtras = ?
       WHERE id = ?`, [
            name,
            description,
            image,
            category,
            price,
            isFeatured,
            isSpecial,
            availableSizes,
            availableSugar,
            availableIce,
            availableExtras,
            id
        ]);
        res.status(200).json({
            id,
            name,
            description,
            image,
            category,
            price,
            rating: existing.rating,
            reviewsCount: existing.reviewsCount,
            isFeatured: !!isFeatured,
            isSpecial: !!isSpecial,
            availableSizes: JSON.parse(availableSizes || '[]'),
            availableSugar: JSON.parse(availableSugar || '[]'),
            availableIce: JSON.parse(availableIce || '[]'),
            availableExtras: JSON.parse(availableExtras || '[]')
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('updateProduct error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء تحديث المنتج' });
        }
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.getDb)();
        const existing = await db.get('SELECT id FROM products WHERE id = ?', [id]);
        if (!existing) {
            res.status(404).json({ error: 'المنتج غير موجود' });
            return;
        }
        await db.run('DELETE FROM products WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'تم حذف المنتج بنجاح' });
    }
    catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف المنتج' });
    }
};
exports.deleteProduct = deleteProduct;
const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'الرجاء اختيار ملف الصورة لتحميله' });
            return;
        }
        // Cloudinary upload if config keys exist
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            // Create a temporary stream upload to Cloudinary from memory buffer
            const uploadStream = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'shabar_products' }, (error, result) => {
                        if (result)
                            resolve(result.secure_url);
                        else
                            reject(error);
                    });
                    stream.write(req.file.buffer);
                    stream.end();
                });
            };
            const imageUrl = await uploadStream();
            res.status(200).json({ imageUrl });
        }
        else {
            // Local fallback: write buffer to backend/public/uploads/
            const uploadsDir = path_1.default.resolve(__dirname, '../../public/uploads');
            if (!fs_1.default.existsSync(uploadsDir)) {
                fs_1.default.mkdirSync(uploadsDir, { recursive: true });
            }
            const fileExtension = path_1.default.extname(req.file.originalname) || '.png';
            const filename = `product_${Date.now()}${fileExtension}`;
            const filePath = path_1.default.join(uploadsDir, filename);
            fs_1.default.writeFileSync(filePath, req.file.buffer);
            const serverUrl = `${req.protocol}://${req.get('host')}`;
            const imageUrl = `${serverUrl}/uploads/${filename}`;
            res.status(200).json({ imageUrl });
        }
    }
    catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحميل الصورة' });
    }
};
exports.uploadProductImage = uploadProductImage;
