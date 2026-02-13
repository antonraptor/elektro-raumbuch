import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './utils/prisma';

// Import routes
import projectRoutes from './routes/project.routes';
import zoneRoutes from './routes/zone.routes';
import roomRoutes from './routes/room.routes';
import deviceRoutes from './routes/device.routes';
import roomDeviceRoutes from './routes/roomDevice.routes';
import tradeRoutes from './routes/trade.routes';
import categoryRoutes from './routes/category.routes';
import connectionRoutes from './routes/connection.routes';
import installZoneRoutes from './routes/installZone.routes';
import importRoutes from './routes/import.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/room-devices', roomDeviceRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/install-zones', installZoneRoutes);
app.use('/api/import', importRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
