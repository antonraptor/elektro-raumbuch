import api from './api';
import type * as Types from '../types';

export const projectService = {
  // Get all projects
  async getAll(): Promise<Types.Project[]> {
    const response = await api.get<Types.Project[]>('/projects');
    return response.data;
  },

  // Get project by ID
  async getById(id: number): Promise<Types.Project> {
    const response = await api.get<Types.Project>(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  async create(data: Types.CreateProject): Promise<Types.Project> {
    const response = await api.post<Types.Project>('/projects', data);
    return response.data;
  },

  // Update project
  async update(id: number, data: Types.UpdateProject): Promise<Types.Project> {
    const response = await api.put<Types.Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
