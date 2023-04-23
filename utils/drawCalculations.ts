import { Frame, StickyNote } from '@mirohq/websdk-types';
import { FrameData, LocationPoints } from '../types';
import { createConnector, createFrame, createStickyNote } from './drawFunctions';

// Helper functions
function findNextAvailableLocation(locationsMap: FrameData[]): LocationPoints {
  if (locationsMap.length === 0) {
    return { x: -2000, y: -1000 };
  }

  const lastFrame = locationsMap[locationsMap.length - 1];
  return {
    x: lastFrame.location.x,
    y: lastFrame.location.y + lastFrame.height + 200,
  };
}

export async function expandMindMap(text: string, locationsMap: FrameData[]) {
  console.log('expand text', text);
  return locationsMap;
}

export async function createMindMap(text: string, locationsMap: FrameData[]) {
  const frameLocation = findNextAvailableLocation(locationsMap);
  const frameWidth = 3000;
  const frameHeight = 1500;

  const frame = await createFrame(text, frameLocation, frameWidth, frameHeight);

  const rootNodeLocation: LocationPoints = {
    x: frameLocation.x,
    y: frameLocation.y,
  };
  const rootNode = await createStickyNote(rootNodeLocation, 200, text, true);
  await updateViewport(frame);
  await frame.add(rootNode);

  const childNodeSize = 200;
  const childNodesDistance = 300;
  const verticalSpacing = 100;

  for (let i = 0; i < 8; i++) {
    const isLeft = i < 4; // First 4 nodes are on the left, the other 4 on the right
    const columnIndex = isLeft ? i : i - 4; // Reset index for the right column
    const xOffset = (isLeft ? -1 : 1) * childNodesDistance;
    const yOffset = columnIndex * (childNodeSize + verticalSpacing) - (childNodeSize + verticalSpacing) * 1.5;

    const childNodeLocation: LocationPoints = {
      x: rootNodeLocation.x + xOffset,
      y: rootNodeLocation.y + yOffset,
    };
    const childNode = await createStickyNote(childNodeLocation, childNodeSize, (i + 1).toString(), false);
    await frame.add(childNode);

    const connector = await createConnector(rootNode, childNode, isLeft);
    await frame.add(connector);
  }

  // Add the frame data to the locationsMap
  return [
    ...locationsMap,
    {
      location: frameLocation,
      width: frameWidth,
      height: frameHeight,
    },
  ];
}

const updateViewport = async (item: Frame | StickyNote) => {
  await miro.board.viewport.zoomTo(item);
  await miro.board.viewport.setZoom(0.3);
};
