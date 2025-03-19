import { Type } from '@/Schema/Type.js'
import { addIssueToContext, z } from 'zod'

export class ZodBuffer extends z.ZodType<Buffer, z.ZodTypeDef, Buffer> {
  _parse(input: z.ParseInput) {
    const ctx = this._getOrReturnCtx(input)
    if (input.data instanceof Buffer) {
      return z.OK(input.data)
    }
    addIssueToContext(ctx, { code: z.ZodIssueCode.invalid_type, expected: 'Buffer' as z.ZodParsedType, received: ctx.parsedType })
    return z.INVALID
  }
}

export class TBuffer extends Type.Primitive<ZodBuffer> {
  declare db_output: Buffer
  declare json_output: TBuffer.JSON
  def: TBuffer.Def.Resolved
  constructor(def?: TBuffer.Def) {
    super(new ZodBuffer(def ?? {}))
    this.def = {
      enc: def?.enc ?? TBuffer.Encoding.BASE64,
    }
    this.json = {
      serialize: value => {
        return {
          data: value.toString(this.def.enc),
          enc: this.def.enc,
        }
      },
      deserializer: TBuffer.json.transform(value => Buffer.from(value.data, value.enc)),
    }
  }
}

export namespace TBuffer {
  export enum Encoding {
    ASCII = 'ascii',
    UTF8 = 'utf8',
    UTF8Dash = 'utf-8',
    UTF16LE = 'utf16le',
    UTF16LEDash = 'utf-16le',
    UCS2 = 'ucs2',
    UCS2Dash = 'ucs-2',
    BASE64 = 'base64',
    BASE64URL = 'base64url',
    LATIN1 = 'latin1',
    BINARY = 'binary',
    HEX = 'hex',
  }
  export const json = z.object({
    data: z.string(),
    enc: z.nativeEnum(TBuffer.Encoding),
  })

  export type JSON = z.infer<typeof json>
  export interface Def extends Def.Base, z.ZodTypeDef {}
  export namespace Def {
    export interface Base {
      /**
       * Default encoding for serialization
       * @default 'base64'
       */
      enc?: Encoding
    }

    export interface Resolved extends Required<Base>, z.ZodTypeDef {}
  }
}
