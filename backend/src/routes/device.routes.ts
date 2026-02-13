import { Router } from 'express';
import {
  getDevicesByProject,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} from '../controllers/device.controller';

const router = Router();

router.get('/project/:projectId', getDevicesByProject);
router.get('/:id', getDeviceById);
router.post('/', createDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
