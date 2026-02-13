import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all zones for a project
export const getZonesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const zones = await prisma.zone.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { rooms: true }
        }
      }
    });
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ error: 'Failed to fetch zones' });
  }
};

// Get zone by ID
export const getZoneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const zone = await prisma.zone.findUnique({
      where: { id },
      include: {
        rooms: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Failed to fetch zone' });
  }
};

// Create new zone
export const createZone = async (req: Request, res: Response) => {
  try {
    const { projectId, code, name, order } = req.body;

    if (!projectId || !code || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get next order if not provided
    const nextOrder = order !== undefined ? order : await getNextZoneOrder(projectId);

    const zone = await prisma.zone.create({
      data: {
        projectId,
        code,
        name,
        order: nextOrder
      }
    });

    res.status(201).json(zone);
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Failed to create zone' });
  }
};

// Update zone
export const updateZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, order } = req.body;

    const zone = await prisma.zone.update({
      where: { id },
      data: {
        code,
        name,
        order
      }
    });

    res.json(zone);
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Failed to update zone' });
  }
};

// Delete zone
export const deleteZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.zone.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Failed to delete zone' });
  }
};

// Helper: Get next order number
async function getNextZoneOrder(projectId: string): Promise<number> {
  const lastZone = await prisma.zone.findFirst({
    where: { projectId },
    orderBy: { order: 'desc' }
  });
  return (lastZone?.order ?? -1) + 1;
}
