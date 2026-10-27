import { z } from "zod";

import { LOCALES } from "./i18n";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  reply: z.string().trim().min(5).max(120),
  message: z.string().trim().min(10).max(3000),
  locale: z.enum(LOCALES),
  // Honeypot: hidden from people, filled in by bots
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
