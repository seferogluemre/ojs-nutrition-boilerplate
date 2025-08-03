import UnauthorisedError from "#features/errors/unauthorized-error";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(errors)/401")({
  component: UnauthorisedError,
});
