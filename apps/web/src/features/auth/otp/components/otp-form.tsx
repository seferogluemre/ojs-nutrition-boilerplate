import { PinInput, PinInputField } from "#components/pin-input";
import { Button } from "#components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "#components/ui/form";
import { Input } from "#components/ui/input";
import { Separator } from "#components/ui/separator";
import { toast } from "#hooks/use-toast";
import { cn } from "#lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";

type OtpFormProps = HTMLAttributes<HTMLDivElement>;

interface OtpFormData {
  otp: string;
}

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);

  const form = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  function onSubmit(data: OtpFormData) {
    setIsLoading(true);
    toast({
      title: "OTP doğrulandı:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate({ to: "/" });
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="otp"
              rules={{
                required: "OTP kodu gerekli",
                minLength: {
                  value: 6,
                  message: "OTP kodu 6 haneli olmalı"
                }
              }}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <PinInput
                      {...field}
                      className="flex h-10 justify-between"
                      onComplete={() => setDisabledBtn(false)}
                      onIncomplete={() => setDisabledBtn(true)}
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <PinInputField
                          key={i}
                          component={Input}
                          className="!w-12 text-center"
                        />
                      ))}
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-2"
              loading={isLoading}
              disabled={disabledBtn}
            >
              Doğrula
            </Button>
          </div>
        </form>
      </Form>

      <Separator />

      <div className="text-center text-sm text-gray-600">
        Kod gelmedi mi?{" "}
        <Button variant="link" className="p-0 h-auto font-normal">
          Yeniden gönder
        </Button>
      </div>
    </div>
  );
}
