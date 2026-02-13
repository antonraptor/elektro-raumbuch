import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getInstallZonesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const installZones = await prisma.installZone.findMany({
      where: { projectId },
      orderBy: { order: 'asc' }
    });
    res.json(installZones);
  } catch (error) {
    console.error('Error fetching install zones:', error);
    res.status(500).json({ error: 'Failed to fetch install zones' });
  }
};

export const createInstallZone = async (req: Request, res: Response) => {
  try {
    const { projectId, name, code, order } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nextOrder = order !== undefined ? order : await getNextInstallZoneOrder(projectId);

    const installZone = await prisma.installZone.create({
      data: { projectId, name, code, order: nextOrder }
    });

    res.status(201).json(installZone);
  } catch (error) {
    console.error('Error creating install zone:', error);
    res.status(500).json({ error: 'Failed to create install zone' });
  }
};

export const updateInstallZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, order } = req.body;

    const installZone = await prisma.installZone.update({
      where: { id },
      data: { name, code, order }
    });

    res.json(installZone);
  } catch (error) {
    console.error('Error updating install zone:', error);
    res.status(500).json({ error: 'Failed to update install zone' });
  }
};

export const deleteInstallZone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.installZone.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting install zone:', error);
    res.status(500).json({ error: 'Failed to delete install zone' });
  }
};

async function getNextInstallZoneOrder(projectId: string): Promise<number> {
  const last = await prisma.installZone.findFirst({
    where: { projectId },
    orderBy: { order: 'desc' }
  });
  return (last?.order ?? -1) + 1;
}
