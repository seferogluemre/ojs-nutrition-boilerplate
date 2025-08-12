import type { GenericPermissionObject, PermissionKey } from './types';

export const PERMISSIONS = {
  USERS: {
    SHOW: { key: 'users:show', description: 'Kullanıcıları Görüntüle' },
    UPDATE: { key: 'users:update', description: 'Kullanıcı Güncelle' },
    DESTROY: { key: 'users:destroy', description: 'Kullanıcı Sil' },
    CREATE: { key: 'users:create', description: 'Kullanıcı Oluştur' },
    BAN: { key: 'users:ban', description: 'Kullanıcıyı Yasağa Al' },
    UNBAN: { key: 'users:unban', description: 'Kullanıcıyı Yasağından Kaldır' },
    UPDATE_ROLES: { key: 'users:update-roles', description: 'Kullanıcı Rolü Güncelle' },
    UNLINK_USER: { key: 'users:unlink', description: 'Kullanıcıyı Bağlantıdan Kaldır' },
    LINK_USER: { key: 'users:link', description: 'Kullanıcıyı Bağla' },
    LIST_SESSIONS: { key: 'users:list-sessions', description: 'Oturumları Listele' },
    REVOKE_SESSIONS: { key: 'users:revoke-sessions', description: 'Oturumları İptal Et' },
    IMPERSONATE: { key: 'users:impersonate', description: 'Kullanıcıyı Taklit Et' },
  },
  USER_ADDRESSES: {
    INDEX: { key: 'user-addresses:index', description: 'Kullanıcı Adreslerini Görüntüle' },
    SHOW: { key: 'user-addresses:show', description: 'Kullanıcı Adresini Görüntüle' },
    CREATE: { key: 'user-addresses:create', description: 'Kullanıcı Adresi Oluştur' },
    UPDATE: { key: 'user-addresses:update', description: 'Kullanıcı Adresini Güncelle' },
    DESTROY: { key: 'user-addresses:destroy', description: 'Kullanıcı Adresini Sil' },
  },
  ROLES: {
    SHOW: { key: 'roles:show', description: 'Rolleri Görüntüle' },
    UPDATE: { key: 'roles:update', description: 'Rolleri Güncelle' },
  },
  SYSTEM_ADMINISTRATION: {
    SHOW_LOGS: { key: 'system-administration:show-logs', description: 'Logları Görüntüle' },
  },
  POSTS: {
    SHOW: { key: 'posts:show', description: 'Gönderileri Görüntüle' },
    CREATE: { key: 'posts:create', description: 'Gönderi Oluştur' },
    UPDATE: { key: 'posts:update', description: 'Gönderi Güncelle' },
    DESTROY: { key: 'posts:destroy', description: 'Gönderi Sil' },
  },
  FILE_LIBRARY_ASSETS: {
    INDEX: { key: 'file-library-assets:index', description: 'Dosyaları Görüntüle' },
    SHOW: { key: 'file-library-assets:show', description: 'Dosya Görüntüle' },
    CREATE: { key: 'file-library-assets:create', description: 'Dosya Oluştur' },
    UPDATE: { key: 'file-library-assets:update', description: 'Dosya Güncelle' },
    DESTROY: { key: 'file-library-assets:destroy', description: 'Dosya Sil' },
  },
  PRODUCTS: {
    INDEX: { key: 'products:index', description: 'Ürünleri Görüntüle' },
    SHOW: { key: 'products:show', description: 'Ürün Görüntüle' },
    CREATE: { key: 'products:create', description: 'Ürün Oluştur' },
    UPDATE: { key: 'products:update', description: 'Ürün Güncelle' },
    DESTROY: { key: 'products:destroy', description: 'Ürün Sil' },
  },
  PRODUCTS_COMMENTS: {
    INDEX: { key: 'products-comments:index', description: 'Ürün Yorumlarını Görüntüle' },
    CREATE: { key: 'products-comments:create', description: 'Ürün Yorumu Oluştur' },
  },
  PRODUCTS_VARIANTS: {
    INDEX: { key: 'products-variants:index', description: 'Ürün Varyantlarını Görüntüle' },
    CREATE: { key: 'products-variants:create', description: 'Ürün Varyantı Oluştur' },
    UPDATE: { key: 'products-variants:update', description: 'Ürün Varyantı Güncelle' },
    DESTROY: { key: 'products-variants:destroy', description: 'Ürün Varyantı Sil' },
  },
  CART: {
    INDEX: { key: 'cart:index', description: 'Sepeti Görüntüle' },
    CREATE: { key: 'cart:create', description: 'Sepete Ürün Ekle' },
    UPDATE: { key: 'cart:update', description: 'Sepeti Güncelle' },
    DESTROY: { key: 'cart:destroy', description: 'Sepeti Sil' },
  },
  CATEGORIES: {
    INDEX: { key: 'categories:index', description: 'Kategorileri Görüntüle' },
    CREATE: { key: 'categories:create', description: 'Kategori Oluştur' },
    UPDATE: { key: 'categories:update', description: 'Kategori Güncelle' },
    DESTROY: { key: 'categories:destroy', description: 'Kategori Sil' },
  },
  ORDERS: {
    INDEX: { key: 'orders:index', description: 'Siparişleri Görüntüle' },
    SHOW: { key: 'orders:show', description: 'Sipariş Görüntüle' },
    CREATE: { key: 'orders:create', description: 'Sipariş Oluştur' },
    UPDATE: { key: 'orders:update', description: 'Sipariş Güncelle' },
    DESTROY: { key: 'orders:destroy', description: 'Sipariş Sil' },
  },
  PARCELS: {
    INDEX: { key: 'parcels:index', description: 'Kargoları Görüntüle' },
    SHOW: { key: 'parcels:show', description: 'Kargo Görüntüle' },
    CREATE: { key: 'parcels:create', description: 'Kargo Oluştur' },
    UPDATE: { key: 'parcels:update', description: 'Kargo Güncelle' },
    UPDATE_STATUS: { key: 'parcels:update-status', description: 'Kargo Durumu Güncelle' },
    UPDATE_LOCATION: { key: 'parcels:update-location', description: 'Kargo Konumu Güncelle' },
    GENERATE_QR: { key: 'parcels:generate-qr', description: 'QR Kod Oluştur' },
    VALIDATE_QR: { key: 'parcels:validate-qr', description: 'QR Kod Doğrula' },
    TRACK: { key: 'parcels:track', description: 'Kargo Takip Et' },
    ASSIGN_COURIER: { key: 'parcels:assign-courier', description: 'Kurye Ata' },
  },
  COURIER: {
    VIEW_ASSIGNED_PARCELS: {
      key: 'courier:view-assigned-parcels',
      description: 'Atanan Kargoları Görüntüle',
    },
    UPDATE_LOCATION: { key: 'courier:update-location', description: 'Konum Güncelle' },
    SCAN_QR: { key: 'courier:scan-qr', description: 'QR Kod Tara' },
    SEND_QR_EMAIL: { key: 'courier:send-qr-email', description: 'QR Kod E-posta Gönder' },
    COMPLETE_DELIVERY: { key: 'courier:complete-delivery', description: 'Teslimat Tamamla' },
  },
} as const satisfies Record<string, Record<string, GenericPermissionObject>>;

