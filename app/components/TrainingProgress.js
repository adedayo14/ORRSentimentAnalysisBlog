// app/components/TrainingProgress.js

import React from 'react';

const TrainingProgress = ({ isTraining, trainingProgress }) => {
  if (!isTraining) return null;

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative p-6 bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="text-lg font-semibold text-gray-800 text-center mb-2">
        Fine-tuning Model: {Math.min(100, Math.round(trainingProgress))}%
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transition-all duration-300"
            style={{ width: `${Math.min(100, trainingProgress)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TrainingProgress);
