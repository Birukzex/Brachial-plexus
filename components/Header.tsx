
import React from 'react';

interface HeaderProps {
  onNewCase: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewCase }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-brain mr-3 text-blue-600"></i>PlexoLearn
          </h1>
          <p className="text-gray-800 mt-1">Brachial Plexus Injury Localization Tool (Powered by Gemini)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onNewCase} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">
            <i className="fas fa-file-alt mr-2"></i>New Case
          </button>
        </div>
      </div>
    </header>
  );
};
