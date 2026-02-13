import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all rooms for a zone
export const getRoomsByZone = async (req: Request, res: Response) => {
  try {
    const { zoneId } = req.params;
    const rooms = await prisma.room.findMany({
      where: { zoneId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { devices: true }
        }
      }
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Get all rooms for a project
export const getRoomsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const rooms = await prisma.room.findMany({
      where: {
        zone: { projectId }
      },
      orderBy: [
        { zone: { order: 'asc' } },
        { order: 'asc' }
      ],
      include: {
        zone: true,
        _count: {
          select: { devices: true }
        }
      }
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Get room by ID
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        zone: true,
        devices: {
          orderBy: { order: 'asc' },
          include: {
            device: true,
            trade: true,
            category: true,
            connection: true,
            installZone: true
          }
        }
      }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

// Create new room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { zoneId, code, number, name, order } = req.body;

    if (!zoneId || !code || !name || number === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get next order if not provided
    const nextOrder = order !== undefined ? order : await getNextRoomOrder(zoneId);

    const room = await prisma.room.create({
      data: {
        zoneId,
        code,
        number,
        name,
        order: nextOrder
      }
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Update room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, number, name, order } = req.body;

    const room = await prisma.room.update({
      where: { id },
      data: {
        code,
        number,
        name,
        order
      }
    });

    res.json(room);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

// Delete room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.room.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

// Helper: Get next order number
async function getNextRoomOrder(zoneId: string): Promise<number> {
  const lastRoom = await prisma.room.findFirst({
    where: { zoneId },
    orderBy: { order: 'desc' }
  });
  return (lastRoom?.order ?? -1) + 1;
}
