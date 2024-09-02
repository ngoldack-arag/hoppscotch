import { defineVersion } from "verzod"
import { z } from "zod"

import { V6_SCHEMA } from "./6"

export const V7_SCHEMA = V6_SCHEMA.extend({
  v: z.literal(7),
})

export default defineVersion({
  schema: V7_SCHEMA,
  initial: false,
  up(old: z.infer<typeof V6_SCHEMA>) {
    if (old.auth.authType === "aws-signature") {
      const {
        accessKey = "",
        secretKey = "",
        region = "",
        serviceName = "",
      } = old.auth

      return {
        ...old,
        v: 7 as const,
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
      v: 7 as const,
    }
  },
})
