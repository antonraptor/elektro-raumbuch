import api from './api';
import { Project, CreateProject, UpdateProject } from '../types';

export const projectService = {
  // Get all projects
  async getAll(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  // Get project by ID
  async getById(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  async create(data: CreateProject): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  // Update project
  async update(id: number, data: UpdateProject): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
