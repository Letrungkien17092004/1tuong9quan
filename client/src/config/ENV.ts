import { z } from "zod"


const EnvSchema = z.object({
    BASE_API_URL: z.url()
})

console.log(import.meta.env)
const ENV = EnvSchema.parse({
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL
})

export default ENV