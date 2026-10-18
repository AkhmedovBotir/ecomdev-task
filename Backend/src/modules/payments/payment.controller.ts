import type { Request, Response } from 'express'
import * as paymentService from './payment.service.js'

export async function create(req: Request, res: Response): Promise<void> {
  const payment = await paymentService.createPayment(req.body)
  res.status(201).json(payment)
}

export async function listForStudent(
  req: Request,
  res: Response,
): Promise<void> {
  const payments = await paymentService.listPaymentsForStudent(
    req.params.id as string,
  )
  res.json(payments)
}
