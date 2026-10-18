import { apiFetch } from './api'
import type { Payment, PaymentInput, Student, StudentInput } from '../types'

export function listStudents() {
  return apiFetch<Student[]>('/students')
}

export function createStudent(body: StudentInput) {
  return apiFetch<Student>('/students', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateStudent(id: string, body: StudentInput) {
  return apiFetch<Student>(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteStudent(id: string) {
  return apiFetch<void>(`/students/${id}`, {
    method: 'DELETE',
  })
}

export function listStudentPayments(studentId: string) {
  return apiFetch<Payment[]>(`/students/${studentId}/payments`)
}

export function createPayment(body: PaymentInput) {
  return apiFetch<Payment>('/payments', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
