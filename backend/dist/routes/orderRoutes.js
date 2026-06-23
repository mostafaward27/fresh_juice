"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shabar_key_2026_drink_cold';
const router = (0, express_1.Router)();
// Optional auth helper to check if user is logged in, but not block guest checkout
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const db = await (0, db_1.getDb)();
        const user = await db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', [decoded.id]);
        if (user) {
            req.user = user;
        }
    }
    catch (err) {
        // Suppress token errors to allow guest checkout
    }
    next();
};
// Customer and Guest order placement
router.post('/', optionalAuth, orderController_1.createOrder);
// Scoped orders list (Admin sees all, Customer sees their own)
router.get('/', auth_1.authMiddleware, orderController_1.getOrders);
// Admin-only updates and customer phone order lookups
router.get('/customer/:phone', orderController_1.getOrdersByCustomer);
router.get('/:id', orderController_1.getOrderById);
router.put('/:id/status', auth_1.authMiddleware, auth_1.adminMiddleware, orderController_1.updateOrderStatus);
exports.default = router;
