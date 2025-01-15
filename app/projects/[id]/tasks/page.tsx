"use client";
import React, { useEffect, useState } from "react";
import "./tasks.css";
import { createTask, getTasks, updateTask, updateTasks } from "@/actions/tasks";
import { Task } from "@prisma/client";
import { useDialog } from "@/state";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUsers } from "@/actions/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormField } from "@/resources/resources.types";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Draggable } from "@/components/dnd-kit/draggable";
import { Droppable } from "@/components/dnd-kit/droppable";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import TaskCard from "./components/taskCard";
import useAsync from "@/hooks/useAsync";
import { Return } from "@prisma/client/runtime/library";
import { createPortal } from "react-dom";

//import {Draggable} from './Draggable';
//import {Droppable} from './Droppable';

export default function Tasks() {
  const { open, setTitle, setContent, onClose } = useDialog();
  const params = useParams();
  const queryClient = useQueryClient();
  const groups = ["TODO", "IN_PROGRESS", "DONE"];
  const [activeItem, setActiveItem] = useState<HTMLDivElement | null>();
  const [activeItemClone, setActiveItemClone] =
    useState<HTMLDivElement | null>();
  const [activeGroup, setActiveGroup] = useState("");
  const [items, setItems] = useState<{ id: number, group: string, value: Task}[]>([]);

  const { data: itemsData = [], isFetching } = useQuery({
    queryKey: ["tasks", params.id],
    queryFn: () => getTasks(Number(params.id)),
    select: (data) => {
      const items = data.map((task) => ({
        id: task.id,
        className: "",
        group: task.status,
        value: task,
      }));
      return items;
    },
  });
  useEffect(() => {
    if (!isFetching) {
      setItems(itemsData);
    }    
  }, [isFetching]);

  const { data: users = [], isFetching: isFetchingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    select: (data) => {
      const items = data.map((user) => ({
        value: user.id,
        label: `${user.lastName} ${user.firstName}`,
      }));
      return items;
    },
  });
  if (isFetching || isFetchingUsers) return null;
  //if (loading) return null;

  const sendForm = async (data: Task) => {
    data.projectId = Number(params.id);
    data.id ? updateTask(data) : createTask(data);
    onClose();
    queryClient.invalidateQueries({ queryKey: ["tasks", params.id] });
  };

  const manageTaskForm = (data?: Task) => {
    let fields: FormField[] = [
      { name: "title", label: "Title" },
      { name: "description", label: "Description" },
      { name: "dueDate", type: "datepicker", label: "Due date" },
      {
        name: "assigneeId",
        type: "fk",
        relation: "assignee",
        label: "Assignee",
        resource: "user",
        textField: "lastName",
        options: users,
      },
    ];
    if (data?.id) {
      fields = fields.concat([
        { name: "id", type: "hidden" },
        {
          name: "status",
          type: "select",
          label: "Status",
          options: [
            { label: "Not started", value: "TODO" },
            { label: "In progress", value: "IN_PROGRESS" },
            { label: "Completed", value: "DONE" },
          ],
        },
      ]);
    }

    return (
      <Form
        fields={fields}
        validation={"CreateTask"}
        action={sendForm}
        data={data}
      >
        {({ fields }) => (
          <div>
            <div className="flex flex-col gap-3 pb-4">
              {fields.title}
              {fields.description}
              {fields.dueDate}
              {fields.assigneeId}
              {fields.status}
              <Button type="submit">Save</Button>
            </div>
          </div>
        )}
      </Form>
    );
  };

  const showAddNewTaskModal = () => {
    setTitle("Add new task");
    setContent(manageTaskForm());
    open();
  };

  const showEditTaskModal = (item: Task) => {
    setTitle("Edit task");
    setContent(manageTaskForm(item));
    open();
  };

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;
    console.log(isActiveATask);
    console.log(isOverATask);
    // dropping a task over another task
    if (isActiveATask && isOverATask) {
      //setTasks((tasks)=>{
      const activeIndex = items.findIndex((t) => t.id === activeId);
      const overIndex = items.findIndex((t) => t.id === overId);
      items[activeIndex].group = items[overIndex].group;
      const arr = arrayMove(items, activeIndex, overIndex);
      setItems(arr);
      console.log(
        "first",
        arr.map((i) => i.id)
      );
      //})
    }

    const isOverAColumn = over.data.current?.type === "Column";
    //dorpping a task over another coloumn
    if (isActiveATask && isOverAColumn) {
      //setTasks((tasks)=>{
      const activeIndex = items.findIndex((t) => t.id === activeId);
      items[activeIndex].group = overId as "TODO" | "IN_PROGRESS" | "DONE";
      console.log('active group', items[activeIndex].group);
      const arr = arrayMove(items, activeIndex, activeIndex);
      setItems(arr);
      console.log(
        "second",
        arr.map((i) => i.id)
      );
      //})
    }
  }

  function handleDragEnd(event: any) {
    console.log('drag end');
    setActiveItem(null);
    const { active, over } = event;
    console.log(active);
    console.log(over);
    if (active.id !== over.id) {
      //setItems((items) => {
      console.log("change order");
      console.log(active.id);
      console.log(over.id);
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      console.log(oldIndex);
      console.log(newIndex);

      const arr = arrayMove(items, oldIndex, newIndex);
      console.log(arr);
      setItems(arr);
      //updateTasks(arr);
      //});
    }
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveItem(event.active.data.current.task);
      return;
    }
  };

  console.log(items.map((i) => i.id));
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
    >
      <Draggable id={999}>Drag me</Draggable>

      {/*<Droppable className="bg-slate-200 w-[300px] h-[300px] p-3 mb-3">
        <div>Drop here</div>
      </Droppable>*/}

      <Button onClick={showAddNewTaskModal}>Add new task</Button>
      <div className="groups flex flex-wrap p-1 m-1">
        {groups.map((group) => (
          <Droppable key={group} id={group} >
            <div /*key={group}*/ className="bg-slate-200 m-3 p-3 h-[400px]">
              <h1 className="title mb-4">{group}</h1>
              <div key={"wrapper" + group}>
                <SortableContext
                  id={group}
                  items={items
                    .filter((item) => item.group === group)
                    .map((i) => i.id)}
                >
                  {items
                    .filter((item) => item.group === group)
                    //.sort((a, b) => (a.value.order > b.value.order ? 1 : -1))
                    .map((item) => {
                      return <TaskCard key={item.id} task={item} />;
                      /*<Draggable id={item.id} data={{ itemId: item.id }} key={item.group + "-" + item.id}>
                      {item.value.title} - {item.value.id}
                      <Button onClick={() => showEditTaskModal(item.value)}>
                        Edit
                      </Button>
                    </Draggable>*/
                    })}
                </SortableContext>
              </div>
            </div>
          </Droppable>
        ))}
      </div>
      {/*manageTaskForm()*/}
      {createPortal(
        <DragOverlay>
          {activeItem && <TaskCard task={activeItem} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
