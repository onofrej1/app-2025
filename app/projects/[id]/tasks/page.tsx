"use client";
import React, { useState } from "react";
import "./tasks.css";
import { createTask, getTasks, updateTask } from "@/actions/tasks";
import { Task } from "@prisma/client";
import { useDialog } from "@/state";
import Form from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUsers } from "@/actions/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormField } from "@/resources/resources.types";

export default function Tasks() {
  const { open, setTitle, setContent, onClose } = useDialog();
  const params = useParams();
  const queryClient = useQueryClient();
  const groups = ["TODO", "IN_PROGRESS", "DONE"];
  const [activeItem, setActiveItem] = useState<HTMLDivElement | null>();
  const [activeItemClone, setActiveItemClone] =
    useState<HTMLDivElement | null>();
  const [activeGroup, setActiveGroup] = useState("");

  const { data: items = [], isFetching } = useQuery({
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

  const onDragStart = (e: React.DragEvent, group: string) => {
    setActiveGroup(group);
    setActiveItem(null);
    setActiveItemClone(null);

    const el = e.target as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.clearData();
    e.dataTransfer.setData("groupText", group);

    el.classList.add("opacity-20");
    const clone = el.cloneNode(true) as HTMLDivElement;
    clone.classList.add("hidden");
    setActiveItem(el);
    setActiveItemClone(clone);
  };

  const onDragEnd = (e: React.DragEvent) => {
    const el = e.target as HTMLDivElement;
    el.classList.remove("opacity-20");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: React.DragEvent, group: any) => {
    const el = e.target as HTMLDivElement;
    e.preventDefault();
    if (groups.includes(el.id)) {
      setActiveGroup(el.id);
    }

    /*const sourceGroup = e.dataTransfer.getData("groupText");
    if (group !== sourceGroup) {
      el.classList.add("group-over");
    }*/
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const el = e.target as HTMLDivElement;
    el.classList.remove("group-over");
  };

  const onDragEnterItem = (e: React.DragEvent) => {
    e.preventDefault();
    const el = e.target as HTMLDivElement;
    const parent = el.parentNode!;

    const item = items.find((i) => i.id === Number(el.id));
    //if (activeItemClone?.id !== el.id) {
    activeItemClone?.classList.remove("hidden");
    //}

    if (item?.group === activeGroup) {
      activeItem?.classList.add("hidden");
    }

    if (isBefore(activeItemClone as HTMLDivElement, el)) {
      parent.insertBefore(activeItemClone!, el);
    } else {
      parent.insertBefore(activeItemClone!, el.nextSibling);
    }
  };

  function isBefore(el1: Node, el2: Node) {
    if (el2.parentNode === el1.parentNode)
      for (
        var cur = el1.previousSibling;
        cur && cur.nodeType !== 9;
        cur = cur.previousSibling
      )
        if (cur === el2) return true;
    return false;
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;

    e.preventDefault();
    const id = activeItem?.id;

    const newItems = items.map((i: any) => {
      el.parentElement?.childNodes.forEach((n, index) => {
        const newEl = n as HTMLDivElement;
        if (Number(newEl.id) === i.id) {
          i.value.order = index + 1;
          console.log("update task");
          updateTask(i.value);
        }
      });

      if (i.id === Number(id) && i.group !== activeGroup) {
        i.group = activeGroup;
        i.value.status = activeGroup;
        updateTask(i.value);
      }
      return i;
    });
    el.classList.remove("group-over");
    //setItems(newItems);
    activeItem?.classList.add("hidden");
    activeItemClone?.classList.add("hidden");
  };

  function throttle(mainFunction: any, delay: number) {
    let timerFlag: any = null;

    return (...args: any[]) => {
      if (timerFlag === null) {
        mainFunction(...args);
        timerFlag = setTimeout(() => {
          timerFlag = null;
        }, delay);
      }
    };
  }

  const c = throttle(onDragEnterItem, 200);

  const sendForm = async (data: Task) => {
    data.projectId = Number(params.id);
    data.id ? updateTask(data) : createTask(data);    
    onClose();
    queryClient.invalidateQueries({ queryKey: ['tasks', params.id] });
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

  return (
    <>
      <Button onClick={showAddNewTaskModal}>Add new task</Button>
      <div className="groups flex flex-wrap p-1 m-1">
        {groups.map((group) => (
          <div
            className="group m-3 p-3 bg-green-600 min-w-[150px]"
            key={group}
            id={group}
            onDrop={onDrop}
            onDragEnter={(e) => throttle(onDragEnter(e, group), 200)}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
          >
            <h1 className="title mb-4">{group}</h1>
            <div key={"wrapper" + group}>
              {items
                .filter((item) => item.group === group)
                .sort((a, b) => (a.value.order > b.value.order ? 1 : -1))
                .map((item) => (
                  <div
                    key={item.group + "-" + item.id}
                    id={item.id.toString()}
                    className={`mt-2 p-2 hover:cursor-move bg-yellow-300 relative transition-all duration-1`}
                    draggable
                    onDragStart={(e) => onDragStart(e, group)}
                    onDragEnd={onDragEnd}
                    onDragEnter={c}
                  >
                    {item.value.title} - {item.value.id}
                    <Button onClick={() => showEditTaskModal(item.value)}>
                      Edit
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {/*manageTaskForm()*/}
    </>
  );
}
