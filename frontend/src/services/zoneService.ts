import api from './api';
import type * as Types from '../types';

export const zoneService = {
  // Get zones by project ID
  async getByProject(projectId: number): Promise<Types.Zone[]> {
    const response = await api.get<Types.Zone[]>(`/zones/project/${projectId}`);
    return response.data;
  },

  // Get zone by ID
  async getById(id: number): Promise<Types.Zone> {
    const response = await api.get<Types.Zone>(`/zones/${id}`);
    return response.data;
  },

  // Create new zone
  async create(data: Types.CreateZone): Promise<Types.Zone> {
    const response = await api.post<Types.Zone>('/zones', data);
    return response.data;
  },

  // Update zone
  async update(id: number, data: Types.UpdateZone): Promise<Types.Zone> {
    const response = await api.put<Types.Zone>(`/zones/${id}`, data);
    return response.data;
  },

  // Delete zone
  async delete(id: number): Promise<void> {
    await api.delete(`/zones/${id}`);
  },
};
