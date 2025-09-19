import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { toast } from "#hooks/use-toast";
import { api } from "#lib/api";
import { useAuthStore } from "#stores/authStore.js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

export default function SignInForm() {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.auth["sign-in"].email.post({
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      
      auth.setAccessToken(data.token);
      auth.setUser(data.user);

      toast({
        title: "Başarılı giriş ✅", 
        description: `Hoş geldin, ${data.user.name}!`,
      });
      router.navigate({ to: "/" });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Giriş yapılamadı. Lütfen bilgilerini kontrol et.";

      toast({
        title: "Hata ❌",
        description: message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };


  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label
          htmlFor="signin-email"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          * E-Posta
        </Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signin-password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          * Şifre
        </Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          required
        />
      </div>

      <div className="text-right">
        <a
          href="#"
          className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-gray-800 dark:hover:text-gray-200"
        >
          Şifremi Unuttum?
        </a>
      </div>

      <Button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        GİRİŞ YAP
      </Button>
    </form>
  );
}