export const PERMISSION_KEYS = [
  ...new Set(
    Object.values(PERMISSIONS)
      .flatMap((module) => Object.values(module))
      .flatMap((permission) => permission.key),
  ),
] as PermissionKey[];

export const PERMISSION_GROUPS = {
  USERS: {
    key: 'users',
    description: 'Kullanıcılar',
    permissions: Object.values(PERMISSIONS.USERS),
  },
  ROLES: {
    key: 'roles',
    description: 'Roller',
    permissions: Object.values(PERMISSIONS.ROLES),
  },
  SYSTEM_ADMINISTRATION: {
    key: 'system-administration',
    description: 'Sistem Yönetimi',
    permissions: Object.values(PERMISSIONS.SYSTEM_ADMINISTRATION),
  },
  POSTS: {
    key: 'posts',
    description: 'Gönderiler',
    permissions: Object.values(PERMISSIONS.POSTS),
  },
  PRODUCTS: {
    key: 'products',
    description: 'Ürünler',
    permissions: Object.values(PERMISSIONS.PRODUCTS),
  },
  PRODUCTS_COMMENTS: {
    key: 'products-comments',
    description: 'Ürün Yorumları',
    permissions: Object.values(PERMISSIONS.PRODUCTS_COMMENTS),
  },
  PRODUCTS_VARIANTS: {
    key: 'products-variants',
    description: 'Ürün Varyantları',
    permissions: Object.values(PERMISSIONS.PRODUCTS_VARIANTS),
  },
  CART: {
    key: 'cart',
    description: 'Sepet',
    permissions: Object.values(PERMISSIONS.CART),
  },
  CATEGORIES: {
    key: 'categories',
    description: 'Kategoriler',
    permissions: Object.values(PERMISSIONS.CATEGORIES),
  },
  ORDERS: {
    key: 'orders',
    description: 'Siparişler',
    permissions: Object.values(PERMISSIONS.ORDERS),
  },
  PARCELS: {
    key: 'parcels',
    description: 'Kargo Yönetimi',
    permissions: Object.values(PERMISSIONS.PARCELS),
  },
  COURIER: {
    key: 'courier',
    description: 'Kurye İşlemleri',
    permissions: Object.values(PERMISSIONS.COURIER),
  },
} as const satisfies Record<
  string,
  { key: string; description: string; permissions: Array<{ key: string; description: string }> }
