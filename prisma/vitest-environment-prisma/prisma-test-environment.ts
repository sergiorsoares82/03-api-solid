import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'


// postgresql://docker:docker@localhost:5432/apisolid?schema=public

const prisma = new PrismaClient()

function getDatabaseURL(schema: string) {
    if (!process.env.DATABASE_URL) throw new Error('Please provide a DATABASE_URL environment variable')

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    const schema = randomUUID()
      const databaseURL = getDatabaseURL(schema)
      
      process.env.DATABASE_URL = databaseURL

      execSync('npx prisma migrate deploy')
    return {
      async teardown() {
            await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
            await prisma.$disconnect()
      },
    }
  },
}