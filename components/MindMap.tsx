// MindMap.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import useMiroListener from '../hooks/useMiroListener';
import { FrameData, ISubmitProps } from '../types';
import { createMindMap } from '../utils/drawCalculations';

const MindMap: React.FC = () => {
  const [locationsMap, setLocationsMap] = useState<FrameData[]>([]);
  const { selectedTarget } = useMiroListener();
  console.log('selectedTarget', selectedTarget);
  const handleSubmit = async ({ text }: ISubmitProps) => {
    const updatedLocationsMap = await createMindMap(text, locationsMap);
    setLocationsMap(updatedLocationsMap);
  };

  return (
    <div>
      <Sidebar onSubmit={handleSubmit} />
    </div>
  );
};

export default MindMap;
