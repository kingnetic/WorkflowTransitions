import React from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-transparent rounded-lg p-6 flex flex-col items-center">
        <div className="loader"></div>
        <p className="mt-4 text-lg font-semibold text-white">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;