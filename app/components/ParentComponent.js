//app/components/ParentComponent.js


import React, { useState } from 'react';
import InputSection from './InputSection';

const ParentComponent = () => {
  const [inputs, setInputs] = useState([]);

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-2 h-full w-full overflow-auto">
      <h2 className="text-xl font-semibold">Parent Component</h2>
      <InputSection setInputs={setInputs} inputs={inputs} />
    </div>
  );
};

export default ParentComponent;
