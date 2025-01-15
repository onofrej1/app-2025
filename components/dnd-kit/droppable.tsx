import React, { PropsWithChildren } from 'react';
import {useDroppable} from '@dnd-kit/core';

type DroppableProps = {
    className?: string;
    data?: any;
    id: string | number;
}

export function Droppable(props: PropsWithChildren<DroppableProps>) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
    data: {
      ...props.data,
      type: 'Column'
    }
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}