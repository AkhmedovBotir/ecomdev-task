import type { Request, Response } from 'express'
import * as studentService from './student.service.js'

export async function create(req: Request, res: Response): Promise<void> {
  const student = await studentService.createStudent(req.body)
  res.status(201).json(student)
}

export async function list(_req: Request, res: Response): Promise<void> {
  const students = await studentService.listStudents()
  res.json(students)
}

export async function getById(req: Request, res: Response): Promise<void> {
  const student = await studentService.getStudentById(req.params.id as string)
  res.json(student)
}

export async function update(req: Request, res: Response): Promise<void> {
  const student = await studentService.updateStudent(
    req.params.id as string,
    req.body,
  )
  res.json(student)
}

export async function remove(req: Request, res: Response): Promise<void> {
  await studentService.deleteStudent(req.params.id as string)
  res.status(204).send()
}
