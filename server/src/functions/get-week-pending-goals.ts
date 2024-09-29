import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, count, lte, gte, eq, sql } from 'drizzle-orm'
import { number } from 'zod'

dayjs.extend(weekOfYear)

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  //das metas seleciona as metas criadas até o ultimo dia da semana
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAd: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  //do banco de dados, seleciona de dentro das metas completas,
  //o id das metas comepleta e contagem
  //porém somente as que foram criadas do primeiro ao ultimo dia da semana

  const goalsCompletionCount = db.$with('goals_completions_count').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('CompletionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )
  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalsCompletionCount)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionsCount: sql`
        COALESCE(${goalsCompletionCount.completionCount}, 0)
      
      `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    //pega de dentro da comun table de metas completas, as metas pelo menos uma ocorrência e
    //foram criadas essa semana
    .leftJoin(
      goalsCompletionCount,
      eq(goalsCompletionCount.goalId, goalsCreatedUpToWeek.id)
    )

  return {
    pendingGoals,
  }
}
