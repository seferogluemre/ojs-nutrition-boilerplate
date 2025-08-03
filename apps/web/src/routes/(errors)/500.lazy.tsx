import GeneralError from "#features/errors/general-error";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(errors)/500")({
  component: GeneralError,
});
