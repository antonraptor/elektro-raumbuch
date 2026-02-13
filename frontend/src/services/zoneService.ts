import api from './api';
import { Zone, CreateZone, UpdateZone } from '../types';

export const zoneService = {
  // Get zones by project ID
  async getByProject(projectId: number): Promise<Zone[]> {
    const response = await api.get<Zone[]>(`/zones/project/${projectId}`);
    return response.data;
  },

  // Get zone by ID
  async getById(id: number): Promise<Zone> {
    const response = await api.get<Zone>(`/zones/${id}`);
    return response.data;
  },

  // Create new zone
  async create(data: CreateZone): Promise<Zone> {
    const response = await api.post<Zone>('/zones', data);
    return response.data;
  },

  // Update zone
  async update(id: number, data: UpdateZone): Promise<Zone> {
    const response = await api.put<Zone>(`/zones/${id}`, data);
    return response.data;
  },

  // Delete zone
  async delete(id: number): Promise<void> {
    await api.delete(`/zones/${id}`);
  },
};
