import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Project } from '../types';

interface DashboardProps {
  onOpenEditor: () => void;
  onLoadProject: (id: string) => void;
}

export function Dashboard({ onOpenEditor, onLoadProject }: DashboardProps) {
  const { projects, loadProjects, deleteProject } = useAppStore();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewProject = () => {
    onOpenEditor();
  };

  const handleLoadProject = (project: Project) => {
    onLoadProject(project.id);
    onOpenEditor();
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setShowConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">3D</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Building3D Studio</h1>
              <p className="text-gray-400 text-sm">3D Building Model Generator & Editor</p>
            </div>
          </div>
          <button
            onClick={handleNewProject}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            + New Building
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Design Buildings in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">3D</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate, edit, visualize, and export 3D building models. Use AI to create buildings from natural language descriptions or configure every detail manually.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-white font-semibold mb-2">AI Generation</h3>
            <p className="text-gray-400 text-sm">Describe your building in plain English and watch it come to life in 3D.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-white font-semibold mb-2">Full Customization</h3>
            <p className="text-gray-400 text-sm">Configure floors, rooms, walls, windows, doors, roofs, materials and more.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-green-500/30 transition-colors">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-white font-semibold mb-2">Export Anywhere</h3>
            <p className="text-gray-400 text-sm">Export to GLTF, GLB, OBJ, JSON, or PNG. Use your models in any 3D application.</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Your Projects</h3>
            <span className="text-sm text-gray-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 border border-gray-700/30 rounded-xl">
              <div className="text-5xl mb-4">🏗️</div>
              <h4 className="text-white font-medium mb-2">No projects yet</h4>
              <p className="text-gray-400 text-sm mb-4">Create your first building to get started!</p>
              <button
                onClick={handleNewProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Create New Building
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all group cursor-pointer"
                  onClick={() => handleLoadProject(project)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.building.numberOfFloors} floors • {project.building.dimensions.width}×{project.building.dimensions.depth}m
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowConfirm(project.id); }}
                      className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>🏠 {project.building.rooms.length} rooms</span>
                    <span>🪟 {project.building.windows.length} windows</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
                    <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                    <span className="text-blue-400 group-hover:underline">Open →</span>
                  </div>

                  {/* Delete Confirmation */}
                  {showConfirm === project.id && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg" onClick={(e) => e.stopPropagation()}>
                      <p className="text-sm text-red-300 mb-2">Delete this project?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          Building3D Studio — Generate, Edit, Visualize & Export 3D Building Models
        </div>
      </footer>
    </div>
  );
}
