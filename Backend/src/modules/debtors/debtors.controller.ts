import type { Request, Response } from 'express'
import * as debtorsService from './debtors.service.js'

export async function list(req: Request, res: Response): Promise<void> {
  const debtors = await debtorsService.listDebtors(req.query.month)
  res.json(debtors)
}
