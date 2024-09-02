import { defineVersion } from "verzod"
import { z } from "zod"

import { V7_SCHEMA } from "./7"

export const V8_SCHEMA = V7_SCHEMA.extend({
  v: z.literal("8"),
})

export default defineVersion({
  schema: V8_SCHEMA,
  initial: false,
  up(old: z.infer<typeof V7_SCHEMA>) {
    if (old.auth.authType === "aws-signature") {
      const {
        accessKey = "",
        secretKey = "",
        region = "",
        serviceName = "",
      } = old.auth

      return {
        ...old,
        v: "8" as const,
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
      v: "8" as const,
    }
  },
})
