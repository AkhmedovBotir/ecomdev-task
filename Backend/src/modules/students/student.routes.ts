import { Router } from 'express'
import { asyncHandler } from '../../shared/asyncHandler.js'
import * as studentController from './student.controller.js'

const router = Router()

router.post('/', asyncHandler(studentController.create))
router.get('/', asyncHandler(studentController.list))
router.get('/:id', asyncHandler(studentController.getById))
router.put('/:id', asyncHandler(studentController.update))
router.delete('/:id', asyncHandler(studentController.remove))

export default router
