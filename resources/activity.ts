import { Resource } from "@/resources/resources.types";

const activity: Resource = {
  name: "Activity",
  name_plural: "Activities",
  model: "activity",
  resource: "activities",
  rules: "CreateOrEditActivity",
  group: 'Manage activities',
  menuIcon: "",
  filter: [],
  form: [
    { name: "name", type: "text", label: "Name" },
    { name: "distance", type: "number", label: "Distance" },
    { name: "calories", type: "number", label: "Calories burned" },
    { name: "duration", type: "number", label: "Duration [sec]" },
    {
      name: "type",
      type: "select",
      className: "w-60",
      label: "Type",
      options: [
        {
          label: "Run",
          value: "run",
        },
        {
          label: "Walk",
          value: "walk",
        },
        {
          label: "Cycling",
          value: "cycling",
        },
      ],
    },
  ],
  list: [
    { name: "id", header: "Id" },
    { name: "name", header: "Name" },
    {
      name: "distance",
      header: "Distance",
    },
  ],
};
export { activity };
