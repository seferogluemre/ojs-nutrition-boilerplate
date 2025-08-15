import { UserAuthForm } from "#components/form/user-auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignIn,
  validateSearch: (search) =>
    z
      .object({
        redirect: z.string().optional(),
      })
      .parse(search),
});

function SignIn() {
  const { redirect } = Route.useSearch();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          log into your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm redirect={redirect} />
      </CardContent>
    </Card>
  );
}
