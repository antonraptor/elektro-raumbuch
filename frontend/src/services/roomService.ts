import api from './api';
import { Room, CreateRoom, UpdateRoom } from '../types';

export const roomService = {
  // Get rooms by zone ID
  async getByZone(zoneId: number): Promise<Room[]> {
    const response = await api.get<Room[]>(`/rooms/zone/${zoneId}`);
    return response.data;
  },

  // Get all rooms by project ID
  async getByProject(projectId: number): Promise<Room[]> {
    const response = await api.get<Room[]>(`/rooms/project/${projectId}`);
    return response.data;
  },

  // Get room by ID
  async getById(id: number): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  // Create new room
  async create(data: CreateRoom): Promise<Room> {
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  // Update room
  async update(id: number, data: UpdateRoom): Promise<Room> {
    const response = await api.put<Room>(`/rooms/${id}`, data);
    return response.data;
  },

  // Delete room
  async delete(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};
