
import React from 'react';
import { MOTOR_NERVES, SENSORY_NERVES } from '../constants';
import type { NerveInputState, LesionType } from '../types';

interface NerveInputRowProps {
  label: string;
  checked: boolean;
  lesionType: LesionType;
  onCheckChange: (checked: boolean) => void;
  onTypeChange: (type: LesionType) => void;
}

const NerveInputRow: React.FC<NerveInputRowProps> = ({ label, checked, lesionType, onCheckChange, onTypeChange }) => (
  <div className="flex justify-between items-center py-1">
    <label className="flex items-center cursor-pointer max-w-[70%]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-2 text-sm">{label}</span>
    </label>
    <select
      value={lesionType}
      onChange={(e) => onTypeChange(e.target.value as LesionType)}
      disabled={!checked}
      className="text-xs border rounded px-2 py-1 bg-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
    >
      <option value="axonal">Axonal</option>
      <option value="demyelinating">Demyelinating</option>
      <option value="mixed">Mixed</option>
    </select>
  </div>
);

interface NcsPanelProps {
  motorNerves: NerveInputState;
  sensoryNerves: NerveInputState;
  onNerveChange: (category: 'motorNerves' | 'sensoryNerves', nerve: string, value: boolean | LesionType) => void;
  onSelectAll: (category: 'motorNerves' | 'sensoryNerves', selected: boolean) => void;
}

export const NcsPanel: React.FC<NcsPanelProps> = ({ motorNerves, sensoryNerves, onNerveChange, onSelectAll }) => {

  return (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <i className="fas fa-wave-square mr-2 text-blue-500"></i>Nerve Conduction Studies
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">Motor Nerves</h4>
             <button onClick={() => onSelectAll('motorNerves', true)} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md transition-colors">Select All</button>
          </div>
          <div className="space-y-1">
            {MOTOR_NERVES.map(nerve => (
              <NerveInputRow
                key={nerve}
                label={nerve}
                checked={motorNerves[nerve]?.selected ?? false}
                lesionType={motorNerves[nerve]?.type ?? 'axonal'}
                onCheckChange={(checked) => onNerveChange('motorNerves', nerve, checked)}
                onTypeChange={(type) => onNerveChange('motorNerves', nerve, type)}
              />
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-900">Sensory Nerves</h4>
            <button onClick={() => onSelectAll('sensoryNerves', true)} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md transition-colors">Select All</button>
          </div>
          <div className="space-y-1">
            {SENSORY_NERVES.map(nerve => (
              <NerveInputRow
                key={nerve}
                label={nerve}
                checked={sensoryNerves[nerve]?.selected ?? false}
                lesionType={sensoryNerves[nerve]?.type ?? 'axonal'}
                onCheckChange={(checked) => onNerveChange('sensoryNerves', nerve, checked)}
                onTypeChange={(type) => onNerveChange('sensoryNerves', nerve, type)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
