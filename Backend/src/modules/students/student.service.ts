import mongoose from 'mongoose'
import { AppError } from '../../shared/errors.js'
import { Student, toStudentDto, type StudentDto } from './student.model.js'

function assertValidObjectId(id: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid student id')
  }
}

function requireNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, `${field} is required`)
  }
  return value.trim()
}

function requirePositiveNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    throw new AppError(400, `${field} must be greater than 0`)
  }
  return value
}

export type CreateStudentInput = {
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type UpdateStudentInput = Partial<CreateStudentInput>

export async function createStudent(input: unknown): Promise<StudentDto> {
  if (!input || typeof input !== 'object') {
    throw new AppError(400, 'Invalid request body')
  }

  const body = input as Record<string, unknown>
  const name = requireNonEmptyString(body.name, 'name')
  const phone = requireNonEmptyString(body.phone, 'phone')
  const group = requireNonEmptyString(body.group, 'group')
  const monthlyFee = requirePositiveNumber(body.monthlyFee, 'monthlyFee')

  const student = await Student.create({ name, phone, group, monthlyFee })
  return toStudentDto(student)
}

export async function listStudents(): Promise<StudentDto[]> {
  const students = await Student.find().lean()
  return students.map(toStudentDto)
}

export async function getStudentById(id: string): Promise<StudentDto> {
  assertValidObjectId(id)
  const student = await Student.findById(id).lean()
  if (!student) {
    throw new AppError(404, 'Student not found')
  }
  return toStudentDto(student)
}

export async function updateStudent(
  id: string,
  input: unknown,
): Promise<StudentDto> {
  assertValidObjectId(id)

  if (!input || typeof input !== 'object') {
    throw new AppError(400, 'Invalid request body')
  }

  const body = input as Record<string, unknown>
  const update: UpdateStudentInput = {}

  if (body.name !== undefined) {
    update.name = requireNonEmptyString(body.name, 'name')
  }
  if (body.phone !== undefined) {
    update.phone = requireNonEmptyString(body.phone, 'phone')
  }
  if (body.group !== undefined) {
    update.group = requireNonEmptyString(body.group, 'group')
  }
  if (body.monthlyFee !== undefined) {
    update.monthlyFee = requirePositiveNumber(body.monthlyFee, 'monthlyFee')
  }

  const student = await Student.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean()

  if (!student) {
    throw new AppError(404, 'Student not found')
  }

  return toStudentDto(student)
}

export async function deleteStudent(id: string): Promise<void> {
  assertValidObjectId(id)
  const student = await Student.findByIdAndDelete(id)
  if (!student) {
    throw new AppError(404, 'Student not found')
  }
}
