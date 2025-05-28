import { toast } from "sonner";

export function showError(error: unknown) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    toast(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error("Error:", error);
    toast(`Error: ${error}`);
  } else {
    console.error("Unknown error:", error);
    toast("An error occurred.");
  }
}