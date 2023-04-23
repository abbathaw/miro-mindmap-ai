import { LocationPoints } from '../types';
import {
  ConnectorShape,
  SnapToValues,
  StickyNote,
  StickyNoteColor,
  StrokeCapShape,
  StrokeStyle,
} from '@mirohq/websdk-types';

export async function createFrame(text: string, location: LocationPoints, width: number, height: number) {
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

export async function createStickyNote(location: LocationPoints, size: number, content: string, isRoot = false) {
  // Create and return the sticky note object with the given location, size, and content
  const node = {
    ...location,
    content,
    width: size,
    style: {
      fillColor: isRoot ? StickyNoteColor.Green : StickyNoteColor.Yellow,
    },
  };
  return await miro.board.createStickyNote(node);
}

export async function createConnector(from: StickyNote, to: StickyNote, isLeft: boolean) {
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
