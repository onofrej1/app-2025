import { Resource } from "@/resources/resources.types";

const task: Resource = {
  name: "Task",
  name_plural: "Tasks",
  model: "task",
  resource: "tasks",
  rules: "CreateOrEditTask",
  group: "Projects",
  menuIcon: "",
  filter: [],
  form: [
    { name: "title", type: "text", label: "Title" },
    { name: "description", type: "text", label: "Description" },
    { name: "status", type: "text", label: "Status" },
    { name: "order", type: "number", label: "Order" },
    { name: "dueDate", type: "datepicker", label: "DueDate" },
    {
      name: 'assignee', 
      type: 'm2m',
      label: 'Assigned users',
      resource: 'user',
      textField: 'lastName'
    },
    {
      name: "createdById",
      type: "fk",
      relation: "createdBy",
      label: "Reporter",
      resource: "user",
      textField: "lastName",
    },
    {
      name: "projectId",
      type: "fk",
      relation: "project",
      label: "Project",
      resource: "project",
      textField: "name",
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "title", header: "Title" },
    { name: "description", header: "Description" },
    { name: "status", header: "Status" },
  ],
};
export { task };
