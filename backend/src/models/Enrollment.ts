import mongoose, { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
  aluno: mongoose.Types.ObjectId;
  curso: mongoose.Types.ObjectId;
  data: Date;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>({
  aluno: { type: Schema.Types.ObjectId, ref: "User", required: true },
  curso: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  data: { type: Date, default: Date.now }
});

EnrollmentSchema.index({ aluno: 1, curso: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
