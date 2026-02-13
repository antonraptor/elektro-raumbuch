import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all room devices for a room
export const getRoomDevicesByRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const roomDevices = await prisma.roomDevice.findMany({
      where: { roomId },
      orderBy: { order: 'asc' },
      include: {
        device: true,
        trade: true,
        category: true,
        connection: true,
        installZone: true
      }
    });
    res.json(roomDevices);
  } catch (error) {
    console.error('Error fetching room devices:', error);
    res.status(500).json({ error: 'Failed to fetch room devices' });
  }
};

// Get room device by ID
export const getRoomDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roomDevice = await prisma.roomDevice.findUnique({
      where: { id },
      include: {
        device: true,
        trade: true,
        category: true,
        connection: true,
        installZone: true,
        room: {
          include: {
            zone: true
          }
        }
      }
    });

    if (!roomDevice) {
      return res.status(404).json({ error: 'Room device not found' });
    }

    res.json(roomDevice);
  } catch (error) {
    console.error('Error fetching room device:', error);
    res.status(500).json({ error: 'Failed to fetch room device' });
  }
};

// Create new room device
export const createRoomDevice = async (req: Request, res: Response) => {
  try {
    const {
      roomId,
      deviceId,
      designation,
      code,
      totalCode,
      tradeId,
      categoryId,
      connectionId,
      installZoneId,
      cableType,
      target,
      quantity,
      order
    } = req.body;

    if (!roomId || !designation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nextOrder = order !== undefined ? order : await getNextRoomDeviceOrder(roomId);

    const roomDevice = await prisma.roomDevice.create({
      data: {
        roomId,
        deviceId,
        designation,
        code,
        totalCode,
        tradeId,
        categoryId,
        connectionId,
        installZoneId,
        cableType,
        target,
        quantity: quantity || 1,
        order: nextOrder
      },
      include: {
        device: true,
        trade: true,
        category: true,
        connection: true,
        installZone: true
      }
    });

    res.status(201).json(roomDevice);
  } catch (error) {
    console.error('Error creating room device:', error);
    res.status(500).json({ error: 'Failed to create room device' });
  }
};

// Update room device
export const updateRoomDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      deviceId,
      designation,
      code,
      totalCode,
      tradeId,
      categoryId,
      connectionId,
      installZoneId,
      cableType,
      target,
      quantity,
      order
    } = req.body;

    const roomDevice = await prisma.roomDevice.update({
      where: { id },
      data: {
        deviceId,
        designation,
        code,
        totalCode,
        tradeId,
        categoryId,
        connectionId,
        installZoneId,
        cableType,
        target,
        quantity,
        order
      },
      include: {
        device: true,
        trade: true,
        category: true,
        connection: true,
        installZone: true
      }
    });

    res.json(roomDevice);
  } catch (error) {
    console.error('Error updating room device:', error);
    res.status(500).json({ error: 'Failed to update room device' });
  }
};

// Delete room device
export const deleteRoomDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.roomDevice.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting room device:', error);
    res.status(500).json({ error: 'Failed to delete room device' });
  }
};

async function getNextRoomDeviceOrder(roomId: string): Promise<number> {
  const last = await prisma.roomDevice.findFirst({
    where: { roomId },
    orderBy: { order: 'desc' }
  });
  return (last?.order ?? -1) + 1;
}
