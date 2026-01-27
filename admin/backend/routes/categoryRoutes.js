import express from 'express';
import multer from 'multer';
import path from 'path';

// Controllers Import
import { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';

// Security Middleware
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Config (Image Upload) ---
const storage = multer.diskStorage({
  destination(req, file, cb) { 
    cb(null, 'uploads/'); 
  },
  filename(req, file, cb) { 
   
    cb(null, `cat-${Date.now()}${path.extname(file.originalname)}`); 
  },
});

// File Type Validation (Optional but Recommended)
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Routes 

router.route('/')
  .post(protect, admin, upload.single('image'), createCategory) // Create
  .get(getCategories); // Get All

router.route('/:id')
  .get(getCategoryById) // Get Single
  .put(protect, admin, upload.single('image'), updateCategory) // Update
  .delete(protect, admin, deleteCategory); // Delete

export default router;