import { Router } from 'express';
import {
  getRoomDevicesByRoom,
  getRoomDeviceById,
  createRoomDevice,
  updateRoomDevice,
  deleteRoomDevice
} from '../controllers/roomDevice.controller';

const router = Router();

router.get('/room/:roomId', getRoomDevicesByRoom);
router.get('/:id', getRoomDeviceById);
router.post('/', createRoomDevice);
router.put('/:id', updateRoomDevice);
router.delete('/:id', deleteRoomDevice);

export default router;
