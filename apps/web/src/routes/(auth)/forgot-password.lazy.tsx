import Login from "#features/login/index.js";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(auth)/forgot-password")({
  component: Login,
});