import { z } from "zod";

export const CreateCandidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
});

export const CreateApplicationSchema = z.object({
  // Only minimal information needed, backend infers jobId from path
  source: z.string().optional().default("DIRECT_LINK"),
});
