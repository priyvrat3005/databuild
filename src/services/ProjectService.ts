import { v4 as uuidv4 } from 'uuid';
import { Project, BuildingSpec } from '../types';

const STORAGE_KEY = 'building3d_projects';

export class ProjectService {
  static getAll(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static getById(id: string): Project | null {
    const projects = this.getAll();
    return projects.find(p => p.id === id) || null;
  }

  static create(name: string, building: BuildingSpec): Project {
    const project: Project = {
      id: uuidv4(),
      name,
      building,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const projects = this.getAll();
    projects.push(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return project;
  }

  static update(id: string, building: BuildingSpec): Project | null {
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index].building = building;
    projects[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects[index];
  }

  static delete(id: string): boolean {
    const projects = this.getAll();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
}
