// Entity Types based on Prisma Schema

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: string;
  projectId: string;
  code: string;
  name: string;
  order: number;
}

export interface Room {
  id: string;
  zoneId: string;
  code: string;
  number: number;
  name: string;
  order: number;
}

export interface Device {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  code?: string;
  tradeId?: string;
  categoryId?: string;
}

export interface RoomDevice {
  id: string;
  roomId: string;
  deviceId?: string;
  designation: string;
  code?: string;
  totalCode?: string;
  tradeId?: string;
  categoryId?: string;
  connectionId?: string;
  installZoneId?: string;
  cableType?: string;
  target?: string;
  quantity: number;
  order: number;
}

export interface Trade {
  id: string;
  projectId: string;
  name: string;
  code?: string;
  hgNumber?: number;
  order: number;
}

export interface Category {
  id: string;
  tradeId: string;
  name: string;
  code?: string;
  order: number;
}

export interface Connection {
  id: string;
  projectId: string;
  name: string;
  code?: string;
  voltage?: string;
}

export interface InstallZone {
  id: string;
  projectId: string;
  name: string;
  code?: string;
  order: number;
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
}

export interface UpdateProject {
  name?: string;
  description?: string;
}

export interface CreateZone {
  projectId: string;
  code: string;
  name: string;
  order: number;
}

export interface UpdateZone {
  code?: string;
  name?: string;
  order?: number;
}

export interface CreateRoom {
  zoneId: string;
  code: string;
  number: number;
  name: string;
  order: number;
}

export interface UpdateRoom {
  code?: string;
  number?: number;
  name?: string;
  order?: number;
}

export interface CreateDevice {
  projectId: string;
  name: string;
  description?: string;
  code?: string;
  tradeId?: string;
  categoryId?: string;
}

export interface UpdateDevice {
  name?: string;
  description?: string;
  code?: string;
  tradeId?: string;
  categoryId?: string;
}

export interface CreateTrade {
  projectId: string;
  name: string;
  code?: string;
  hgNumber?: number;
  order: number;
}

export interface UpdateTrade {
  name?: string;
  code?: string;
  hgNumber?: number;
  order?: number;
}

export interface CreateCategory {
  tradeId: string;
  name: string;
  code?: string;
  order: number;
}

export interface UpdateCategory {
  name?: string;
  code?: string;
  order?: number;
}

export interface CreateConnection {
  projectId: string;
  name: string;
  code?: string;
  voltage?: string;
}

export interface UpdateConnection {
  name?: string;
  code?: string;
  voltage?: string;
}

export interface CreateInstallZone {
  projectId: string;
  name: string;
  code?: string;
  order: number;
}

export interface UpdateInstallZone {
  name?: string;
  code?: string;
  order?: number;
}
