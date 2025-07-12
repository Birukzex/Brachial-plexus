
import React from 'react';
import { MOTOR_SIGNS, REFLEX_CHANGES, SPECIFIC_SIGNS, SENSORY_DISTRIBUTION_SIGNS } from '../constants';
import type { ExamInputState, AppState } from '../types';

interface CheckboxGroupProps {
  title: string;
  items: string[];
  state: ExamInputState;
  onChange: (item: string, checked: boolean) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, items, state, onChange }) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
    <div className="space-y-2">
      {items.map(item => (
        <label key={item} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state[item] ?? false}
            onChange={e => onChange(item, e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm">{item}</span>
        </label>
      ))}
    </div>
  </div>
);


interface ExamPanelProps {
  motorSigns: ExamInputState;
  reflexChanges: ExamInputState;
  specificSigns: ExamInputState;
  examSensory: ExamInputState;
  onSignChange: (category: keyof AppState, sign: string, value: boolean) => void;
}

export const ExamPanel: React.FC<ExamPanelProps> = ({ 
  motorSigns, 
  reflexChanges, 
  specificSigns, 
  examSensory, 
  onSignChange 
}) => {
  
  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <i className="fas fa-user-md mr-2 text-blue-500"></i>Physical Exam Findings
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CheckboxGroup 
          title="Motor Signs" 
          items={MOTOR_SIGNS}
          state={motorSigns}
          onChange={(item, checked) => onSignChange('motorSigns', item, checked)}
        />
        <CheckboxGroup 
          title="Reflex Changes" 
          items={REFLEX_CHANGES}
          state={reflexChanges}
          onChange={(item, checked) => onSignChange('reflexChanges', item, checked)}
        />
        <CheckboxGroup 
          title="Specific Signs" 
          items={SPECIFIC_SIGNS}
          state={specificSigns}
          onChange={(item, checked) => onSignChange('specificSigns', item, checked)}
        />
        <CheckboxGroup 
          title="Sensory Distribution" 
          items={SENSORY_DISTRIBUTION_SIGNS}
          state={examSensory}
          onChange={(item, checked) => onSignChange('examSensory', item, checked)}
        />
      </div>
    </div>
  );
};
