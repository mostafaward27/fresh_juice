import { Router } from 'express';
import multer from 'multer';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  uploadProductImage 
} from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Multer memory storage configuration for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file limit
  }
});

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only modifying endpoints
router.post('/', authMiddleware as any, adminMiddleware as any, createProduct);
router.put('/:id', authMiddleware as any, adminMiddleware as any, updateProduct);
router.delete('/:id', authMiddleware as any, adminMiddleware as any, deleteProduct);

// Image uploading route
router.post(
  '/upload', 
  authMiddleware as any, 
  adminMiddleware as any, 
  upload.single('image'), 
  uploadProductImage
);

export default router;
