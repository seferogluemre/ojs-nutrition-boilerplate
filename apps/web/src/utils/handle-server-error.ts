import { toast } from "#hooks/use-toast";
import { AxiosError } from "axios";

export function handleServerError(error: unknown) {
  console.log(error);

  let errMsg = "Something went wrong!";

  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    Number(error.status) === 204
  ) {
    errMsg = "Content not found.";
  }

  if (error instanceof AxiosError) {
    errMsg = error.response?.data.title;
  }

  toast({ variant: "destructive", title: errMsg });
}
