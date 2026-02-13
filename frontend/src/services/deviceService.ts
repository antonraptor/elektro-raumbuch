import api from './api';
import type * as Types from '../types';

export const deviceService = {
  // Get devices by project ID
  async getByProject(projectId: number): Promise<Types.Device[]> {
    const response = await api.get<Types.Device[]>(`/devices/project/${projectId}`);
    return response.data;
  },

  // Get device by ID
  async getById(id: number): Promise<Types.Device> {
    const response = await api.get<Types.Device>(`/devices/${id}`);
    return response.data;
  },

  // Create new device
  async create(data: Types.CreateDevice): Promise<Types.Device> {
    const response = await api.post<Types.Device>('/devices', data);
    return response.data;
  },

  // Update device
  async update(id: number, data: Types.UpdateDevice): Promise<Types.Device> {
    const response = await api.put<Types.Device>(`/devices/${id}`, data);
    return response.data;
  },

  // Delete device
  async delete(id: number): Promise<void> {
    await api.delete(`/devices/${id}`);
  },
};
