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
  name: z.string().trim().min(4)
});

const CreateOrEditPost = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(4),
  content: z.string().min(1),
  authorId: z.string().min(1, 'Author field is required'),
  categories: z.array(z.coerce.number())
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

const CreateOrEditEvent = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(4),
  description: z.string().min(1),
  status: z.string().min(1),
  color: z.string().min(1),
  venue: z.string().min(1),
  maxAttendees: z.coerce.number(),
  startDate: z.date(),
  endDate: z.date(),
  createdById: z.string().min(1, 'User field is required'),  
});

export type FormSchema = 
 | 'LoginUser'
 | 'RegisterUser'
 | 'CreateOrEditPost'
 | 'CreateOrEditCategory'
 | 'CreateOrEditTask'
 | 'CreateOrEditEvent'
 | 'FilterResource'

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
  //UpdateUserProfile,
  FilterResource: z.any(),
};

export default rules;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;