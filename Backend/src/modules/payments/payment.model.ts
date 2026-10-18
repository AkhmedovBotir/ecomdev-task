import mongoose, { Schema, type HydratedDocument } from 'mongoose'

export type PaymentDto = {
  id: string
  studentId: string
  amount: number
  date: string
}

export interface IPayment {
  studentId: mongoose.Types.ObjectId
  amount: number
  date: Date
}

export type PaymentDocument = HydratedDocument<IPayment>

const paymentSchema = new Schema<IPayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const { _id, __v, studentId, ...rest } = ret as {
          _id: unknown
          __v?: unknown
          studentId: unknown
          [key: string]: unknown
        }
        return {
          id: String(_id),
          studentId: String(studentId),
          ...rest,
        }
      },
    },
  },
)

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema)

export function toPaymentDto(doc: {
  _id: mongoose.Types.ObjectId | string
  studentId: mongoose.Types.ObjectId | string
  amount: number
  date: Date | string
}): PaymentDto {
  return {
    id: String(doc._id),
    studentId: String(doc.studentId),
    amount: doc.amount,
    date: new Date(doc.date).toISOString(),
  }
}
