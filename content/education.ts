import { z } from "zod";
import {
  educationEntrySchema,
  validateContent,
  type EducationEntry,
} from "@/lib/validation";

/* =========================================================================
   EDUCATION
   Only the résumé-verified degree is shown. Undergraduate study is held for
   approval (no verified degree/dates), see content/provenance.ts.
   ========================================================================= */

const data: z.input<typeof educationEntrySchema>[] = [
  {
    id: "neu-ms",
    degree: "M.S.",
    field: "Data Analytics Engineering",
    concentration: "Machine Learning",
    institution: "Northeastern University",
    location: "Boston, Massachusetts",
    date: "May 2025",
  },
];

export const education: EducationEntry[] = data.map((e, i) =>
  validateContent(educationEntrySchema, e, `education[${i}]:${e.id}`),
);
