import type { AiState } from "@/components/particle-face";

/**
 * Face-state colors for the light landing (Design Bible §19.4 v3.5).
 * Deep violets read cleanly on white; success keeps the product green.
 */
export const LANDING_FACE: Partial<Record<AiState, string>> = {
  idle: "#7C3AED",
  listening: "#8B5CF6",
  thinking: "#6D28D9",
  speaking: "#7C3AED",
  success: "#16A34A",
};
