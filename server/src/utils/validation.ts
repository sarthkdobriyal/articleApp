import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});


export const createArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z
    .string()
    .min(50, 'Article content must be at least 50 characters long')
    .max(10000, 'Article content cannot exceed 10000 characters'),
})

export type CreateArticleRequest = z.infer<typeof createArticleSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

