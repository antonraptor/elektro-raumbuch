import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getConnectionsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const connections = await prisma.connection.findMany({
      where: { projectId }
    });
    res.json(connections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
};

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { projectId, name, code, voltage } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await prisma.connection.create({
      data: { projectId, name, code, voltage }
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ error: 'Failed to create connection' });
  }
};

export const updateConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, voltage } = req.body;

    const connection = await prisma.connection.update({
      where: { id },
      data: { name, code, voltage }
    });

    res.json(connection);
  } catch (error) {
    console.error('Error updating connection:', error);
    res.status(500).json({ error: 'Failed to update connection' });
  }
};

export const deleteConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.connection.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting connection:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
};
