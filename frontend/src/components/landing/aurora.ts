import type { AiState } from "@/components/particle-face";

/**
 * Aurora face-state colors — landing scope only (Design Bible §19.4 v3.2).
 * The product interior keeps the violet identity; the public landing runs the
 * iridescent Aurora ramp (violet → magenta → amber).
 */
export const AURORA_FACE: Partial<Record<AiState, string>> = {
  idle: "#C084FC",
  listening: "#D8B4FE",
  thinking: "#E45FBC",
  speaking: "#F2A65A",
  success: "#3DBF71",
};
