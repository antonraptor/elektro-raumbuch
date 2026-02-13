import { Router } from 'express';
import {
  getCategoriesByProject,
  getCategoriesByTrade,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';

const router = Router();

router.get('/project/:projectId', getCategoriesByProject);
router.get('/trade/:tradeId', getCategoriesByTrade);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
