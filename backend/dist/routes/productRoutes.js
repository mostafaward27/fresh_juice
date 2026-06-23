"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Multer memory storage configuration for image upload
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file limit
    }
});
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
// Admin-only modifying endpoints
router.post('/', auth_1.authMiddleware, auth_1.adminMiddleware, productController_1.createProduct);
router.put('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, productController_1.updateProduct);
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, productController_1.deleteProduct);
// Image uploading route
router.post('/upload', auth_1.authMiddleware, auth_1.adminMiddleware, upload.single('image'), productController_1.uploadProductImage);
exports.default = router;
