"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';
// Input validations
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: zod_1.z.string().email('بريد إلكتروني غير صالح'),
    phone: zod_1.z.string().min(10, 'رقم الهاتف غير صالح'),
    password: zod_1.z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('بريد إلكتروني غير صالح'),
    password: zod_1.z.string().min(1, 'كلمة المرور مطلوبة')
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').optional(),
    phone: zod_1.z.string().min(10, 'رقم الهاتف غير صالح').optional(),
    savedAddresses: zod_1.z.array(zod_1.z.string()).optional()
});
const register = async (req, res) => {
    try {
        const body = registerSchema.parse(req.body);
        const db = await (0, db_1.getDb)();
        // Check if user already exists
        const existing = await db.get('SELECT id FROM users WHERE email = ?', [body.email]);
        if (existing) {
            res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(body.password, salt);
        // Create user ID
        const userId = `usr_${Date.now()}`;
        const defaultAddresses = '[]';
        // Insert user into DB
        await db.run(`INSERT INTO users (id, name, email, phone, role, password, savedAddresses) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [userId, body.name, body.email, body.phone, 'customer', hashedPassword, defaultAddresses]);
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: userId, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
        }
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const body = loginSchema.parse(req.body);
        const db = await (0, db_1.getDb)();
        // Fetch user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [body.email]);
        if (!user) {
            res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
            return;
        }
        // Verify password
        const isMatch = await bcryptjs_1.default.compare(body.password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: statusRole(user.role) }, JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('Login error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
        }
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'غير مصرح' });
            return;
        }
        const db = await (0, db_1.getDb)();
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
    }
    catch (error) {
        console.error('getMe error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات المستخدم' });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'غير مصرح' });
            return;
        }
        const body = updateProfileSchema.parse(req.body);
        const db = await (0, db_1.getDb)();
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
        await db.run('UPDATE users SET name = ?, phone = ?, savedAddresses = ? WHERE id = ?', [name, phone, savedAddresses, req.user.id]);
        res.status(200).json({
            id: req.user.id,
            name,
            email: existing.email,
            phone,
            role: existing.role,
            savedAddresses: JSON.parse(savedAddresses || '[]')
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'حدث خطأ أثناء تحديث الحساب' });
        }
    }
};
exports.updateProfile = updateProfile;
// Helper for JWT roles
const statusRole = (role) => {
    return role === 'admin' ? 'admin' : 'customer';
};
