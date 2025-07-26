import { toast } from "#hooks/use-toast";
import { api } from "#lib/api";
import { useAuthStore } from "#stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface AccountInfoTabProps {
  user: any;
}

export function AccountInfoTab({ user }: AccountInfoTabProps) {
  const { auth } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: ""
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.users[user.id].patch(data, {
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      auth.setUser(data);
      
      toast({
        title: "Başarılı ✅",
        description: "Hesap bilgileriniz başarıyla güncellendi!",
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Bilgiler güncellenirken bir hata oluştu.";
      
      toast({
        title: "Hata ❌",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sadece değişen alanları gönder
    const updatedFields: any = {};
    if (formData.firstName !== user?.firstName) updatedFields.firstName = formData.firstName;
    if (formData.lastName !== user?.lastName) updatedFields.lastName = formData.lastName;
    
    if (Object.keys(updatedFields).length > 0) {
      updateMutation.mutate(updatedFields);
    } else {
      toast({
        title: "Bilgi ℹ️",
        description: "Herhangi bir değişiklik yapılmadı.",
      });
    }
  };

  const handleCancel = () => {
    // Form'u orijinal değerlere döndür
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: ""
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Hesap Bilgilerim</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              *Ad
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              placeholder="Berkan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              *Soyad
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
              placeholder="Saraç"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <select className="px-3 py-2 border border-gray-300 sm:rounded-l-md sm:rounded-r-none rounded-md bg-gray-50 text-sm sm:w-auto w-full">
                <option>🇹🇷 +90</option>
              </select>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 sm:rounded-r-md sm:rounded-l-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                placeholder="5XX XXX XX XX"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              *Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-sm md:text-base"
              disabled
              placeholder="hesabim@onjsjs.com"
            />
            <p className="mt-1 text-xs text-gray-500">Email adresi değiştirilemez</p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors order-2 sm:order-1 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium transition-colors order-1 sm:order-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {updateMutation.isPending && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            {updateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
} 