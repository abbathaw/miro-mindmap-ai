// MindMap.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
// import useMiroListener from '../hooks/useMiroListener';
import { ApiResponse, FrameData, ISubmitProps } from '../types';
import { createMindMap, expandMindMap } from '../utils/drawCalculations';
import { fetchAI } from '../utils/fetchCompletion';

const MindMap: React.FC = () => {
  const [locationsMap, setLocationsMap] = useState<FrameData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const { selectedTarget } = useMiroListener();
  // console.log('selectedTarget', selectedTarget);
  const handleSubmit = async ({ text }: ISubmitProps) => {
    setIsLoading(true);
    const results = (await fetchAI(text)) as ApiResponse;
    if (results) {
      const updatedLocationsMap = await createMindMap(text, results.msg, locationsMap);
      setLocationsMap(updatedLocationsMap);
    }
    setIsLoading(false);
  };

  const handleExpand = async ({ text }: ISubmitProps) => {
    const updatedLocationsMap = await expandMindMap(text, locationsMap);
    setLocationsMap(updatedLocationsMap);
  };

  return (
    <div>
      <Sidebar onSubmit={handleSubmit} onExpand={handleExpand} selectedTarget={null} isLoading={isLoading} />
    </div>
  );
};

export default MindMap;
