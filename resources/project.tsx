import { Resource } from "@/resources/resources.types";

const project: Resource = {
  name: "Project",
  name_plural: "Project",
  model: "project",
  resource: "projects",
  group: "Projects",
  filter: [],
  menuIcon: "",
  rules: "CreateOrEditProject",
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "description", type: "text", label: "Description" },
    { name: "status", type: "text", label: "Status" },
    { name: "startDate", type: "datepicker", label: "Start date" },
    { name: "endDate", type: "datepicker", label: "End date" },
    { name: "cost", type: "number", label: "Cost" },
    {
      name: "managerId",
      type: "fk",
      relation: "manager",
      label: "Manager",
      resource: "user",
      renderLabel: (row: any) => `${row.lastName} ${row.firstName}`,
    },
  ],
  list: [{ name: "name", header: "Name" }],
};
export { project };
