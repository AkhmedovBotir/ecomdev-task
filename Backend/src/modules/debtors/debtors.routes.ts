import { Router } from 'express'
import { asyncHandler } from '../../shared/asyncHandler.js'
import * as debtorsController from './debtors.controller.js'

const router = Router()

router.get('/debtors', asyncHandler(debtorsController.list))

export default router
