import { Request, Response } from 'express';
import { ExcelImportService } from '../services/excelImport.service';

const importService = new ExcelImportService();

export const importExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { projectName, description } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const result = await importService.importExcel(
      req.file.buffer,
      projectName,
      description
    );

    res.json({
      message: 'Import successful',
      projectId: result.projectId,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ 
      error: 'Failed to import Excel file',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
