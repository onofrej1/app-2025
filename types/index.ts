export enum Model {
  task = "task",
  event = "event",
  user = "user",
}

export enum Action {
  created = "created",
  updated = "updated",
  deleted = "deleted",
}

export type DialogState<T> = {
  isOpen: boolean;
  toggleModal: () => void;
  data: T | null;
  setData: (object: T) => void;
};
