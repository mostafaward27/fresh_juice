"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Initialize Database
(0, db_1.initDb)().catch((err) => {
    console.error('Failed to initialize SQLite Database:', err);
    process.exit(1);
});
// Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Required to allow loading local uploaded images in the browser
}));
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for dev/staging simplicity, can configure in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve local static uploaded product images
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Rate Limiter to guard endpoints
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: { error: 'طلبات كثيرة جداً، الرجاء المحاولة لاحقاً بعد 15 دقيقة.' }
});
app.use('/api', limiter);
// Mount REST API endpoints
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
// Base route healthcheck
app.get('/', (req, res) => {
    res.json({ message: 'مرحباً بك في خادم مشروبات مشبرة (Shabar API) 🍹' });
});
// Centralized error handler middleware
app.use((err, req, res, next) => {
    console.error('Express Error Handler:', err);
    res.status(err.status || 500).json({
        error: err.message || 'حدث خطأ غير متوقع في الخادم'
    });
});
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
