import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/db';
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    phone?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'غير مصرح، الرجاء تسجيل الدخول أولاً' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    const db = await getDb();
    const user = await db.get(
      'SELECT id, name, email, phone, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      res.status(401).json({ error: 'المستخدم غير موجود أو تم حذفه' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'جلسة عمل غير صالحة أو منتهية، الرجاء تسجيل الدخول مجدداً' });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'صلاحيات غير كافية، هذا الإجراء يتطلب حساب مدير' });
  }
};
