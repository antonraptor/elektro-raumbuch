import api from './api';
import { Device, CreateDevice, UpdateDevice } from '../types';

export const deviceService = {
  // Get devices by project ID
  async getByProject(projectId: number): Promise<Device[]> {
    const response = await api.get<Device[]>(`/devices/project/${projectId}`);
    return response.data;
  },

  // Get device by ID
  async getById(id: number): Promise<Device> {
    const response = await api.get<Device>(`/devices/${id}`);
    return response.data;
  },

  // Create new device
  async create(data: CreateDevice): Promise<Device> {
    const response = await api.post<Device>('/devices', data);
    return response.data;
  },

  // Update device
  async update(id: number, data: UpdateDevice): Promise<Device> {
    const response = await api.put<Device>(`/devices/${id}`, data);
    return response.data;
  },

  // Delete device
  async delete(id: number): Promise<void> {
    await api.delete(`/devices/${id}`);
  },
};
