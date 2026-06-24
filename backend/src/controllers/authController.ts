import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/hash';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';

// Input validations
const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
});

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
});

const updateProfileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').optional(),
  phone: z.string().min(10, 'رقم الهاتف غير صالح').optional(),
  savedAddresses: z.array(z.string()).optional()
});

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);
    const db = await getDb();

    // Check if user already exists
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [body.email]);
    if (existing) {
      res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
      return;
    }

    // Hash password using native scrypt
    const hashedPassword = await hashPassword(body.password);

    // Create user ID
    const userId = `usr_${Date.now()}`;
    const defaultAddresses = '[]';

    // Insert user into DB
    await db.run(
      `INSERT INTO users (id, name, email, phone, role, password, savedAddresses) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, body.name, body.email, body.phone, 'customer', hashedPassword, defaultAddresses]
    );

    // Generate JWT
    const token = jwt.sign({ id: userId, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: userId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: 'customer',
        savedAddresses: []
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
    }
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);
    const db = await getDb();

    // Fetch user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [body.email]);
    if (!user) {
      res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      return;
    }

    // Verify password (supports both scrypt and legacy bcryptjs)
    const { isMatch, shouldUpgrade } = await comparePassword(body.password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      return;
    }

    // Asynchronously upgrade legacy bcrypt hashes to scrypt on successful login
    if (shouldUpgrade) {
      hashPassword(body.password)
        .then((newHash) => {
          db.run('UPDATE users SET password = ? WHERE id = ?', [newHash, user.id])
            .catch((err) => console.error(`Failed to upgrade password hash for user ${user.id}:`, err));
        })
        .catch((err) => console.error(`Failed to hash upgraded password for user ${user.id}:`, err));
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: statusRole(user.role) }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        savedAddresses: JSON.parse(user.savedAddresses || '[]')
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'غير مصرح' });
      return;
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      res.status(404).json({ error: 'المستخدم غير موجود' });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      savedAddresses: JSON.parse(user.savedAddresses || '[]')
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات المستخدم' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'غير مصرح' });
      return;
    }

    const body = updateProfileSchema.parse(req.body);
    const db = await getDb();

    // Fetch existing user details
    const existing = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!existing) {
      res.status(404).json({ error: 'المستخدم غير موجود' });
      return;
    }

    const name = body.name ?? existing.name;
    const phone = body.phone ?? existing.phone;
    const savedAddresses = body.savedAddresses 
      ? JSON.stringify(body.savedAddresses) 
      : existing.savedAddresses;

    // Update DB
    await db.run(
      'UPDATE users SET name = ?, phone = ?, savedAddresses = ? WHERE id = ?',
      [name, phone, savedAddresses, req.user.id]
    );

    res.status(200).json({
      id: req.user.id,
      name,
      email: existing.email,
      phone,
      role: existing.role,
      savedAddresses: JSON.parse(savedAddresses || '[]')
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء تحديث الحساب' });
    }
  }
};

// Helper for JWT roles
const statusRole = (role: string) => {
  return role === 'admin' ? 'admin' : 'customer';
};
