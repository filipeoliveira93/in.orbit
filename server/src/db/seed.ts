import dayjs from 'dayjs'
//importa db do index que ele encontrar no diretorio
import { db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  console.log(db)

  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Ler 10 páginas',
        desiredWeeklyFrequency: 3,
        description: 'Ler 10 páginas de um livro',
      },
      {
        title: 'Acordar as 5h',
        desiredWeeklyFrequency: 5,
        description: 'Acordar as 5h da manhã',
      },
      {
        title: 'Meditar 10 minutos',
        desiredWeeklyFrequency: 2,
        description: 'Meditar 10 minutos',
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
    },
    {
      goalId: result[2].id,
      createdAt: startOfWeek.add(2, 'day').toDate(),
    },
  ])
}

seed()
