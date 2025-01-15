import React, { PropsWithChildren } from 'react';
import {useDraggable} from '@dnd-kit/core';

type DraggableProps = {
  className?: string;
  data?: any;
  id: number | string;
}

export function Draggable(props: PropsWithChildren<DraggableProps>) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    data: {
      test: 'testvalue',
      type: 'Task'
    }
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}