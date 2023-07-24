import { AccountType } from '@prisma/client';

import { z } from 'nestjs-zod/z';

export const accountSchemas = {
  create: z.object({
    type: z.enum([AccountType.Debit, AccountType.Credit]).optional(),
    closingDay: z.number().min(1).max(31).optional(),
    bank: z.string().nonempty({ message: 'Você deve informar um banco' }),
    description: z
      .string()
      .nonempty({ message: 'Você deve informar uma descrição' }),
  }),
  update: z
    .object({
      type: z.enum([AccountType.Debit, AccountType.Credit]),
      closingDay: z.number().min(1).max(31),
      bank: z.string().nonempty({ message: 'O banco não pode estar vazio!' }),
      description: z
        .string()
        .nonempty({ message: 'A descrição não pode estar vazio!' }),
    })
    .partial(),
};
