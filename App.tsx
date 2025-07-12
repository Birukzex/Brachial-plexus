import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { Footer } from './components/Footer';
import {
  EvaluationMode,
  NerveInputState,
  ExamInputState,
  AnalysisResult,
  CaseData,
  LesionType,
  AppState
} from './types';
import {
  MOTOR_NERVES,
  SENSORY_NERVES,
  MOTOR_SIGNS,
  REFLEX_CHANGES,
  SPECIFIC_SIGNS,
  SENSORY_DISTRIBUTION_SIGNS
} from './constants';
import { analyzeBrachialPlexusCase } from './services/geminiService';

const createInitialNerveState = (nerves: string[]): NerveInputState => {
  return nerves.reduce((acc, nerve) => {
    acc[nerve] = { selected: false, type: 'axonal' };
    return acc;
  }, {} as NerveInputState);
};

const createInitialExamState = (signs: string[]): ExamInputState => {
  return signs.reduce((acc, sign) => {
    acc[sign] = false;
    return acc;
  }, {} as ExamInputState);
};

const getInitialState = (): AppState => ({
  evaluationMode: 'ncs' as EvaluationMode,
  motorNerves: createInitialNerveState(MOTOR_NERVES),
  sensoryNerves: createInitialNerveState(SENSORY_NERVES),
  motorSigns: createInitialExamState(MOTOR_SIGNS),
  reflexChanges: createInitialExamState(REFLEX_CHANGES),
  specificSigns: createInitialExamState(SPECIFIC_SIGNS),
  examSensory: createInitialExamState(SENSORY_DISTRIBUTION_SIGNS),
  analysisResult: null as AnalysisResult | null,
  isLoading: false,
  error: null as string | null,
});

function App() {
  const [state, setState] = useState(getInitialState);

  const handleNewCase = useCallback(() => {
    setState(getInitialState());
  }, []);
  
  const handleModeChange = useCallback((mode: EvaluationMode) => {
    setState(s => ({ ...s, evaluationMode: mode }));
  }, []);

  const handleNerveChange = useCallback((category: 'motorNerves' | 'sensoryNerves', nerve: string, value: boolean | LesionType) => {
    setState(s => ({
      ...s,
      [category]: {
        ...s[category],
        [nerve]: {
          ...s[category][nerve],
          ...(typeof value === 'boolean' ? { selected: value } : { type: value }),
        },
      },
    }));
  }, []);

  const handleSelectAllNerves = useCallback((category: 'motorNerves' | 'sensoryNerves', selected: boolean) => {
    setState(s => {
      const newCategoryState = { ...s[category] };
      Object.keys(newCategoryState).forEach(nerve => {
        newCategoryState[nerve].selected = selected;
      });
      return { ...s, [category]: newCategoryState };
    });
  }, []);

  const handleSignChange = useCallback((category: keyof AppState, sign: string, value: boolean) => {
    setState(s => {
      const categoryState = s[category];
      if (typeof categoryState !== 'object' || categoryState === null || Array.isArray(categoryState)) return s;

      return {
        ...s,
        [category]: {
          ...(categoryState as object),
          [sign]: value,
        },
      };
    });
  }, []);


  const handleAnalyze = useCallback(async () => {
    setState(s => ({ ...s, isLoading: true, error: null, analysisResult: null }));

    const getSelected = (obj: { [key: string]: boolean } | { [key: string]: { selected: boolean } }): string[] => {
      return Object.entries(obj)
        .filter(([, value]) => typeof value === 'boolean' ? value : value.selected)
        .map(([key]) => key);
    };

    const caseData: CaseData = {
      mode: state.evaluationMode,
      ncsMotor: Object.entries(state.motorNerves)
        .filter(([, val]) => val.selected)
        .map(([key, val]) => ({ nerve: key, type: val.type })),
      ncsSensory: Object.entries(state.sensoryNerves)
        .filter(([, val]) => val.selected)
        .map(([key, val]) => ({ nerve: key, type: val.type })),
      examMotor: getSelected(state.motorSigns),
      examReflex: getSelected(state.reflexChanges),
      examSpecific: getSelected(state.specificSigns),
      examSensory: getSelected(state.examSensory),
    };

    try {
      const result = await analyzeBrachialPlexusCase(caseData);
      setState(s => ({ ...s, analysisResult: result, isLoading: false }));
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setState(s => ({ ...s, error: `Failed to analyze case. ${errorMessage}`, isLoading: false }));
    }
  }, [state.evaluationMode, state.motorNerves, state.sensoryNerves, state.motorSigns, state.reflexChanges, state.specificSigns, state.examSensory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Header onNewCase={handleNewCase} />
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InputPanel
          evaluationMode={state.evaluationMode}
          onModeChange={handleModeChange}
          motorNerves={state.motorNerves}
          sensoryNerves={state.sensoryNerves}
          onNerveChange={handleNerveChange}
          onSelectAllNerves={handleSelectAllNerves}
          motorSigns={state.motorSigns}
          reflexChanges={state.reflexChanges}
          specificSigns={state.specificSigns}
          examSensory={state.examSensory}
          onSignChange={handleSignChange}
          isLoading={state.isLoading}
          onAnalyze={handleAnalyze}
        />
        <ResultsPanel
          result={state.analysisResult}
          isLoading={state.isLoading}
          error={state.error}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
