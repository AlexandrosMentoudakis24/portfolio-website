import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { connectToDatabase } from "../db";

const readoutSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    valueClass: {
      type: String,
      enum: ["teal", "amber", ""],
      default: "",
    },
  },
  { _id: false }
);

const aboutFactSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const skillSchema = new Schema(
  {
    name: { type: String, required: true },
    years: { type: String, required: true },
    fill: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const skillGroupSchema = new Schema(
  {
    title: { type: String, required: true },
    skills: { type: [skillSchema], default: [] },
  },
  { _id: false }
);

const experienceSchema = new Schema(
  {
    hash: { type: String, required: true },
    date: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { _id: false }
);

const projectMetricSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    metrics: { type: [projectMetricSchema], default: [] },
    tags: { type: [String], default: [] },
    repoUrl: { type: String, default: "#" },
    liveUrl: { type: String, default: "#" },
  },
  { _id: false }
);

const socialSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    icon: {
      type: String,
      enum: ["github", "linkedin", "email"],
      default: "github",
    },
  },
  { _id: false }
);

const navItemSchema = new Schema(
  {
    num: { type: String, required: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const portfolioSchema = new Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    statusText: { type: String, default: "" },
    heroEyebrow: { type: String, default: "" },
    heroHeadline: { type: String, default: "" },
    heroAccent: { type: String, default: "" },
    heroSub: { type: String, default: "" },
    readouts: { type: [readoutSchema], default: [] },
    aboutParagraphs: { type: [String], default: [] },
    aboutFacts: { type: [aboutFactSchema], default: [] },
    skillGroups: { type: [skillGroupSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    contactTitle: { type: String, default: "" },
    contactCommand: { type: String, default: "" },
    socials: { type: [socialSchema], default: [] },
    buildTag: { type: String, default: "" },
    nav: { type: [navItemSchema], default: [] },
  },
  { timestamps: true }
);

export type PortfolioDocument = InferSchemaType<typeof portfolioSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Portfolio =
  mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);

export async function getPortfolio() {
  await connectToDatabase();
  const doc = await Portfolio.findOne().lean();
  return doc;
}