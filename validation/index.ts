import { z } from "zod";

/*const UpdateUserProfile = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});*/

const RegisterUser = z.object({
  firstName: z.string().trim().min(4),
  lastName: z.string().trim().min(4),
  email: z.string().email(),
  password: z.string().min(1),
});

const LoginUser = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

const CreateOrEditCategory = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1),
});

const CreateOrEditTag = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
});

const CreateOrEditPost = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  status: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().min(1, "Author field is required"),
  categories: z.array(z.coerce.number()).optional().default([]),
  tags: z.array(z.coerce.number()).optional().default([]),
  //.transform((val) => val ? val : []),
});

const CreateOrEditProject = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().trim().min(4),
  status: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  managerId: z.string(),
});

const CreateOrEditTask = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  order: z.coerce.number(),
  dueDate: z.date(),
  createdById: z.string().min(1, "User field is required"),
  assignee: z.array(z.coerce.number()).optional().default([]),
  projectId: z.coerce.number(),
});

const CreateTask = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().optional(),
  dueDate: z.date(), //(z.coerce.date()),
  assigneeId: z.string().min(1, "User field is required"),
});

const SendFriendRequest = z.object({
  email: z.string().email(),
});

const SendMessage = z.object({
  message: z.string().min(1),
});

const CreateEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1).optional(),
  location: z.string().optional(),
  venueId: z.coerce.number().nullable().optional(),
  organizerId: z.coerce.number().nullable().optional(),
  maxAttendees: z.coerce.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
});

const CreateOrEditEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1),
  location: z.string().optional(),
  venueId: z.coerce.number().nullable(),
  organizerId: z.string().nullable(),
  maxAttendees: z.coerce.number().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  createdById: z.string().min(1, "User field is required"),
});

const CreateOrEditRun = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  distance: z.coerce.number(),
  price: z.coerce.number(),
  elevation: z.coerce.number(),
  eventId: z.coerce.number(),
  runCategories: z.array(z.coerce.number()).optional().default([]),
});

const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MAN", "WOMAN"]),
  email: z.string().email(),

  runId: z.coerce.number(),
  nation: z.string().trim().min(1),
  city: z.string().trim().min(1),
  club: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const CreateRunResult = z.array(
  z.object({
    id: z.number().optional(),
    name: z.string().trim().min(1),
    club: z.string().trim().min(1),
    category: z.string().trim().min(1),
    bib: z.coerce.number(),
    rank: z.coerce.number(),
    time: z.coerce.number(),
    gender: z.enum(["MAN", "WOMAN"]),
    yearOfBirth: z.coerce.number(),
    runId: z.coerce.number(),
  })
);

const CreateOrEditActivity = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  type: z.string().trim().min(1),
  distance: z.coerce.number().optional(),
  calories: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
});

const CreateOrEditRunCategory = z.object({
  id: z.number().optional(),
  category: z.string().trim().min(1),
  title: z.string().trim().min(4),
});

const CreateOrEditVenue = z.object({
  id: z.number().optional(),
  location: z.string().trim().min(1),
});

const CreateOrEditOrganizer = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
});

const ContactForm = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(4),
});

const ResetPasswordRequest = z.object({
  email: z.string().email(),
});

const ChangePassword = z.object({
  password: z.string().min(3),
  confirmPassword: z.string().min(3),
});

const CreatePost = z.object({
  content: z.string().min(3),
});

export type FormSchema =
  | "LoginUser"
  | "RegisterUser"
  | "CreateOrEditPost"
  | "CreateOrEditCategory"
  | "CreateOrEditTag"
  | "CreateOrEditTask"
  | "CreateOrEditEvent"
  | "CreateOrEditRun"
  | "CreateOrEditRunCategory"
  | "CreateOrEditVenue"
  | "CreateOrEditOrganizer"
  | "CreateOrEditActivity"
  | "CreateOrEditProject"
  | "FilterResource"
  | "CreateRegistration"
  | "CreateRunResult"
  | "ContactForm"
  | "SendFriendRequest"
  | "ResetPasswordRequest"
  | "SendMessage"
  | "ChangePassword"
  | "ResetPassword"
  | "CreateTask"
  | "CreateEvent"
  | "CreatePost";

const rules = {
  RegisterUser,
  LoginUser,
  ChangePassword,
  CreateOrEditPost,
  CreateOrEditCategory,
  CreateOrEditTask,
  CreateOrEditEvent,
  CreateOrEditTag,
  CreateEvent,
  CreateOrEditRun,
  CreateOrEditRunCategory,
  CreateOrEditVenue,
  CreateOrEditOrganizer,
  CreateOrEditActivity,
  CreateRegistration,
  CreateRunResult,
  ResetPasswordRequest,
  CreateOrEditProject,
  ContactForm,
  CreateTask,
  //UpdateUserProfile,
  FilterResource: z.any(),
  SendFriendRequest,
  SendMessage,
  CreatePost,
};

export default rules;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;
export type ContactForm = z.infer<typeof ContactForm>;
export type CreateTaskType = z.infer<typeof CreateTask>;
