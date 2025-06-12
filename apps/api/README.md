# 🚀 OnlyJS Nutrition API Backend

Bu proje **Bun.js** ve **ElysiaJS** framework'ü kullanılarak geliştirilmiş, **PostgreSQL** veritabanı ve **Prisma ORM** ile desteklenen bir beslenme API backend'idir.

## 📋 İçindekiler

- [Teknoloji Stack](#-teknoloji-stack)
- [Ön Gereksinimler](#-ön-gereksinimler)
- [Kurulum](#-kurulum)
- [Veritabanı Kurulumu](#-veritabanı-kurulumu)
- [Çalıştırma](#-çalıştırma)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Faydalı Komutlar](#-faydalı-komutlar)
- [Troubleshooting](#-troubleshooting)

## 🛠 Teknoloji Stack

- **Runtime**: [Bun.js](https://bun.sh/) v1.x
- **Framework**: [ElysiaJS](https://elysiajs.com/) v1.2.x
- **Veritabanı**: PostgreSQL 15+
- **ORM**: [Prisma](https://www.prisma.io/) v6.6.x
- **Kimlik Doğrulama**: [Better Auth](https://www.better-auth.com/)
- **Caching**: Redis (opsiyonel)
- **Email**: React Email + SMTP
- **Containerization**: Docker & Docker Compose

## 🔧 Ön Gereksinimler

Sisteminizde aşağıdaki araçların kurulu olması gerekmektedir:

- [Bun.js](https://bun.sh/docs/installation) v1.0.0+
- [Docker](https://www.docker.com/get-started/) v20.0+
- [Docker Compose](https://docs.docker.com/compose/) v2.0+
- [Git](https://git-scm.com/downloads)

### Bun.js Kurulumu

**Windows:**
```powershell
# PowerShell
irm bun.sh/install.ps1 | iex
```

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

## 🚀 Kurulum

### 1. Proje Klonlama

```bash
git clone <repository-url>
cd ojs-nutrition-boilerplate/apps/api
```

### 2. Bağımlılıkları Yükleme

```bash
bun install
```

### 3. Çevre Değişkenlerini Ayarlama

API konfigürasyonu için `.env` dosyası oluşturun:

```bash
# config/apps/api/.env dosyasını oluşturun
mkdir -p ../../config/apps/api
```

`config/apps/api/.env` dosyasına aşağıdaki içeriği ekleyin:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/onlyjs"

# Server
PORT=3000
NODE_ENV=development

# Auth
AUTH_SECRET="your-super-secret-auth-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-key-change-this-in-production"

# Redis (opsiyonel)
REDIS_URL="redis://localhost:6379"

# Email Configuration (opsiyonel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🗄️ Veritabanı Kurulumu

### 1. PostgreSQL Container'ını Başlatma

```bash
# Docker container'ını başlat
bun run db:start

# Logları takip etmek için
bun run db:logs
```

### 2. Prisma Setup

```bash
# Prisma client'ı generate et
bun run prisma:generate

# Veritabanı migration'larını çalıştır
bun run prisma:migrate

# Seed data'yı yükle (opsiyonel)
bun run prisma:seed
```

### 3. Veritabanı Studio (Opsiyonel)

Veritabanını görsel olarak yönetmek için Prisma Studio'yu başlatabilirsiniz:

```bash
bun run prisma:studio
```

Bu komut http://localhost:5555 adresinde Prisma Studio'yu açacaktır.

## ▶️ Çalıştırma

### Development Modu

```bash
# API sunucusunu development modunda başlat
bun run serve

# Veya root dizinden tüm projeyi başlat
cd ../../
bun run dev
```

API sunucusu şu adreste çalışacaktır: **http://localhost:3000**

### Production Build

```bash
# Production build
bun run build

# Production modunda çalıştır
bun run start
```

## 📚 API Dokümantasyonu

Development modunda çalışırken, Swagger dokümantasyonuna şu adresten erişebilirsiniz:

**🔗 http://localhost:3000/swagger**

## 📁 Proje Yapısı

```
apps/api/
├── src/
│   ├── config/           # Konfigürasyon dosyaları
│   ├── modules/          # API modülleri/route'ları
│   ├── emails/           # Email template'leri
│   └── index.ts          # Ana sunucu dosyası
├── prisma/
│   ├── schema.prisma     # Veritabanı şeması
│   ├── migrations/       # Veritabanı migration'ları
│   ├── seeders/          # Seed data dosyaları
│   └── seed.ts           # Ana seed script
├── public/               # Statik dosyalar
├── docker-compose.yml    # PostgreSQL container config
├── package.json          # Proje bağımlılıkları
└── README.md            # Bu dosya
```

## 🔧 Faydalı Komutlar

### Geliştirme Komutları

```bash
# API'yi development modunda çalıştır
bun run serve

# Veritabanı container'ını başlat
bun run db:start

# Veritabanı container'ını durdur
bun run db:stop

# Container loglarını görüntüle
bun run db:logs

# Tüm veritabanı setup'ını yap
bun run db:init
```

### Prisma Komutları

```bash
# Prisma client'ı generate et
bun run prisma:generate

# Yeni migration oluştur
bun run prisma:migrate

# Prisma Studio'yu aç
bun run prisma:studio

# Seed data'yı çalıştır
bun run prisma:seed

# Schema'yı formatla
bun run prisma:format
```

### Build Komutları

```bash
# Production build
bun run build

# Production modunda çalıştır
bun run start

# Email preview sunucusunu başlat
bun run emails:preview
```

### Code Quality

```bash
# Linting kontrolü
bun run knip
```

## 🐛 Troubleshooting

### Sık Karşılaşılan Hatalar

#### 1. `Cannot find module '#prisma/client'`

**Çözüm:**
```bash
bun run prisma:generate
```

#### 2. `[MISSING_ENV_FILE] missing ../../config/apps/api/.env file`

**Çözüm:**
`config/apps/api/.env` dosyasını oluşturun ve gerekli çevre değişkenlerini ekleyin.

#### 3. Database Connection Error

**Çözüm:**
```bash
# PostgreSQL container'ının çalıştığından emin olun
bun run db:start

# Connection string'i kontrol edin
echo $DATABASE_URL
```

#### 4. Port Already in Use (Port 3000 kullanımda)

**Çözüm:**
```bash
# Farklı port kullanın
PORT=3001 bun run serve

# Veya .env dosyasında PORT değişkenini değiştirin
```

### Log Kontrolü

```bash
# PostgreSQL container logları
bun run db:logs

# API server logları console'da görünecektir
```

### Veritabanını Sıfırlama

```bash
# Container'ı durdur ve sil
bun run db:stop
docker volume rm api_postgres_data

# Tekrar başlat ve setup yap
bun run db:init
```

## 🔒 Güvenlik Notları

- Production ortamında `.env` dosyasındaki secret key'leri mutlaka değiştirin
- `AUTH_SECRET` ve `JWT_SECRET` değerlerini güçlü rastgele string'ler kullanın
- Database şifresini güçlü bir şifre ile değiştirin
- Production'da HTTPS kullandığınızdan emin olun

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 License

Bu proje MIT lisansı altında lisanslanmıştır.

---

**🎉 Backend başarıyla ayağa kalktı! Happy coding!** 