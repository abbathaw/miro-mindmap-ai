// useMiroIntegration.ts
import { useEffect, useState } from 'react';
import { SelectionUpdateEvent } from '@mirohq/websdk-types';

const EVENT_NAME = 'selection:update';
const useMiroListener = () => {
  const [selectedTarget, setSelectedTarget] = useState<any>(null);

  useEffect(() => {
    const setupMiroListeners = async () => {
      // Add event listener for widget selection
      miro.board.ui.on(EVENT_NAME, handleSelectionUpdated);
    };

    const handleSelectionUpdated = async (event: SelectionUpdateEvent) => {
      const selectedWidgets = event.items;
      // TODO filter selected item to validate that this is something we can expand on
      setSelectedTarget(selectedWidgets[0]);
    };

    setupMiroListeners();

    return () => {
      // Cleanup event listeners
      miro.board.ui.off(EVENT_NAME, handleSelectionUpdated);
    };
  }, []);

  return { selectedTarget };
};

export default useMiroListener;
