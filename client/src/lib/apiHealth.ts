/**
 * API Health Check Utility
 * Use this to verify backend connection during development
 */

import { companyApi } from "./api";

export interface HealthCheckResult {
  status: "success" | "error";
  message: string;
  details?: unknown;
}

/**
 * Check if the backend API is reachable and responding
 */
export async function checkApiHealth(): Promise<HealthCheckResult> {
  try {
    // Try to fetch companies (simplest endpoint)
    await companyApi.getAll();

    return {
      status: "success",
      message: "Backend API is connected and responding",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "error",
        message: `Backend connection failed: ${error.message}`,
        details: error,
      };
    }

    return {
      status: "error",
      message: "Unknown error connecting to backend",
      details: error,
    };
  }
}

/**
 * Log API health check to console (useful for debugging)
 */
export async function logApiHealth(): Promise<void> {
  console.log("🔍 Checking backend API connection...");
  const result = await checkApiHealth();

  if (result.status === "success") {
    console.log("✅", result.message);
  } else {
    console.error("❌", result.message);
    if (result.details) {
      console.error("Details:", result.details);
    }
  }
}
