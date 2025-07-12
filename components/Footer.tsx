
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 text-center text-gray-700 text-sm">
      <p>PlexoLearn | For educational and illustrative purposes only. Not for clinical use.</p>
      <p className="mt-1">© {currentYear} PlexoLearn Project</p>
    </footer>
  );
};
