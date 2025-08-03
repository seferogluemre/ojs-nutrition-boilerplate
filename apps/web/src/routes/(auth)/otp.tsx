import Login from "#features/login/index.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/otp")({
  component: Login,
});
