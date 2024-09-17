import { z } from 'zod'
// valida as variaveis de ambiente
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})
// safeParse retorna um objeto com a validação das variaveis de ambiente
export const env = envSchema.safeParse(process.env)

// se a validação falhar, informa o erro
if (env.success === false) {
  console.error('⚠️  Invalid environment variables:', env.error.format())
  throw new Error('Invalid environment variables')
}
