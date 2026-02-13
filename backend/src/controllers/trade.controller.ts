import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all trades for a project
export const getTradesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const trades = await prisma.trade.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        categories: { orderBy: { order: 'asc' } }
      }
    });
    res.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

// Create new trade
export const createTrade = async (req: Request, res: Response) => {
  try {
    const { projectId, name, code, hgNumber, order } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nextOrder = order !== undefined ? order : await getNextTradeOrder(projectId);

    const trade = await prisma.trade.create({
      data: { projectId, name, code, hgNumber, order: nextOrder }
    });

    res.status(201).json(trade);
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
};

// Update trade
export const updateTrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, hgNumber, order } = req.body;

    const trade = await prisma.trade.update({
      where: { id },
      data: { name, code, hgNumber, order }
    });

    res.json(trade);
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(500).json({ error: 'Failed to update trade' });
  }
};

// Delete trade
export const deleteTrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.trade.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).json({ error: 'Failed to delete trade' });
  }
};

async function getNextTradeOrder(projectId: string): Promise<number> {
  const last = await prisma.trade.findFirst({
    where: { projectId },
    orderBy: { order: 'desc' }
  });
  return (last?.order ?? -1) + 1;
}
