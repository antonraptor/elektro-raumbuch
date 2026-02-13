import api from './api';
import { Trade, CreateTrade, UpdateTrade, Category, CreateCategory, UpdateCategory, Connection, CreateConnection, UpdateConnection, InstallZone, CreateInstallZone, UpdateInstallZone } from '../types';

// Trade Service
export const tradeService = {
  async getByProject(projectId: number): Promise<Trade[]> {
    const response = await api.get<Trade[]>(`/trades/project/${projectId}`);
    return response.data;
  },

  async create(data: CreateTrade): Promise<Trade> {
    const response = await api.post<Trade>('/trades', data);
    return response.data;
  },

  async update(id: number, data: UpdateTrade): Promise<Trade> {
    const response = await api.put<Trade>(`/trades/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/trades/${id}`);
  },
};

// Category Service
export const categoryService = {
  async getByProject(projectId: number): Promise<Category[]> {
    const response = await api.get<Category[]>(`/categories/project/${projectId}`);
    return response.data;
  },

  async create(data: CreateCategory): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: number, data: UpdateCategory): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

// Connection Service
export const connectionService = {
  async getByProject(projectId: number): Promise<Connection[]> {
    const response = await api.get<Connection[]>(`/connections/project/${projectId}`);
    return response.data;
  },

  async create(data: CreateConnection): Promise<Connection> {
    const response = await api.post<Connection>('/connections', data);
    return response.data;
  },

  async update(id: number, data: UpdateConnection): Promise<Connection> {
    const response = await api.put<Connection>(`/connections/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/connections/${id}`);
  },
};

// InstallZone Service
export const installZoneService = {
  async getByProject(projectId: number): Promise<InstallZone[]> {
    const response = await api.get<InstallZone[]>(`/install-zones/project/${projectId}`);
    return response.data;
  },

  async create(data: CreateInstallZone): Promise<InstallZone> {
    const response = await api.post<InstallZone>('/install-zones', data);
    return response.data;
  },

  async update(id: number, data: UpdateInstallZone): Promise<InstallZone> {
    const response = await api.put<InstallZone>(`/install-zones/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/install-zones/${id}`);
  },
};
