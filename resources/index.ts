import { Resource } from "@/resources//resources.types";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { task } from "@/resources/task";
import { event } from "@/resources/event";

const resources: Resource[] = [
  post,
  category,
  task,
  event
];
export { resources };