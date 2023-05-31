/* eslint-disable import/no-anonymous-default-export */
import dotenv from 'dotenv'

dotenv.config({debug: true})

export default ['apps/*/vitest.config.ts', 'packages/*/vitest.config.ts']
