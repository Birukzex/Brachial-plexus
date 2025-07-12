
import React from 'react';
import type { AnalysisResult, SiteConfidence } from '../types';

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-gray-800 h-full flex items-center justify-center">
    <div className="text-center">
      <div className="spinner h-10 w-10 border-4 border-blue-400 rounded-full mx-auto mb-4"></div>
      <p className="font-semibold">Analyzing with Gemini...</p>
      <p className="text-sm">Please wait while we process the case findings.</p>
    </div>
  </div>
);

const InitialState: React.FC = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-gray-800 h-full flex items-center justify-center">
    <div>
      <i className="fas fa-chart-bar text-blue-400 text-3xl mb-2"></i>
      <p>Results will appear here after analysis.</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700 h-full flex items-center justify-center">
    <div>
      <i className="fas fa-exclamation-triangle text-red-400 text-3xl mb-2"></i>
      <p className="font-semibold">Analysis Failed</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  </div>
);

const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => (
  <div className="flex flex-col h-full">
    <div className="fade-in">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Most Likely Injury Sites</h3>
        <div className="space-y-4 mb-6">
            {result.likelySites.map((site, index) => (
            <div key={index} className={`border rounded-lg p-3 ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-900">{site.site}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-full">{site.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${site.confidence}%` }}></div>
                </div>
                 <p className="text-xs text-gray-700 mt-2 pl-1">{site.explanation}</p>
            </div>
            ))}
        </div>
    </div>
    <div className="mt-auto pt-4 border-t space-y-4 fade-in">
        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Reasoning</h3>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800 max-h-32 overflow-y-auto custom-scrollbar border">
                <ul className="space-y-2 list-disc list-inside">
                    {result.reasoning.map((step, index) => <li key={index}>{step}</li>)}
                </ul>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recommended Follow-up</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-900">
                 <ul className="space-y-1 list-disc list-inside">
                    {result.followUp.map((rec, index) => <li key={index}>{rec}</li>)}
                </ul>
            </div>
        </div>
    </div>
  </div>
);


export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (result) return <ResultDisplay result={result} />;
    return <InitialState />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <i className="fas fa-chart-pie mr-3 text-blue-600"></i>Analysis Report
        </h2>
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
