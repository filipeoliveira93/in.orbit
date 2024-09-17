//importa db do index que ele encontrar no diretorio
import { db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  console.log(db)

  // await db.delete(goalCompletions)
  // await db.delete(goals)

  await db.insert(goals).values([
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
}

seed()
