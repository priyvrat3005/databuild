import { create } from 'zustand';
import { BuildingSpec, EditorState, ViewSettings, Project } from '../types';
import { BuildingGeneratorService } from '../services/BuildingGeneratorService';
import { ProjectService } from '../services/ProjectService';

interface AppState {
  // Building
  building: BuildingSpec;
  setBuilding: (building: BuildingSpec) => void;
  updateBuilding: (updates: Partial<BuildingSpec>) => void;

  // Editor
  editor: EditorState;
  setEditorState: (state: Partial<EditorState>) => void;
  selectObject: (id: string | null, type: string | null) => void;

  // View
  viewSettings: ViewSettings;
  setViewSettings: (settings: Partial<ViewSettings>) => void;

  // Projects
  projects: Project[];
  currentProjectId: string | null;
  loadProjects: () => void;
  setCurrentProject: (id: string | null) => void;
  saveProject: (name: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;

  // History (Undo/Redo)
  history: BuildingSpec[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePanel: 'building' | 'materials' | 'export' | 'ai' | 'floors';
  setActivePanel: (panel: 'building' | 'materials' | 'export' | 'ai' | 'floors') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Building
  building: BuildingGeneratorService.generateDefault(),
  setBuilding: (building) => set({ building }),
  updateBuilding: (updates) => {
    const current = get().building;
    set({ building: { ...current, ...updates } });
  },

  // Editor
  editor: {
    selectedObjectId: null,
    selectedObjectType: null,
    mode: 'select',
    wireframe: false,
    showGrid: true,
    showAxes: true,
    snapToGrid: false,
    gridSize: 1,
    cameraMode: 'orbit',
  },
  setEditorState: (state) => set({ editor: { ...get().editor, ...state } }),
  selectObject: (id, type) => set({ editor: { ...get().editor, selectedObjectId: id, selectedObjectType: type } }),

  // View
  viewSettings: {
    showGrid: true,
    showAxes: true,
    wireframe: false,
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 1.0,
    backgroundColor: '#1a1a2e',
  },
  setViewSettings: (settings) => set({ viewSettings: { ...get().viewSettings, ...settings } }),

  // Projects
  projects: [],
  currentProjectId: null,
  loadProjects: () => {
    const projects = ProjectService.getAll();
    set({ projects });
  },
  setCurrentProject: (id) => set({ currentProjectId: id }),
  saveProject: (name) => {
    const { building, currentProjectId } = get();
    if (currentProjectId) {
      ProjectService.update(currentProjectId, building);
    } else {
      const project = ProjectService.create(name, building);
      set({ currentProjectId: project.id });
    }
    get().loadProjects();
  },
  loadProject: (id) => {
    const project = ProjectService.getById(id);
    if (project) {
      set({ building: project.building, currentProjectId: id });
    }
  },
  deleteProject: (id) => {
    ProjectService.delete(id);
    get().loadProjects();
    if (get().currentProjectId === id) {
      set({ currentProjectId: null });
    }
  },

  // History
  history: [],
  historyIndex: -1,
  pushHistory: () => {
    const { history, historyIndex, building } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(building)));
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ building: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex });
    }
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ building: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex });
    }
  },

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activePanel: 'building',
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
