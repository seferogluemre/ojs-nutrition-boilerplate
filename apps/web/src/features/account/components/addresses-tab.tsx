export function AddressesTab() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Adreslerim</h3>
      
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz adresiniz yok</h4>
        <p className="text-gray-600 mb-6">
          Hızlı teslimat için teslimat adreslerinizi ekleyin
        </p>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
          İlk Adresi Ekle
        </button>
      </div>
    </div>
  );
} 