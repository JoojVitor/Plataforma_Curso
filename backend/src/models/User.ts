import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: "aluno" | "instrutor" | "admin";
}

const UserSchema: Schema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ["aluno", "instrutor", "admin"], default: "aluno" },
});

export default mongoose.model<IUser>("User", UserSchema);
