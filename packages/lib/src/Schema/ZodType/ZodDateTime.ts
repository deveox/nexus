import { z } from 'zod';
import { DateTime } from 'luxon';

export class ZodDateTime extends z.ZodType<DateTime<true>, ZodDateTime.Def, DateTime> {
  _parse(input: z.ParseInput) {
    const ctx = this._getOrReturnCtx(input);
    const date = this._build(input, ctx);
    if (!date) {
      z.addIssueToContext(ctx, { code: z.ZodIssueCode.invalid_type, expected: z.ZodParsedType.date, received: ctx.parsedType });
      return z.INVALID;
    }
    if (date.isValid) {
      return z.OK(input.data);
    }
    z.addIssueToContext(ctx, { code: z.ZodIssueCode.invalid_date, message: date.invalidExplanation ?? 'invalid date' });
    return z.INVALID;
  }

  _build(input: z.ParseInput, ctx: z.ParseContext): DateTime | undefined {
    switch (ctx.parsedType) {
      case 'string':
        return this._def.coerce ? DateTime.fromISO(input.data) : undefined;
      case 'date':
        return this._def.coerce ? DateTime.fromISO(input.data) : undefined;
      case 'object':
        if (input.data instanceof DateTime) {
          return input.data;
        }
        break;
    }
    return undefined;
  }
}

export namespace ZodDateTime {
  export interface Def extends z.ZodTypeDef {
    coerce: boolean;
    min?: {
      value: Comparison;
      message?: string;
    };
    max?: {
      value: Comparison;
      message?: string;
    };
  }

  export type Comparison = DateTime | ((now: DateTime) => DateTime);
}
