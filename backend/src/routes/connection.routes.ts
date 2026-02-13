import { Router } from 'express';
import {
  getConnectionsByProject,
  createConnection,
  updateConnection,
  deleteConnection
} from '../controllers/connection.controller';

const router = Router();

router.get('/project/:projectId', getConnectionsByProject);
router.post('/', createConnection);
router.put('/:id', updateConnection);
router.delete('/:id', deleteConnection);

export default router;
