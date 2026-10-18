import { AppError } from '../../shared/errors.js'
import { Payment } from '../payments/payment.model.js'
import { Student } from '../students/student.model.js'

export type DebtorDto = {
  studentId: string
  name: string
  phone: string
  group: string
  monthlyFee: number
  paid: number
  debt: number
}

const MONTH_PATTERN = /^\d{4}-\d{2}$/

function parseMonth(month: unknown): { start: Date; end: Date } {
  if (typeof month !== 'string' || !MONTH_PATTERN.test(month)) {
    throw new AppError(400, 'month query must be YYYY-MM')
  }

  const [yearStr, monthStr] = month.split('-')
  const year = Number(yearStr)
  const monthIndex = Number(monthStr)

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(monthIndex) ||
    monthIndex < 1 ||
    monthIndex > 12
  ) {
    throw new AppError(400, 'month query must be YYYY-MM')
  }

  const start = new Date(Date.UTC(year, monthIndex - 1, 1))
  const end = new Date(Date.UTC(year, monthIndex, 1))

  return { start, end }
}

export async function listDebtors(month: unknown): Promise<DebtorDto[]> {
  const { start, end } = parseMonth(month)

  const students = await Student.find().lean()
  const payments = await Payment.find({
    date: { $gte: start, $lt: end },
  }).lean()

  const paidByStudent = new Map<string, number>()
  for (const payment of payments) {
    const key = String(payment.studentId)
    paidByStudent.set(key, (paidByStudent.get(key) ?? 0) + payment.amount)
  }

  const debtors: DebtorDto[] = []

  for (const student of students) {
    const studentId = String(student._id)
    const paid = paidByStudent.get(studentId) ?? 0
    if (paid < student.monthlyFee) {
      debtors.push({
        studentId,
        name: student.name,
        phone: student.phone,
        group: student.group,
        monthlyFee: student.monthlyFee,
        paid,
        debt: student.monthlyFee - paid,
      })
    }
  }

  return debtors
}
