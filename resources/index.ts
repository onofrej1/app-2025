import { Resource } from "@/resources//resources.types";
import { post } from "@/resources/post";
import { category } from "@/resources/category";
import { task } from "@/resources/task";

const resources: Resource[] = [
  post,
  category,
  task
];
export { resources };