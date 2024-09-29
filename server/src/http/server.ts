import { createGoal } from '../functions/create-goal'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import Fastify from 'fastify'
import z from 'zod'
import { getWeekPendingGoals } from '../functions/get-week-pending-goals'
import { CreateGoalCompletion } from '../functions/create-goal-completion'

//cria uma instancia do Fastifty com validador do zod
const app = Fastify().withTypeProvider<ZodTypeProvider>()

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/completions',
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body

    await CreateGoalCompletion({
      goalId,
    })
  }
)

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals()

  return { pendingGoals }
})

//rota http no tipo post em /goals
app.post(
  '/goals',
  {
    //define um esquema de validação do corpo da requisição usando zod
    schema: {
      // z.object valida a estrutura do corpo da requisição
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  // será chamada quando a rota /goals for acessada
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running on http://localhost:3333')
  })
