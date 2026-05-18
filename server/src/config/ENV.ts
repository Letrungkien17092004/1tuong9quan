import "dotenv/config"
import { z } from "zod"

const EnvSchema = z.object({
  PORT: z.coerce.number(),
})


const ENV = EnvSchema.parse(process.env)

export default ENV