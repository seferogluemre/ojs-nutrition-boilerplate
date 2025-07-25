import { Button } from "#components/ui/button.js";
import { Input } from "#components/ui/input.js";
import { Label } from "#components/ui/label.js";

export default function SignInForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
          * E-Posta
        </Label>
        <Input id="signin-email" type="email" className="w-full bg-gray-50 border-gray-200" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
          * Şifre
        </Label>
        <Input id="signin-password" type="password" className="w-full bg-gray-50 border-gray-200" required />
      </div>

      <div className="text-right">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-800 underline">
          Şifremi Unuttum?
        </a>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-sm">
        GİRİŞ YAP
      </Button>
    </form>
  )
}
