import { useAuthStore } from "#stores/authStore.js";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccountInfoTab, AddressesTab, OrdersTab } from "./components/tabs";

export function Account() {
  const  auth  = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account-info");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!auth.user && !auth.accessToken) {
      router.navigate({ to: "/login" });
    }
  }, [auth.user, auth.accessToken, router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('orders') === 'true') {
      setActiveTab('orders');
    }
  }, []);

  if (!auth.user && !auth.accessToken) {
    return null;
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden border-b border-gray-200 dark:border-neutral-800 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Hesabım</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
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
                          ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
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
            <div className="hidden lg:block w-80 bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Hesabım</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
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