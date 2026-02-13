// Entity Types based on Prisma Schema

export interface Project {
  id: number;
  name: string;
  description?: string;
  client?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  projectId: number;
  zoneId: number;
  roomNumber: string;
  name: string;
  area?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  tradeId?: number;
  categoryId?: number;
  connectionId?: number;
  installZoneId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomDevice {
  id: number;
  roomId: number;
  deviceId: number;
  quantity: number;
  position?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  projectId: number;
  tradeId?: number;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  voltage?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstallZone {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupAddress {
  id: number;
  projectId: number;
  roomDeviceId?: number;
  hauptgruppe: number;
  mittelgruppe: number;
  untergruppe: number;
  name: string;
  dataType?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionBoard {
  id: number;
  projectId: number;
  name: string;
  location?: string;
  type?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

// Form Types (for creating/updating entities)
export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProject = Partial<CreateProject>;

export type CreateZone = Omit<Zone, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateZone = Partial<CreateZone>;

export type CreateRoom = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRoom = Partial<CreateRoom>;

export type CreateDevice = Omit<Device, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDevice = Partial<CreateDevice>;

export type CreateTrade = Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTrade = Partial<CreateTrade>;

export type CreateCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategory = Partial<CreateCategory>;

export type CreateConnection = Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateConnection = Partial<CreateConnection>;

export type CreateInstallZone = Omit<InstallZone, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInstallZone = Partial<CreateInstallZone>;
