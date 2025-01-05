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
  activity
];
export { resources };