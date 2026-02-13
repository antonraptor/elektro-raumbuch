import { Router } from 'express';
import {
  getRoomsByZone,
  getRoomsByProject,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room.controller';

const router = Router();

router.get('/zone/:zoneId', getRoomsByZone);
router.get('/project/:projectId', getRoomsByProject);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
