import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../env'

// console.log(env.data?.DATABASE_URL)

export const client = postgres(env.data.DATABASE_URL)
export const db = drizzle(client, { schema, logger: true })
console.log(db)
