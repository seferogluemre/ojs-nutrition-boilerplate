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
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";

type SignUpFormProps = HTMLAttributes<HTMLDivElement>;

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: SignUpFormData) {
    setIsLoading(true);

    console.log(data);

    setTimeout(() => {
      setIsLoading(false);
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
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Şifre tekrarı gerekli",
                validate: (value) => {
                  const password = form.getValues("password");
                  return value === password || "Şifreler eşleşmiyor";
                }
              }}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Şifre Tekrarı</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Kayıt Ol
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
