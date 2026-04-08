import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

import { createLead } from "$lib/db/leads";

export const createLeadAction = defineAction({
  accept: "json",
  input: z.object({
    email: z.string().email(),
    name: z.string().trim().max(200).optional(),
    message: z.string().trim().max(5000).optional(),
    experiment: z.string().trim().max(200).optional(),
    meta: z.unknown().optional(),
  }),
  handler: async (input) => {
    try {
      const id = createLead({
        email: input.email.trim(),
        name: input.name ?? null,
        message: input.message ?? null,
        experiment: input.experiment ?? null,
        meta: input.meta ?? null,
      });
      return { id };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      console.error("Failed to create lead", message);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save lead",
      });
    }
  },
});
