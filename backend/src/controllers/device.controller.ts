import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all devices for a project
export const getDevicesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const devices = await prisma.device.findMany({
      where: { projectId },
      include: {
        trade: true,
        category: true
      }
    });
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

// Get device by ID
export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        trade: true,
        category: true
      }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
};

// Create new device
export const createDevice = async (req: Request, res: Response) => {
  try {
    const { projectId, name, description, code, tradeId, categoryId } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const device = await prisma.device.create({
      data: {
        projectId,
        name,
        description,
        code,
        tradeId,
        categoryId
      }
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Failed to create device' });
  }
};

// Update device
export const updateDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, code, tradeId, categoryId } = req.body;

    const device = await prisma.device.update({
      where: { id },
      data: {
        name,
        description,
        code,
        tradeId,
        categoryId
      }
    });

    res.json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Failed to update device' });
  }
};

// Delete device
export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.device.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
};
