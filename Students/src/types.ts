export type Student = {
  id: string
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type Payment = {
  id: string
  studentId: string
  amount: number
  date: string
}

export type StudentInput = {
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type PaymentInput = {
  studentId: string
  amount: number
  date: string
}
