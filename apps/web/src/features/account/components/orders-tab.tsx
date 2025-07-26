export function OrdersTab() {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Siparişlerim</h3>
      
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        
        <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h4>
        <p className="text-gray-600 mb-6">
          Verdiğiniz siparişler burada görünecek
        </p>
        
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Alışverişe Başla
        </button>
      </div>
    </div>
  );
} 