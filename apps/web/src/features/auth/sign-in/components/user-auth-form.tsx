import { PasswordInput } from "#components/password-input";
import { Button } from "#components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#components/ui/form";
import { Input } from "#components/ui/input";
import { cn } from "#lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

interface LoginFormData {
  email: string;
  password: string;
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    setIsLoading(true);


    setTimeout(() => {
      setIsLoading(false);
      navigate({ to: "/" });
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email gerekli",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Geçersiz email adresi"
                }
              }}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Şifre gerekli",
                minLength: {
                  value: 7,
                  message: "Şifre en az 7 karakter olmalı"
                }
              }}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
