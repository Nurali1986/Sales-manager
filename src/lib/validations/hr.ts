import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export const CreateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  department: z.string().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]).default("FULL_TIME"),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "CLOSED"]).default("DRAFT"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export const CreateQuestionSchema = z.object({
  type: z.enum(["SINGLE_CHOICE"]).default("SINGLE_CHOICE"),
  category: z.string().min(1, "Category is required"),
  questionText: z.string().min(1, "Question text is required"),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  points: z.number().default(1.0),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  order: z.number().default(0),
});

export const UpdateQuestionSchema = CreateQuestionSchema.partial();
