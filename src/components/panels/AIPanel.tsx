import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AIGenerationService } from '../../services/AIGenerationService';

export function AIPanel() {
  const { setBuilding, pushHistory } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      pushHistory();
      const building = AIGenerationService.generateFromDescription(prompt);
      setBuilding(building);
      setGenerating(false);
    }, 1500);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setShowExamples(false);
  };

  const examples = AIGenerationService.getExamplePrompts();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        <span className="mr-2">🤖</span>AI Building Generator
      </h3>

      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-3">
        <p className="text-xs text-gray-300">
          Describe your building in natural language and AI will generate a 3D model for you.
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Building Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Generate a 3-floor modern house with 4 rooms per floor, large glass windows and a flat roof."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm h-24 resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Generating...
          </span>
        ) : (
          '✨ Generate Building'
        )}
      </button>

      {/* Examples */}
      <div>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>{showExamples ? '▼' : '▶'}</span>
          Example Prompts
        </button>

        {showExamples && (
          <div className="mt-2 space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded text-xs text-gray-300 hover:text-white transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
