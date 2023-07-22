import { z } from 'nestjs-zod/z';

export const bankSchemas = {
  create: z.object({
    name: z.string().nonempty({ message: 'Você deve informar um nome' }),
    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, { message: 'Cor inválida!' })
      .nonempty({ message: 'Você deve informar uma cor' }),
  }),
  update: z
    .object({
      name: z.string().nonempty({ message: 'Você deve informar um nome' }),
      color: z
        .string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i)
        .nonempty({ message: 'Você deve informar uma cor' }),
    })
    .partial(),
};
