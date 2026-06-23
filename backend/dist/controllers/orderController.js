"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrdersByCustomer = exports.getOrders = exports.createOrder = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const orderItemSchema = zod_1.z.object({
    product: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        image: zod_1.z.string().optional()
    }),
    quantity: zod_1.z.number().int().positive(),
    selectedSize: zod_1.z.enum(['small', 'medium', 'large']),
    selectedSugar: zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(25), zod_1.z.literal(50), zod_1.z.literal(100)]),
    selectedIce: zod_1.z.enum(['none', 'normal', 'extra']),
    selectedExtras: zod_1.z.array(zod_1.z.string()).default([]),
    customizedPrice: zod_1.z.number().nonnegative()
});
const createOrderSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(2, 'الاسم مطلوب'),
    phone: zod_1.z.string().min(10, 'رقم الهاتف غير صالح'),
    address: zod_1.z.string().min(5, 'العنوان مطلوب'),
    totalPrice: zod_1.z.number().positive(),
    deliveryFee: zod_1.z.number().nonnegative().default(10),
    paymentMethod: zod_1.z.enum(['cod', 'online']),
    items: zod_1.z.array(orderItemSchema).min(1, 'الطلب يجب أن يحتوي على مشروب واحد على الأقل')
});
const createOrder = async (req, res) => {
    try {
        const body = createOrderSchema.parse(req.body);
        const db = await (0, db_1.getDb)();
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const userId = req.user ? req.user.id : null;
        const createdAt = new Date().toISOString();
        const estimatedDelivery = '30-40 دقيقة';
        // Start database transaction using simple serial execution
        await db.run('BEGIN TRANSACTION');
        try {
            // 1. Insert main order
            await db.run(`INSERT INTO orders (
          id, userId, customerName, phone, address, totalPrice, deliveryFee, 
          status, paymentMethod, createdAt, estimatedDelivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                orderId,
                userId,
                body.customerName,
                body.phone,
                body.address,
                body.totalPrice,
                body.deliveryFee,
                'received',
                body.paymentMethod,
                createdAt,
                estimatedDelivery
            ]);
            // 2. Insert order items
            for (const item of body.items) {
                const itemId = `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                await db.run(`INSERT INTO order_items (
            id, orderId, productId, name, image, quantity, selectedSize, 
            selectedSugar, selectedIce, selectedExtras, customizedPrice
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    itemId,
                    orderId,
                    item.product.id,
                    item.product.name,
                    item.product.image || '',
                    item.quantity,
                    item.selectedSize,
                    item.selectedSugar,
                    item.selectedIce,
                    JSON.stringify(item.selectedExtras),
                    item.customizedPrice
                ]);
            }
            await db.run('COMMIT');
            // Return complete order details
            const responseOrder = {
                id: orderId,
                customerName: body.customerName,
                phone: body.phone,
                address: body.address,
                items: body.items,
                totalPrice: body.totalPrice,
                deliveryFee: body.deliveryFee,
                status: 'received',
                paymentMethod: body.paymentMethod,
                createdAt,
                estimatedDelivery
            };
            res.status(201).json(responseOrder);
        }
        catch (txError) {
            await db.run('ROLLBACK');
            throw txError;
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('createOrder error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء إتمام الطلب' });
        }
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        const db = await (0, db_1.getDb)();
        let ordersList = [];
        // Admin sees all orders. Customer sees their orders by ID or phone.
        if (req.user && req.user.role === 'admin') {
            ordersList = await db.all('SELECT * FROM orders ORDER BY createdAt DESC');
        }
        else if (req.user) {
            ordersList = await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
        }
        else {
            res.status(401).json({ error: 'غير مصرح للعملاء المجهولين بجلب الطلبات بدون مصادقة' });
            return;
        }
        const formattedOrders = [];
        for (const order of ordersList) {
            const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
            const parsedItems = items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedSugar: item.selectedSugar,
                selectedIce: item.selectedIce,
                selectedExtras: JSON.parse(item.selectedExtras || '[]'),
                customizedPrice: item.customizedPrice,
                product: {
                    id: item.productId,
                    name: item.name,
                    image: item.image
                }
            }));
            formattedOrders.push({
                ...order,
                items: parsedItems
            });
        }
        res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error('getOrders error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة الطلبات' });
    }
};
exports.getOrders = getOrders;
const getOrdersByCustomer = async (req, res) => {
    try {
        const { phone } = req.params;
        const db = await (0, db_1.getDb)();
        // Customers can search order logs by phone numbers
        const ordersList = await db.all('SELECT * FROM orders WHERE phone = ? ORDER BY createdAt DESC', [phone]);
        const formattedOrders = [];
        for (const order of ordersList) {
            const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
            const parsedItems = items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedSugar: item.selectedSugar,
                selectedIce: item.selectedIce,
                selectedExtras: JSON.parse(item.selectedExtras || '[]'),
                customizedPrice: item.customizedPrice,
                product: {
                    id: item.productId,
                    name: item.name,
                    image: item.image
                }
            }));
            formattedOrders.push({
                ...order,
                items: parsedItems
            });
        }
        res.status(200).json(formattedOrders);
    }
    catch (error) {
        console.error('getOrdersByCustomer error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب طلبات العميل' });
    }
};
exports.getOrdersByCustomer = getOrdersByCustomer;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.getDb)();
        const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
        if (!order) {
            res.status(404).json({ error: 'الطلب غير موجود' });
            return;
        }
        const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [id]);
        const parsedItems = items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedSugar: item.selectedSugar,
            selectedIce: item.selectedIce,
            selectedExtras: JSON.parse(item.selectedExtras || '[]'),
            customizedPrice: item.customizedPrice,
            product: {
                id: item.productId,
                name: item.name,
                image: item.image
            }
        }));
        res.status(200).json({
            ...order,
            items: parsedItems
        });
    }
    catch (error) {
        console.error('getOrderById error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل الطلب' });
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['received', 'preparing', 'delivering', 'completed'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'حالة الطلب غير صالحة' });
            return;
        }
        const db = await (0, db_1.getDb)();
        const order = await db.get('SELECT id FROM orders WHERE id = ?', [id]);
        if (!order) {
            res.status(404).json({ error: 'الطلب غير موجود' });
            return;
        }
        await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        // Fetch the updated order details to return
        const updatedOrder = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
        const items = await db.all('SELECT * FROM order_items WHERE orderId = ?', [id]);
        const parsedItems = items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedSugar: item.selectedSugar,
            selectedIce: item.selectedIce,
            selectedExtras: JSON.parse(item.selectedExtras || '[]'),
            customizedPrice: item.customizedPrice,
            product: {
                id: item.productId,
                name: item.name,
                image: item.image
            }
        }));
        res.status(200).json({
            ...updatedOrder,
            items: parsedItems
        });
    }
    catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة الطلب' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
