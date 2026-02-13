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
export interface CreateProject {
  name: string;
  description?: string;
  client?: string;
  location?: string;
}

export interface UpdateProject {
  name?: string;
  description?: string;
  client?: string;
  location?: string;
}

export interface CreateZone {
  projectId: number;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface UpdateZone {
  projectId?: number;
  name?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateRoom {
  projectId: number;
  zoneId: number;
  roomNumber: string;
  name: string;
  area?: number;
  notes?: string;
}

export interface UpdateRoom {
  projectId?: number;
  zoneId?: number;
  roomNumber?: string;
  name?: string;
  area?: number;
  notes?: string;
}

export interface CreateDevice {
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
}

export interface UpdateDevice {
  projectId?: number;
  name?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  tradeId?: number;
  categoryId?: number;
  connectionId?: number;
  installZoneId?: number;
  isActive?: boolean;
}

export interface CreateTrade {
  projectId: number;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
}

export interface UpdateTrade {
  projectId?: number;
  name?: string;
  description?: string;
  color?: string;
  sortOrder?: number;
}

export interface CreateCategory {
  projectId: number;
  tradeId?: number;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface UpdateCategory {
  projectId?: number;
  tradeId?: number;
  name?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateConnection {
  projectId: number;
  name: string;
  description?: string;
  voltage?: string;
  sortOrder: number;
}

export interface UpdateConnection {
  projectId?: number;
  name?: string;
  description?: string;
  voltage?: string;
  sortOrder?: number;
}

export interface CreateInstallZone {
  projectId: number;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface UpdateInstallZone {
  projectId?: number;
  name?: string;
  description?: string;
  sortOrder?: number;
}
