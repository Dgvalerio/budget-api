import { z } from 'nestjs-zod/z';

export const userSchemas = {
  create: z
    .object({
      name: z.string().nonempty({ message: 'Você deve informar um nome' }),
      email: z
        .string()
        .email()
        .nonempty({ message: 'Você deve informar um e-mail' }),
      avatarUrl: z.string().url().optional(),
      githubId: z.number().int().optional(),
      password: z.string().min(8).optional(),
      passwordConfirmation: z.string().min(8).optional(),
    })
    .refine((data) => data.githubId || data.password, {
      message: 'Você deve informar um senha ou um GithubID',
      path: ['password', 'githubId'],
    })
    .refine(
      (data) =>
        !data.githubId ? data.password && data.passwordConfirmation : true,
      {
        message: 'Você deve informar a confirmação de senha',
        path: ['passwordConfirmation'],
      }
    )
    .refine(
      (data) =>
        !data.githubId ? data.password === data.passwordConfirmation : true,
      {
        message: 'A senha e a confirmação de senha devem ser iguais',
        path: ['password', 'passwordConfirmation'],
      }
    ),
  update: z
    .object({
      name: z
        .string()
        .nonempty({ message: 'O nome não pode estar em branco!' }),
      email: z
        .string()
        .email()
        .nonempty({ message: 'O nome não pode estar em branco!' }),
      avatarUrl: z.string().url(),
      githubId: z.number().int(),
      password: z.string().min(8),
      passwordConfirmation: z.string().min(8),
    })
    .partial()
    .refine((data) => !(data.password && !data.passwordConfirmation), {
      message: 'Você deve informar a confirmação de senha',
      path: ['passwordConfirmation'],
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'A senha e a confirmação de senha devem ser iguais',
      path: ['password', 'githubId'],
    }),
};
