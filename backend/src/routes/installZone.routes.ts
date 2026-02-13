import { Router } from 'express';
import {
  getInstallZonesByProject,
  createInstallZone,
  updateInstallZone,
  deleteInstallZone
} from '../controllers/installZone.controller';

const router = Router();

router.get('/project/:projectId', getInstallZonesByProject);
router.post('/', createInstallZone);
router.put('/:id', updateInstallZone);
router.delete('/:id', deleteInstallZone);

export default router;
