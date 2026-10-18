import mongoose, { Schema, type HydratedDocument } from 'mongoose'

export type StudentDto = {
  id: string
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export interface IStudent {
  name: string
  phone: string
  group: string
  monthlyFee: number
}

export type StudentDocument = HydratedDocument<IStudent>

const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    group: { type: String, required: true, trim: true },
    monthlyFee: { type: Number, required: true, min: 0.01 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret as {
          _id: unknown
          __v?: unknown
          [key: string]: unknown
        }
        return { id: String(_id), ...rest }
      },
    },
  },
)

export const Student = mongoose.model<IStudent>('Student', studentSchema)

export function toStudentDto(doc: {
  _id: mongoose.Types.ObjectId | string
  name: string
  phone: string
  group: string
  monthlyFee: number
}): StudentDto {
  return {
    id: String(doc._id),
    name: doc.name,
    phone: doc.phone,
    group: doc.group,
    monthlyFee: doc.monthlyFee,
  }
}
