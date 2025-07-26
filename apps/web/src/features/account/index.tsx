import { useAuthStore } from "#stores/authStore";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Account() {
  const { auth } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account-info");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug için auth durumunu kontrol et
  console.log("Auth state:", { user: auth.user, accessToken: !!auth.accessToken });

  // Auth kontrolü - kullanıcı login olmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!auth.user && !auth.accessToken) {
      console.log("No user or token, redirecting to sign-in");
      router.navigate({ to: "/sign-in" });
    }
  }, [auth.user, auth.accessToken, router]);

  // Kullanıcı login olmamışsa hiçbir şey render etme (token varsa bekle)
  if (!auth.user && !auth.accessToken) {
    return null;
  }

  // Token var ama user henüz gelmemişse loading göster
  if (!auth.user && auth.accessToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "account-info", label: "Hesap Bilgilerim", icon: "👤" },
    { id: "addresses", label: "Adreslerim", icon: "📍" },
    { id: "orders", label: "Siparişlerim", icon: "📦" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Tab Menu */}
              {isMobileMenuOpen && (
                <nav className="mt-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
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
              )}
            </div>

            {/* Desktop Tab Menüsü */}
            <div className="hidden lg:block w-80 bg-gray-50 border-r border-gray-200">
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

            {/* İçerik Alanı */}
            <div className="flex-1 p-4 md:p-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            *Ad
          </label>
          <input
            type="text"
            defaultValue={user.firstName || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
            placeholder="Saraç"
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
            defaultValue={user.email || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed text-sm md:text-base"
            disabled
            placeholder="hesabim@onjsjs.com"
          />
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-end gap-3">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors order-2 sm:order-1">
          İptal
        </button>
        <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium transition-colors order-1 sm:order-2">
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