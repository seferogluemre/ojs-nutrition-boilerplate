import { OtpForm } from "#/components/form/otp-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/otp")({
  component: Otp,
});

function Otp() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base tracking-tight">Two-factor Authentication</CardTitle>
        <CardDescription>
          Please enter the authentication code. <br /> We have sent the authentication code to your
          email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground px-8 text-center text-sm">
          Haven't received it?{" "}
          <Link to="/sign-in" className="hover:text-primary underline underline-offset-4">
            Resend a new code.
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
