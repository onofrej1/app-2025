import { Resource } from "@/resources//resources.types";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { task } from "@/resources/task";
import { event } from "@/resources/event";
import { tag } from "@/resources/tag";
import { run } from "@/resources/run";
import { runCategory } from "@/resources/runCategory";
import { venue } from "@/resources/venue";
import { organizer } from "@/resources/organizer";
import { activity } from "@/resources/activity";
import { project } from "@/resources/project";

const resources: Resource[] = [
  post,
  category,
  task,
  event,
  tag,
  run,
  runCategory,
  venue,
  organizer,
  activity,
  project,
];

const include: Record<string, Record<string, boolean>> = {};
for (const r of resources) {
  for (const field of r.form) {
    if (field.type === "m2m") {
      if (!include[r.model]) include[r.model] = {};
      include[r.model][field.name] = true;
    }
  }
}

const models = resources.map((r) => ({
  model: r.model,
  resource: r.resource,
  relations: include[r.model] || [],
}));

export { resources, models };
