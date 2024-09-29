import { count, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, gte, lte } from 'drizzle-orm' // Importação simplificada
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function CreateGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

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
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalsCompletionCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,

      completionsCount: sql`
        COALESCE(${goalsCompletionCount.completionCount}, 0)
      
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
    .where(eq(goals.id, goalId))

  const { completionsCount, desiredWeeklyFrequency } = result[0]

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week')
  }
  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning()
  const goalCompletion = insertResult[0]

  return {
    goalCompletion,
  }
}
