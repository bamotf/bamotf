import type {PrismaClient} from 'db'
import {vi, beforeEach} from 'vitest'
import {mockDeep, mockReset} from 'vitest-mock-extended'

export const prisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prisma)
})

vi.mock('db', () => {
  return {prisma}
})
