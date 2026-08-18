import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { connectToDatabase } from "../db";

const resumeSchema = new Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

export type ResumeDocument = InferSchemaType<typeof resumeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Resume =
  mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export async function getResume() {
  await connectToDatabase();
  return Resume.findOne();
}

export async function getResumeStatus() {
  await connectToDatabase();
  const doc = (await Resume.findOne().lean()) as
    | (ResumeDocument & { data: Buffer })
    | null;
  return { exists: Boolean(doc), filename: doc?.filename ?? null };
}