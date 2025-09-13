import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  titulo: string;
  descricao: string;
  instrutor: mongoose.Types.ObjectId;
  aulas: { titulo: string; url: string }[];
  criadoEm: Date;
}

const CourseSchema: Schema = new Schema<ICourse>({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  instrutor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  aulas: [
    {
      titulo: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  criadoEm: { type: Date, default: Date.now }
});

export default mongoose.model<ICourse>("Course", CourseSchema);
