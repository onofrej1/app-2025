import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: any;
}

export default function TaskCard(props: TaskCardProps) {
  const { task } = props;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    //disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-rose-500 cursor-grab h-5"
      ></div>
    );
  }

  return (
    <div {...attributes} {...listeners} style={style} ref={setNodeRef}>
      TaskCard [{task.id}]
    </div>
  );
}
