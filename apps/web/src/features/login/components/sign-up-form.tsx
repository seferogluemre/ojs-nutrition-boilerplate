import { Button } from "#components/ui/button.js";
import { Checkbox } from "#components/ui/checkbox.js";
import { Input } from "#components/ui/input.js";
import { Label } from "#components/ui/label.js";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface SignUpFormProps {
  onSwitchToSignIn?: () => void;
}

export default function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { auth } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.auth["sign-up"].email.post({
        email,
        firstName,
        lastName,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      auth.setAccessToken(data.token);
      auth.setUser(data.user);
      toast({
        title: "Başarılı",
        description: `Kaydınız başarılı şekilde tamamlandı`,
      });
    },
    onError: (error) => {
      console.error("Hata oluştu:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="signup-firstname"
            className="text-sm font-medium text-gray-700"
          >
            Ad
          </Label>
          <Input
            id="signup-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-gray-200 bg-gray-50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-lastname"
            className="text-sm font-medium text-gray-700"
          >
            Soyad
          </Label>
          <Input
            id="signup-lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-gray-200 bg-gray-50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-email"
          className="text-sm font-medium text-gray-700"
        >
          E-Posta
        </Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-gray-200 bg-gray-50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="signup-password"
          className="text-sm font-medium text-gray-700"
        >
          Şifre
        </Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-gray-200 bg-gray-50"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={!email || !firstName || !lastName || !password}
        onClick={handleSubmit}
        className="w-full bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        ÜYE OL
      </Button>

      <div className="space-y-3 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" className="mt-1" />
          <label
            htmlFor="terms"
            className="text-xs leading-relaxed text-gray-600"
          >
            Kampanyalardan haberdar olmak için{" "}
            <a href="#" className="text-blue-600 underline">
              Ticari Elektronik İleti Onayı
            </a>{" "}
            metnini okudum, onaylıyorum. Tarafımızdan gönderilecek ticari
            elektronik iletileri almak istiyorum.
          </label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="privacy" className="mt-1" />
          <label
            htmlFor="privacy"
            className="text-xs leading-relaxed text-gray-600"
          >
            <a href="#" className="text-blue-600 underline">
              Üyelik sözleşmesini
            </a>{" "}
            ve{" "}
            <a href="#" className="text-blue-600 underline">
              KVKK Aydınlatma Metnini
            </a>{" "}
            okudum, kabul ediyorum.
          </label>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="text-sm text-gray-600">
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-medium text-blue-600 underline hover:text-blue-700"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </form>
  );
}
