import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get all categories for a project
export const getCategoriesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const categories = await prisma.category.findMany({
      where: { 
        trade: { projectId } 
      },
      orderBy: { order: 'asc' },
      include: {
        trade: true
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get all categories for a trade
export const getCategoriesByTrade = async (req: Request, res: Response) => {
  try {
    const { tradeId } = req.params;
    const categories = await prisma.category.findMany({
      where: { tradeId },
      orderBy: { order: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { tradeId, name, code, order } = req.body;

    if (!tradeId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nextOrder = order !== undefined ? order : await getNextCategoryOrder(tradeId);

    const category = await prisma.category.create({
      data: { tradeId, name, code, order: nextOrder }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, order } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, code, order }
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

async function getNextCategoryOrder(tradeId: string): Promise<number> {
  const last = await prisma.category.findFirst({
    where: { tradeId },
    orderBy: { order: 'desc' }
  });
  return (last?.order ?? -1) + 1;
}
