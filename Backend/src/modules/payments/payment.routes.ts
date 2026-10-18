import { Router } from 'express'
import { asyncHandler } from '../../shared/asyncHandler.js'
import * as paymentController from './payment.controller.js'

const router = Router()

router.post('/payments', asyncHandler(paymentController.create))
router.get(
  '/students/:id/payments',
  asyncHandler(paymentController.listForStudent),
)

export default router
