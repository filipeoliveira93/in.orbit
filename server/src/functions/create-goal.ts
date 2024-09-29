import { db } from '../db'
import { goals } from '../db/schema'
//cria um modelo de objeto para a request
interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

//passa o modelo de objeto para ser inserido no banco de dados
export const createGoal = async (request: CreateGoalRequest) => {
  //cria variáveis para receber os dados do objeto request
  const { title, desiredWeeklyFrequency } = request

  //cria uma const que usa os métodos do drizzle para inserir dados no DB
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning() //função do ORM,  retorna os dados que foram inseridos no DB

  const goal = result[0]

  return {
    goal,
  }
}
