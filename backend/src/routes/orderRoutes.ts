import { Router, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { 
  createOrder, 
  getOrders, 
  getOrdersByCustomer, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { getDb } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';
const router = Router();

// Optional auth helper to check if user is logged in, but not block guest checkout
const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const db = await getDb();
    const user = await db.get(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Suppress token errors to allow guest checkout
  }
  next();
};

// Customer and Guest order placement
router.post('/', optionalAuth as any, createOrder as any);

// Scoped orders list (Admin sees all, Customer sees their own)
router.get('/', authMiddleware as any, getOrders as any);

// Admin-only updates and customer phone order lookups
router.get('/customer/:phone', getOrdersByCustomer as any);
router.get('/:id', getOrderById as any);
router.put('/:id/status', authMiddleware as any, adminMiddleware as any, updateOrderStatus as any);

export default router;
