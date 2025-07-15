import { Main } from "#components/layout/main";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Textarea } from "#components/ui/textarea";
import { useToast } from "#hooks";
import { useState } from "react";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.firstName.trim()) {
      toast({
        title: "Hata",
        description: "İsim alanı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!form.email.trim()) {
      toast({
        title: "Hata", 
        description: "E-posta alanı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!form.message.trim()) {
      toast({
        title: "Hata",
        description: "Mesaj alanı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Başarılı",
        description: "Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.",
      });
      
      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Main>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bize Ulaşın
            </h1>
            <p className="text-gray-600 mb-8">
              Bize aşağıdaki iletişim ulaşabilirsiniz.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  İsim *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="İsim"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Soyad"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Posta
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="E-Posta"
                required
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj
              </Label>
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Mesajınızı buraya yazın..."
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "GÖNDERİLİYOR..." : "GÖNDER"}
              </Button>
            </div>
          </form>

          {/* Additional Information */}
          <div className="text-center space-y-4 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="mb-2">
                *Aynı gün kargo hafta içi 16:00, Cumartesi ise 11:00'a kadar verilen siparişler için geçerlidir.
              </p>
              <p className="mb-2">
                Siparişler kargoya verilince e-posta ya da sms ile bilgilendirime yapılır.
              </p>
            </div>
            
            <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              <p>
                Telefon ile <strong>0850 303 29 89</strong> numarasını arayarak da bizlere sesli mesaj bırakabilirsiniz. 
                Sesli mesajınıza hafta içi saat <strong>09:00-17:00</strong> arasında dönüş sağlanmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
} 