>;

// Normal kullanıcı için izin listesi
export const USER_PERMISSIONS = [
  PERMISSIONS.USER_ADDRESSES.INDEX.key,
  PERMISSIONS.USER_ADDRESSES.SHOW.key,
  PERMISSIONS.USER_ADDRESSES.CREATE.key,
  PERMISSIONS.USER_ADDRESSES.UPDATE.key,
  PERMISSIONS.USER_ADDRESSES.DESTROY.key,

  // Sepet izinleri
  PERMISSIONS.CART.INDEX.key,
  PERMISSIONS.CART.CREATE.key,
  PERMISSIONS.CART.DESTROY.key,

  // Sipariş izinleri
  PERMISSIONS.ORDERS.INDEX.key,
  PERMISSIONS.ORDERS.SHOW.key,
  PERMISSIONS.ORDERS.CREATE.key,
  PERMISSIONS.ORDERS.UPDATE.key,
  PERMISSIONS.ORDERS.DESTROY.key,

  // Ürün izinleri (sadece görüntüleme)
  PERMISSIONS.PRODUCTS.INDEX.key,
  PERMISSIONS.PRODUCTS.SHOW.key,

  // Ürün yorumları (görüntüleme ve oluşturma)
  PERMISSIONS.PRODUCTS_COMMENTS.INDEX.key,
  PERMISSIONS.PRODUCTS_COMMENTS.CREATE.key,

  // Kategori izinleri (sadece görüntüleme)
  PERMISSIONS.CATEGORIES.INDEX.key,

  PERMISSIONS.COURIER.VIEW_ASSIGNED_PARCELS.key,
  PERMISSIONS.COURIER.UPDATE_LOCATION.key,
  PERMISSIONS.COURIER.SCAN_QR.key,
  PERMISSIONS.COURIER.SEND_QR_EMAIL.key,
  PERMISSIONS.COURIER.COMPLETE_DELIVERY.key,

  // Kargo ile ilgili temel izinler
  PERMISSIONS.PARCELS.SHOW.key,
  PERMISSIONS.PARCELS.UPDATE_STATUS.key,
  PERMISSIONS.PARCELS.UPDATE_LOCATION.key,
  PERMISSIONS.PARCELS.GENERATE_QR.key,
  PERMISSIONS.PARCELS.VALIDATE_QR.key,
  PERMISSIONS.PARCELS.TRACK.key,
] as const;
