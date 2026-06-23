import { Response } from 'express';
import { z } from 'zod';
import { getDb, getFreshDb } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

const orderItemSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().optional()
  }),
  quantity: z.number().int().positive(),
  selectedSize: z.enum(['small', 'medium', 'large']),
  selectedSugar: z.union([z.literal(0), z.literal(25), z.literal(50), z.literal(100)]),
  selectedIce: z.enum(['none', 'normal', 'extra']),
  selectedExtras: z.array(z.string()).default([]),
  customizedPrice: z.number().nonnegative()
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  address: z.string().min(5, 'العنوان مطلوب'),
  totalPrice: z.number().positive(),
  deliveryFee: z.number().nonnegative().default(10),
  paymentMethod: z.enum(['cod', 'online']),
  items: z.array(orderItemSchema).min(1, 'الطلب يجب أن يحتوي على مشروب واحد على الأقل')
});

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  let db;
  try {
    const body = createOrderSchema.parse(req.body);
    db = await getFreshDb();

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = req.user ? req.user.id : null;
    const createdAt = new Date().toISOString();
    const estimatedDelivery = '30-40 دقيقة';

    // Start database transaction on a dedicated connection
    await db.run('BEGIN TRANSACTION');

    try {
      // 1. Insert main order
      await db.run(
        `INSERT INTO orders (
          id, userId, customerName, phone, address, totalPrice, deliveryFee, 
          status, paymentMethod, createdAt, estimatedDelivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );

      // 2. Insert order items
      for (const item of body.items) {
        const itemId = `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await db.run(
          `INSERT INTO order_items (
            id, orderId, productId, name, image, quantity, selectedSize, 
            selectedSugar, selectedIce, selectedExtras, customizedPrice
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
          ]
        );
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
    } catch (txError) {
      await db.run('ROLLBACK');
      throw txError;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error('createOrder error:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء إتمام الطلب' });
    }
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (closeErr) {
        console.error('Failed to close dedicated transaction connection:', closeErr);
      }
    }
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    let ordersList = [];

    // Admin sees all orders. Customer sees their orders by ID or phone.
    if (req.user && req.user.role === 'admin') {
      ordersList = await db.all('SELECT * FROM orders ORDER BY createdAt DESC');
    } else if (req.user) {
      ordersList = await db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
    } else {
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
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب قائمة الطلبات' });
  }
};

export const getOrdersByCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { phone } = req.params;
    const db = await getDb();

    // Customers can search order logs by phone numbers
    const ordersList = await db.all(
      'SELECT * FROM orders WHERE phone = ? ORDER BY createdAt DESC',
      [phone]
    );

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
  } catch (error) {
    console.error('getOrdersByCustomer error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب طلبات العميل' });
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = await getDb();

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
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب تفاصيل الطلب' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['received', 'preparing', 'delivering', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'حالة الطلب غير صالحة' });
      return;
    }

    const db = await getDb();
    
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
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث حالة الطلب' });
  }
};
