import mongoose from 'mongoose'
import { AppError } from '../../shared/errors.js'
import { Student } from '../students/student.model.js'
import { Payment, toPaymentDto, type PaymentDto } from './payment.model.js'

function assertValidObjectId(id: string, label = 'id'): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, `Invalid ${label}`)
  }
}

function requirePositiveNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    throw new AppError(400, `${field} must be greater than 0`)
  }
  return value
}

export async function createPayment(input: unknown): Promise<PaymentDto> {
  if (!input || typeof input !== 'object') {
    throw new AppError(400, 'Invalid request body')
  }

  const body = input as Record<string, unknown>

  if (typeof body.studentId !== 'string' || body.studentId.trim() === '') {
    throw new AppError(400, 'studentId is required')
  }

  const studentId = body.studentId.trim()
  assertValidObjectId(studentId, 'studentId')

  const student = await Student.findById(studentId).lean()
  if (!student) {
    throw new AppError(404, 'Student not found')
  }

  const amount = requirePositiveNumber(body.amount, 'amount')

  let date = new Date()
  if (body.date !== undefined) {
    if (typeof body.date !== 'string' && !(body.date instanceof Date)) {
      throw new AppError(400, 'date must be a valid ISO date')
    }
    date = new Date(body.date as string | Date)
    if (Number.isNaN(date.getTime())) {
      throw new AppError(400, 'date must be a valid ISO date')
    }
  }

  const payment = await Payment.create({ studentId, amount, date })
  return toPaymentDto(payment)
}

export async function listPaymentsForStudent(
  studentId: string,
): Promise<PaymentDto[]> {
  assertValidObjectId(studentId, 'studentId')

  const student = await Student.findById(studentId).lean()
  if (!student) {
    throw new AppError(404, 'Student not found')
  }

  const payments = await Payment.find({ studentId }).sort({ date: -1 }).lean()
  return payments.map(toPaymentDto)
}
