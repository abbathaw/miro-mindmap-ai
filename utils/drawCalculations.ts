import {
  ConnectorShape,
  Frame,
  SnapToValues,
  StickyNote,
  StickyNoteColor,
  StrokeCapShape,
  StrokeStyle,
} from '@mirohq/websdk-types';
import { FrameData, LocationPoints } from '../types';

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

async function createFrame(text: string, location: LocationPoints, width: number, height: number) {
  // Create and return the frame object with the given location, width, and height
  const frame = {
    title: text,
    width,
    height,
    style: {
      fillColor: '#ffffff',
    },
    ...location,
  };

  return await miro.board.createFrame(frame);
}

async function createStickyNote(location: LocationPoints, size: number, content: string) {
  // Create and return the sticky note object with the given location, size, and content
  const node = {
    ...location,
    content,
    width: size,
    style: {
      fillColor: StickyNoteColor.Yellow,
    },
  };
  return await miro.board.createStickyNote(node);
}

async function createConnector(from: StickyNote, to: StickyNote, isLeft: boolean) {
  // Create and return the connector object between the given from and to elements
  const connector = {
    shape: 'elbowed' as ConnectorShape,
    style: {
      endStrokeCap: 'rounded_stealth' as StrokeCapShape,
      strokeStyle: 'dashed' as StrokeStyle,
      strokeColor: 'rgba(0,0,0,0.76)',
      strokeWidth: 2,
    },
    start: {
      item: from.id,
      position: {
        x: isLeft ? 0.0 : 1.0,
        y: 0.5,
      },
    },
    end: {
      item: to.id,
      snapTo: isLeft ? 'right' : ('left' as SnapToValues),
    },
  };
  return await miro.board.createConnector(connector);
}

export async function createMindMap(text: string, locationsMap: FrameData[]) {
  const frameLocation = findNextAvailableLocation(locationsMap);
  const frameWidth = 4000;
  const frameHeight = 2000;

  const frame = await createFrame(text, frameLocation, frameWidth, frameHeight);

  const rootNodeLocation: LocationPoints = {
    x: frameLocation.x,
    y: frameLocation.y,
  };
  const rootNode = await createStickyNote(rootNodeLocation, 200, text);
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
    const childNode = await createStickyNote(childNodeLocation, childNodeSize, (i + 1).toString());
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
