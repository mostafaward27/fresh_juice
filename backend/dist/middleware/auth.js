"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'غير مصرح، الرجاء تسجيل الدخول أولاً' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const db = await (0, db_1.getDb)();
        const user = await db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', [decoded.id]);
        if (!user) {
            res.status(401).json({ error: 'المستخدم غير موجود أو تم حذفه' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'جلسة عمل غير صالحة أو منتهية، الرجاء تسجيل الدخول مجدداً' });
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ error: 'صلاحيات غير كافية، هذا الإجراء يتطلب حساب مدير' });
    }
};
exports.adminMiddleware = adminMiddleware;
