import { z } from "zod";

/*const UpdateUserProfile = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});*/

const RegisterUser = z.object({
  name: z.string().trim().min(4),
  email: z.string().email(),
  password: z.string().min(1)
});

const LoginUser = z.object({  
  email: z.string().email(),
  password: z.string().min(2)
});

const CreateOrEditCategory = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1)
});

const CreateOrEditTag = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4)
});

const CreateOrEditPost = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  published: z.coerce.boolean(),
  content: z.string().min(1),
  authorId: z.string().min(1, 'Author field is required'),
  categoryId: z.coerce.number(),
  tags: z.array(z.coerce.number())
    .optional()
    .default([])
    //.transform((val) => val ? val : []),
});

const CreateOrEditTask = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  order: z.coerce.number(),
  deadline: z.date(), //(z.coerce.date()),
  userId: z.string().min(1, 'User field is required'),  
});

const SendFriendRequest = z.object({  
  email: z.string().email(),
});

const SendMessage = z.object({  
  message: z.string().min(1),
});

const CreateOrEditEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1),
  location: z.string().optional(),
  venueId: z.coerce.number().optional(),
  organizerId: z.coerce.number().optional(),
  maxAttendees: z.coerce.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  createdById: z.string().min(1, 'User field is required'),  
});

const CreateOrEditRun = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  distance: z.coerce.number(),
  price: z.coerce.number(),
  elevation: z.coerce.number(),  
  eventId: z.coerce.number(),
  runCategories: z.array(z.coerce.number())
    .optional()
    .default([])
});

const CreateRegistration = z.object({
  id: z.number().optional(),
  firstName: z.string().trim().min(1),
  lastName:  z.string().trim().min(1),
  dateOfBirth: z.coerce.date(),
  gender:  z.enum(['MAN', 'WOMAN']),
  email: z.string().email(),

  runId: z.coerce.number(),
  nation: z.string().trim().min(1),
  city: z.string().trim().min(1),
  club: z.string().trim().min(1),
  phone: z.string().trim().min(1),  
});

const CreateRunResult = z.array(z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
  club:  z.string().trim().min(1),
  category:  z.string().trim().min(1),
  bib:  z.coerce.number(),
  rank: z.coerce.number(),
  time: z.coerce.number(),  
  gender: z.enum(['MAN', 'WOMAN']),
  yearOfBirth: z.coerce.number(),
  runId: z.coerce.number(),
}));

const CreateOrEditActivity = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  type: z.string().trim().min(1),
  distance: z.coerce.number(),
  calories: z.coerce.number(),
  duration: z.coerce.number(),  
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

export type FormSchema = 
 | 'LoginUser'
 | 'RegisterUser'
 | 'CreateOrEditPost'
 | 'CreateOrEditCategory'
 | 'CreateOrEditTag'
 | 'CreateOrEditTask'
 | 'CreateOrEditEvent'
 | 'CreateOrEditRun'
 | 'CreateOrEditRunCategory'
 | 'CreateOrEditVenue'
 | 'CreateOrEditOrganizer'
 | 'CreateOrEditActivity'
 | 'FilterResource'
 | 'CreateRegistration'
 | 'CreateRunResult'
 | 'SendFriendRequest'
 | 'SendMessage'

const FilterResource = z.object({
  id: z.string().optional(),
});

const rules = {
  RegisterUser,
  LoginUser,
  CreateOrEditPost,
  CreateOrEditCategory,
  CreateOrEditTask,
  CreateOrEditEvent,
  CreateOrEditTag,
  CreateOrEditRun,
  CreateOrEditRunCategory,
  CreateOrEditVenue,
  CreateOrEditOrganizer,
  CreateOrEditActivity,
  CreateRegistration,
  CreateRunResult,
  //UpdateUserProfile,
  FilterResource: z.any(),
  SendFriendRequest,
  SendMessage
};

export default rules;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;