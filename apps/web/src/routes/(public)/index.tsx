import Home from "#features/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/")({
  component: Home,
});