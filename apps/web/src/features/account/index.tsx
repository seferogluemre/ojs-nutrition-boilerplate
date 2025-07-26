import { useAuthStore } from "#stores/authStore";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Account() {
  const { auth } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account-info");

  // Auth kontrolü - kullanıcı login olmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!auth.user) {
      router.navigate({ to: "/sign-in" });
    }
  }, [auth.user, router]);

  // Kullanıcı login olmamışsa hiçbir şey render etme
  if (!auth.user) {
    return null;
  }

  const tabs = [
    { id: "account-info", label: "Hesap Bilgilerim", icon: "👤" },
    { id: "addresses", label: "Adreslerim", icon: "📍" },
    { id: "orders", label: "Siparişlerim", icon: "📦" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex">
            {/* Sol Taraf - Tab Menüsü */}
            <div className="w-80 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Hesabım</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Sağ Taraf - İçerik Alanı */}
            <div className="flex-1 p-6">
              {activeTab === "account-info" && <AccountInfoTab user={auth.user} />}
              {activeTab === "addresses" && <AddressesTab />}
              {activeTab === "orders" && <OrdersTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hesap Bilgilerim Tab Component
function AccountInfoTab({ user }: { user: any }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Hesap Bilgilerim</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            *Ad
          </label>
          <input
            type="text"
            defaultValue={user.firstName || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Berkan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            *Soyad
          </label>
          <input
            type="text"
            defaultValue={user.lastName || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Saraç"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon
          </label>
          <div className="flex">
            <select className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm">
              <option>🇹🇷 +90</option>
            </select>
            <input
              type="tel"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            defaultValue={user.email || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            disabled
            placeholder="hesabim@onjsjs.com"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Kaydet
        </button>
      </div>
    </div>
  );
}

// Placeholder componentler diğer tab'lar için
function AddressesTab() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Adreslerim</h3>
      <p className="text-gray-600">Adres yönetimi yakında eklenecek...</p>
    </div>
  );
}

function OrdersTab() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Siparişlerim</h3>
      <p className="text-gray-600">Sipariş geçmişi yakında eklenecek...</p>
    </div>
  );
}