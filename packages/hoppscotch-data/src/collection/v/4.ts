import { defineVersion } from "verzod"
import { z } from "zod"

import { v3_baseCollectionSchema, V3_SCHEMA } from "./3"

const v4_baseCollectionSchema = v3_baseCollectionSchema.extend({
  v: z.literal(4),
})

type Input = z.input<typeof v4_baseCollectionSchema> & {
  folders: Input[]
}

type Output = z.output<typeof v4_baseCollectionSchema> & {
  folders: Output[]
}

export const V4_SCHEMA: z.ZodType<Output, z.ZodTypeDef, Input> =
  v4_baseCollectionSchema.extend({
    folders: z.lazy(() => z.array(V4_SCHEMA)),
  })

export default defineVersion({
  initial: false,
  schema: V4_SCHEMA,
  // @ts-expect-error
  up(old: z.infer<typeof V3_SCHEMA>) {
    if (old.auth.authType === "aws-signature") {
      const {
        accessKey = "",
        secretKey = "",
        region = "",
        serviceName = "",
      } = old.auth

      return {
        ...old,
        v: 4 as const,
        auth: {
          ...old.auth,
          accessKey,
          secretKey,
          region,
          serviceName,
          addTo: "HEADERS" as const,
        },
      }
    }

    return {
      ...old,
      v: 4 as const,
    }
  },
})
