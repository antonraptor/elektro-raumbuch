import api from './api';
import type * as Types from '../types';

export const roomService = {
  // Get rooms by zone ID
  async getByZone(zoneId: number): Promise<Types.Room[]> {
    const response = await api.get<Types.Room[]>(`/rooms/zone/${zoneId}`);
    return response.data;
  },

  // Get all rooms by project ID
  async getByProject(projectId: number): Promise<Types.Room[]> {
    const response = await api.get<Types.Room[]>(`/rooms/project/${projectId}`);
    return response.data;
  },

  // Get room by ID
  async getById(id: number): Promise<Types.Room> {
    const response = await api.get<Types.Room>(`/rooms/${id}`);
    return response.data;
  },

  // Create new room
  async create(data: Types.CreateRoom): Promise<Types.Room> {
    const response = await api.post<Types.Room>('/rooms', data);
    return response.data;
  },

  // Update room
  async update(id: number, data: Types.UpdateRoom): Promise<Types.Room> {
    const response = await api.put<Types.Room>(`/rooms/${id}`, data);
    return response.data;
  },

  // Delete room
  async delete(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};
