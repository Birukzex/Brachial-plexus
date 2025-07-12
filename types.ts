export type EvaluationMode = 'ncs' | 'exam' | 'combined';
export type LesionType = 'demyelinating' | 'axonal' | 'mixed';

export interface NerveInput {
  selected: boolean;
  type: LesionType;
}

export interface NerveInputState {
  [key: string]: NerveInput;
}

export interface ExamInputState {
  [key: string]: boolean;
}

export interface CaseData {
  mode: EvaluationMode;
  ncsMotor: { nerve: string; type: LesionType }[];
  ncsSensory: { nerve: string; type: LesionType }[];
  examMotor: string[];
  examReflex: string[];
  examSpecific: string[];
  examSensory: string[];
}

export interface SiteConfidence {
  site: string;
  confidence: number;
  explanation: string;
}

export interface AnalysisResult {
  likelySites: SiteConfidence[];
  reasoning: string[];
  followUp: string[];
}

export interface AppState {
  evaluationMode: EvaluationMode;
  motorNerves: NerveInputState;
  sensoryNerves: NerveInputState;
  motorSigns: ExamInputState;
  reflexChanges: ExamInputState;
  specificSigns: ExamInputState;
  examSensory: ExamInputState;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}
