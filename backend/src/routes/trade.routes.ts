import { Router } from 'express';
import {
  getTradesByProject,
  createTrade,
  updateTrade,
  deleteTrade
} from '../controllers/trade.controller';

const router = Router();

router.get('/project/:projectId', getTradesByProject);
router.post('/', createTrade);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

export default router;
