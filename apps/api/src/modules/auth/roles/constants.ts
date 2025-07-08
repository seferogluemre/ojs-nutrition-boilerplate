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
} as const satisfies Record<
  string,
  { key: string; description: string; permissions: Array<{ key: string; description: string }> }
>;
