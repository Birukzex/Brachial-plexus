
import React from 'react';
import type { EvaluationMode, NerveInputState, ExamInputState, LesionType, AppState } from '../types';
import { NcsPanel } from './NcsPanel';
import { ExamPanel } from './ExamPanel';

interface InputPanelProps {
  evaluationMode: EvaluationMode;
  onModeChange: (mode: EvaluationMode) => void;
  
  motorNerves: NerveInputState;
  sensoryNerves: NerveInputState;
  onNerveChange: (category: 'motorNerves' | 'sensoryNerves', nerve: string, value: boolean | LesionType) => void;
  onSelectAllNerves: (category: 'motorNerves' | 'sensoryNerves', selected: boolean) => void;
  
  motorSigns: ExamInputState;
  reflexChanges: ExamInputState;
  specificSigns: ExamInputState;
  examSensory: ExamInputState;
  onSignChange: (category: keyof AppState, sign: string, value: boolean) => void;
  
  isLoading: boolean;
  onAnalyze: () => void;
}

const ModeSelector: React.FC<{
  evaluationMode: EvaluationMode;
  onChange: (mode: EvaluationMode) => void;
}> = ({ evaluationMode, onChange }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium text-gray-900 mb-3">Evaluation Mode</h3>
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {(['ncs', 'exam', 'combined'] as EvaluationMode[]).map(mode => (
        <label key={mode} className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name="evaluationMode"
            value={mode}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            checked={evaluationMode === mode}
            onChange={() => onChange(mode)}
          />
          <span className="ml-2 capitalize">{mode === 'ncs' ? 'NCS Only' : mode === 'exam' ? 'Exam Only' : 'Combined'}</span>
        </label>
      ))}
    </div>
  </div>
);

export const InputPanel: React.FC<InputPanelProps> = (props) => {
  const { 
    evaluationMode, onModeChange, isLoading, onAnalyze,
    motorNerves, sensoryNerves, onNerveChange, onSelectAllNerves,
    motorSigns, reflexChanges, specificSigns, examSensory, onSignChange
  } = props;


  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-edit mr-3 text-blue-600"></i>Case Input
        </h2>
        
        <ModeSelector evaluationMode={evaluationMode} onChange={onModeChange} />

        <div className="space-y-6">
          {(evaluationMode === 'ncs' || evaluationMode === 'combined') && (
            <div className="fade-in">
              <NcsPanel 
                motorNerves={motorNerves}
                sensoryNerves={sensoryNerves}
                onNerveChange={onNerveChange}
                onSelectAll={onSelectAllNerves}
              />
            </div>
          )}
          {(evaluationMode === 'exam' || evaluationMode === 'combined') && (
            <div className="fade-in">
              <ExamPanel 
                motorSigns={motorSigns}
                reflexChanges={reflexChanges}
                specificSigns={specificSigns}
                examSensory={examSensory}
                onSignChange={onSignChange}
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            id="analyzeBtn"
            onClick={onAnalyze}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="spinner h-5 w-5 border-2 border-white rounded-full mr-3"></div>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fas fa-microscope mr-2"></i>Analyze Case
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
