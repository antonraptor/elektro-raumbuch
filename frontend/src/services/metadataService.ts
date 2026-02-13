import api from './api';
import type * as Types from '../types';

// Trade Service
export const tradeService = {
  async getByProject(projectId: string): Promise<Types.Trade[]> {
    const response = await api.get<Types.Trade[]>(`/trades/project/${projectId}`);
    return response.data;
  },

  async create(data: Types.CreateTrade): Promise<Types.Trade> {
    const response = await api.post<Types.Trade>('/trades', data);
    return response.data;
  },

  async update(id: string, data: Types.UpdateTrade): Promise<Types.Trade> {
    const response = await api.put<Types.Trade>(`/trades/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/trades/${id}`);
  },
};

// Category Service
export const categoryService = {
  async getByProject(projectId: string): Promise<Types.Category[]> {
    const response = await api.get<Types.Category[]>(`/categories/project/${projectId}`);
    return response.data;
  },

  async getByTrade(tradeId: string): Promise<Types.Category[]> {
    const response = await api.get<Types.Category[]>(`/categories/trade/${tradeId}`);
    return response.data;
  },

  async create(data: Types.CreateCategory): Promise<Types.Category> {
    const response = await api.post<Types.Category>('/categories', data);
    return response.data;
  },

  async update(id: string, data: Types.UpdateCategory): Promise<Types.Category> {
    const response = await api.put<Types.Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

// Connection Service
export const connectionService = {
  async getByProject(projectId: string): Promise<Types.Connection[]> {
    const response = await api.get<Types.Connection[]>(`/connections/project/${projectId}`);
    return response.data;
  },

  async create(data: Types.CreateConnection): Promise<Types.Connection> {
    const response = await api.post<Types.Connection>('/connections', data);
    return response.data;
  },

  async update(id: string, data: Types.UpdateConnection): Promise<Types.Connection> {
    const response = await api.put<Types.Connection>(`/connections/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/connections/${id}`);
  },
};

// InstallZone Service
export const installZoneService = {
  async getByProject(projectId: string): Promise<Types.InstallZone[]> {
    const response = await api.get<Types.InstallZone[]>(`/install-zones/project/${projectId}`);
    return response.data;
  },

  async create(data: Types.CreateInstallZone): Promise<Types.InstallZone> {
    const response = await api.post<Types.InstallZone>('/install-zones', data);
    return response.data;
  },

  async update(id: string, data: Types.UpdateInstallZone): Promise<Types.InstallZone> {
    const response = await api.put<Types.InstallZone>(`/install-zones/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/install-zones/${id}`);
  },
};
