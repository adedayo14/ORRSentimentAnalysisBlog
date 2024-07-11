// app/components/ControlPanel.js

import React from 'react';

const ControlPanel = ({ classifyInputs, clearData, exportData }) => {
  return (
    <div className="control-panel">
      <h2>CONTROL PANEL</h2>
      <button onClick={classifyInputs} className="bg-black text-white flex items-center justify-center space-x-2 px-4 py-2 rounded">
        <span>RUN</span>
      </button>
      <button onClick={() => exportData('json')} className="bg-black text-white flex items-center justify-center space-x-2 px-4 py-2 rounded mt-2">
        <span>JSON</span>
      </button>
      <button onClick={() => exportData('csv')} className="bg-black text-white flex items-center justify-center space-x-2 px-4 py-2 rounded mt-2">
        <span>CSV</span>
      </button>
      <button onClick={clearData} className="bg-gray-200 text-black flex items-center justify-center space-x-2 px-4 py-2 rounded mt-2">
        CLEAR
      </button>
    </div>
  );
};

export default ControlPanel;
