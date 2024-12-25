import { z } from "zod";

/*const UpdateUserProfile = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().min(1)
});*/

const RegisterUser = z.object({
  //id: z.string().optional(),
  name: z.string().trim().min(4),
  email: z.string().email(),
  password: z.string().min(1)
});

const LoginUser = z.object({  
  email: z.string().email(),
  password: z.string().min(2)
});

const CreateOrEditCategory = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(4)
});

const CreateOrEditPost = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(4),
  content: z.string().min(1),
  authorId: z.string().min(1, 'Author field is required'),
  categories: z.array(z.coerce.number())
    .optional()
    .default([])
    //.transform((val) => val ? val : []),
});

export type FormSchema = 
 | 'LoginUser'
 | 'RegisterUser'
 | 'CreateOrEditPost'
 | 'CreateOrEditCategory'

const FilterResource = z.object({
  id: z.string().optional(),
});

const rules = {
  RegisterUser,
  LoginUser,
  CreateOrEditPost,
  CreateOrEditCategory,

  //UpdateUserProfile,
  FilterResource: z.any(),
};

export default rules;

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;