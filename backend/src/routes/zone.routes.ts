import { Router } from 'express';
import {
  getZonesByProject,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
} from '../controllers/zone.controller';

const router = Router();

router.get('/project/:projectId', getZonesByProject);
router.get('/:id', getZoneById);
router.post('/', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

export default router;
