import { z } from 'nestjs-zod/z';

export const authSchemas = {
  signIn: z.object({
    email: z
      .string()
      .email()
      .nonempty({ message: 'Você deve informar um e-mail' }),
    password: z
      .string()
      .min(8)
      .nonempty({ message: 'Você deve informar uma senha' }),
  }),
  github: z.object({
    code: z.string().nonempty({ message: 'Você deve o código' }),
  }),
};
