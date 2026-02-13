import api from './api';
import type * as Types from '../types';

export interface CreateRoomDevice {
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
  quantity?: number;
  order?: number;
}

export interface UpdateRoomDevice {
  deviceId?: string;
  designation?: string;
  code?: string;
  totalCode?: string;
  tradeId?: string;
  categoryId?: string;
  connectionId?: string;
  installZoneId?: string;
  cableType?: string;
  target?: string;
  quantity?: number;
  order?: number;
}

export const roomDeviceService = {
  async getByRoom(roomId: string): Promise<Types.RoomDevice[]> {
    const response = await api.get<Types.RoomDevice[]>(`/room-devices/room/${roomId}`);
    return response.data;
  },

  async getById(id: string): Promise<Types.RoomDevice> {
    const response = await api.get<Types.RoomDevice>(`/room-devices/${id}`);
    return response.data;
  },

  async create(data: CreateRoomDevice): Promise<Types.RoomDevice> {
    const response = await api.post<Types.RoomDevice>('/room-devices', data);
    return response.data;
  },

  async update(id: string, data: UpdateRoomDevice): Promise<Types.RoomDevice> {
    const response = await api.put<Types.RoomDevice>(`/room-devices/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/room-devices/${id}`);
  },
};
