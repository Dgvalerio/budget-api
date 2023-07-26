import { z } from 'nestjs-zod/z';

export const operationSchemas = {
  create: z.object({
    date: z.string().datetime(),
    description: z
      .string()
      .nonempty({ message: 'Você deve informar uma descrição' }),
    value: z.number(),
    category: z.string().default(''),
    installments: z
      .number()
      .int()
      .min(1)
      .describe('Número de parcelas que a conta foi dividida')
      .default(1),
    paid: z
      .number()
      .int()
      .min(0)
      .describe('Número de parcelas que forma pagas')
      .default(0),
    repeat: z.boolean().default(false),
    account: z.string().nonempty({ message: 'Você deve informar uma conta' }),
  }),
  update: z
    .object({
      date: z.date(),
      description: z
        .string()
        .nonempty({ message: 'Você deve informar uma descrição' }),
      value: z.number(),
      category: z.string(),
      installments: z
        .number()
        .int()
        .min(1)
        .describe('Número de parcelas que a conta foi dividida'),
      paid: z
        .number()
        .int()
        .min(0)
        .describe('Número de parcelas que forma pagas'),
      repeat: z.boolean(),
      account: z.string().nonempty({ message: 'Você deve informar uma conta' }),
    })
    .partial(),
};
