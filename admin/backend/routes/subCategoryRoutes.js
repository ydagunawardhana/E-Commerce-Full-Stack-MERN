import express from 'express';
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subCategoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createSubCategory) // Admin Only
  .get(getSubCategories); // Public

router.route('/:id')
  .get(getSubCategoryById)    
  .put(protect, admin, updateSubCategory)  // Admin Only
  .delete(protect, admin, deleteSubCategory); // Admin Only

export default router;