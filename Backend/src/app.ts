import cors from 'cors'
import express, { type Express } from 'express'
import { env } from './config/env.js'
import { debtorsRouter } from './modules/debtors/index.js'
import { paymentsRouter } from './modules/payments/index.js'
import { studentsRouter } from './modules/students/index.js'
import { errorMiddleware } from './shared/errors.js'

export function createApp(): Express {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigin,
    }),
  )
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'backend' })
  })

  app.use('/students', studentsRouter)
  app.use(paymentsRouter)
  app.use(debtorsRouter)

  app.use(errorMiddleware)

  return app
}
