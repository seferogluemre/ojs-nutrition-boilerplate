interface RegionInfo {
  name: string;
  cities: string[];
  coordinates: { lat: number; lng: number };
  routeOrder: number;
}

interface OptimizedRoute {
  cities: string[];
  regions: string[];
  isOptimized: boolean;
  generatedAt: Date;
  totalDistance?: number;
  estimatedDuration?: number;
}

export const TURKEY_REGIONS: Record<string, RegionInfo> = {
  MARMARA: {
    name: 'Marmara',
    cities: ['İstanbul', 'Bursa', 'Kocaeli', 'Sakarya', 'Yalova', 'Kırklareli', 'Edirne', 'Tekirdağ', 'Çanakkale', 'Balıkesir', 'Bilecik'],
    coordinates: { lat: 40.7769, lng: 29.0834 },
    routeOrder: 1
  },
  KARADENIZ: {
    name: 'Karadeniz',
    cities: ['Zonguldak', 'Kastamonu', 'Sinop', 'Samsun', 'Amasya', 'Tokat', 'Ordu', 'Giresun', 'Trabzon', 'Rize', 'Artvin', 'Gümüşhane', 'Bayburt'],
    coordinates: { lat: 41.0015, lng: 35.3289 },
    routeOrder: 2
  },
  IC_ANADOLU: {
    name: 'İç Anadolu',
    cities: ['Ankara', 'Konya', 'Kayseri', 'Sivas', 'Yozgat', 'Kırıkkale', 'Aksaray', 'Niğde', 'Nevşehir', 'Kırşehir', 'Çankırı', 'Karaman'],
    coordinates: { lat: 39.9208, lng: 32.8541 },
    routeOrder: 3
  },
  EGE: {
    name: 'Ege',
    cities: ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Uşak', 'Kütahya', 'Afyonkarahisar'],
    coordinates: { lat: 38.4127, lng: 27.1384 },
    routeOrder: 4
  },
  AKDENIZ: {
    name: 'Akdeniz',
    cities: ['Antalya', 'Mersin', 'Adana', 'Hatay', 'Kahramanmaraş', 'Osmaniye', 'Isparta', 'Burdur'],
    coordinates: { lat: 36.5201, lng: 31.3343 },
    routeOrder: 5
  },
  DOGU_ANADOLU: {
    name: 'Doğu Anadolu',
    cities: ['Erzurum', 'Erzincan', 'Kars', 'Ağrı', 'Iğdır', 'Ardahan', 'Malatya', 'Elazığ', 'Tunceli', 'Bingöl', 'Muş', 'Bitlis', 'Van', 'Hakkari'],
    coordinates: { lat: 39.9553, lng: 41.2678 },
    routeOrder: 6
  },
  GUNEYDOGU_ANADOLU: {
    name: 'Güneydoğu Anadolu',
    cities: ['Gaziantep', 'Şanlıurfa', 'Diyarbakır', 'Mardin', 'Batman', 'Şırnak', 'Siirt', 'Kilis', 'Adıyaman'],
    coordinates: { lat: 37.3781, lng: 38.7854 },
    routeOrder: 7
  }
};

const REGION_TRANSITIONS: Record<string, Record<string, string[]>> = {
  MARMARA: {
    KARADENIZ: ['Zonguldak'],
    IC_ANADOLU: ['Eskişehir', 'Ankara'],
    EGE: ['Balıkesir'],
    AKDENIZ: ['Eskişehir', 'Konya'],
    DOGU_ANADOLU: ['Ankara', 'Kayseri'],
    GUNEYDOGU_ANADOLU: ['Ankara', 'Adana']
  },
  KARADENIZ: {
    IC_ANADOLU: ['Kastamonu', 'Çankırı'],
    DOGU_ANADOLU: ['Gümüşhane', 'Erzurum'],
    GUNEYDOGU_ANADOLU: ['Sivas', 'Malatya']
  },
  IC_ANADOLU: {
    EGE: ['Afyonkarahisar'],
    AKDENIZ: ['Konya'],
    DOGU_ANADOLU: ['Kayseri', 'Sivas'],
    GUNEYDOGU_ANADOLU: ['Kayseri', 'Malatya']
  },
  EGE: {
    AKDENIZ: ['Denizli'],
    DOGU_ANADOLU: ['Afyonkarahisar', 'Konya'],
    GUNEYDOGU_ANADOLU: ['Denizli', 'Konya']
  },
  AKDENIZ: {
    DOGU_ANADOLU: ['Adana', 'Malatya'],
    GUNEYDOGU_ANADOLU: ['Adana']
  },
  DOGU_ANADOLU: {
    GUNEYDOGU_ANADOLU: ['Malatya', 'Diyarbakır']
  }
};

export class RouteOptimizationService {
  static findCityRegion(cityName: string): { regionKey: string; region: RegionInfo } | null {
    const normalizedCity = this.normalizeCityName(cityName);
    
    for (const [regionKey, region] of Object.entries(TURKEY_REGIONS)) {
      const normalizedCities = region.cities.map(city => this.normalizeCityName(city));
      if (normalizedCities.includes(normalizedCity)) {
        return { regionKey, region };
      }
    }
    
    return null;
  }
    
  private static normalizeCityName(cityName: string): string {
    return cityName
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
  }

  /**
   * Adres objesinden şehir adını çıkarır
   */
  static extractCityFromAddress(shippingAddress: any): string | null {
    if (!shippingAddress) return null;
    
    // Farklı format olasılıkları
    if (typeof shippingAddress === 'string') {
      // JSON string ise parse et
      try {
        const parsed = JSON.parse(shippingAddress);
        return parsed.city || parsed.il || parsed.sehir || null;
      } catch {
        return null;
      }
    }
    
    // Object ise direkt oku
    if (typeof shippingAddress === 'object') {
      return shippingAddress.city || shippingAddress.il || shippingAddress.sehir || null;
    }
    
    return null;
  }

  /**
   * Verilen şehirler listesini coğrafi optimizasyon ile sıralar
   */
  static generateOptimalRoute(destinationCities: string[]): OptimizedRoute {
    if (destinationCities.length === 0) {
      return {
        cities: ['İstanbul'],
        regions: ['MARMARA'],
        isOptimized: true,
        generatedAt: new Date()
      };
    }

    // 1. Şehirleri bölgelere grupla
    const regionGroups: Record<string, string[]> = {};
    const unrecognizedCities: string[] = [];

    destinationCities.forEach(city => {
      const regionInfo = this.findCityRegion(city);
      if (regionInfo) {
        if (!regionGroups[regionInfo.regionKey]) {
          regionGroups[regionInfo.regionKey] = [];
        }
        regionGroups[regionInfo.regionKey].push(city);
      } else {
        unrecognizedCities.push(city);
      }
    });

    // 2. Bölgeleri routeOrder'a göre sırala
    const sortedRegions = Object.keys(regionGroups).sort((a, b) => {
      return TURKEY_REGIONS[a].routeOrder - TURKEY_REGIONS[b].routeOrder;
    });

    // 3. Rota oluştur
    const finalRoute: string[] = ['İstanbul']; // Her zaman İstanbul'dan başla
    const usedRegions: string[] = ['MARMARA'];

    let currentRegion = 'MARMARA';

    for (const targetRegion of sortedRegions) {
      // Ara geçiş şehirlerini ekle
      const transitionCities = this.getTransitionCities(currentRegion, targetRegion);
      finalRoute.push(...transitionCities);

      // Hedef bölgedeki şehirleri ekle (alfabetik sıralı)
      const regionCities = regionGroups[targetRegion].sort();
      finalRoute.push(...regionCities);

      if (!usedRegions.includes(targetRegion)) {
        usedRegions.push(targetRegion);
      }
      currentRegion = targetRegion;
    }

    // 4. Tanınmayan şehirleri sona ekle
    if (unrecognizedCities.length > 0) {
      finalRoute.push(...unrecognizedCities.sort());
    }

    // 5. Duplikasyonları temizle ama sırayı koru
    const uniqueRoute = this.removeDuplicatesKeepOrder(finalRoute);

    // 6. Mesafe ve süre tahmini (basit hesaplama)
    const totalDistance = this.estimateDistance(usedRegions);
    const estimatedDuration = this.estimateDuration(totalDistance);

    return {
      cities: uniqueRoute,
      regions: usedRegions,
      isOptimized: true,
      generatedAt: new Date(),
      totalDistance,
      estimatedDuration
    };
  }

  /**
   * İki bölge arasındaki geçiş şehirlerini bulur
   */
  private static getTransitionCities(fromRegion: string, toRegion: string): string[] {
    if (fromRegion === toRegion) return [];
    
    // Direkt geçiş var mı?
    const directTransition = REGION_TRANSITIONS[fromRegion]?.[toRegion];
    if (directTransition) {
      return directTransition;
    }

    // Ters yönde geçiş var mı?
    const reverseTransition = REGION_TRANSITIONS[toRegion]?.[fromRegion];
    if (reverseTransition) {
      return reverseTransition;
    }

    // Ara bölge üzerinden geçiş gerekli mi? (basit mantık)
    if (fromRegion === 'MARMARA' && ['DOGU_ANADOLU', 'GUNEYDOGU_ANADOLU'].includes(toRegion)) {
      return ['Ankara']; // İç Anadolu üzerinden
    }

    return []; // Direkt geçiş
  }

  /**
   * Array'den duplikasyonları kaldırır ama sırayı korur
   */
  private static removeDuplicatesKeepOrder(arr: string[]): string[] {
    const seen = new Set<string>();
    return arr.filter(item => {
      if (seen.has(item)) {
        return false;
      }
      seen.add(item);
      return true;
    });
  }

  /**
   * Bölgeler bazında basit mesafe tahmini (km)
   */
  private static estimateDistance(regions: string[]): number {
    const baseDistance = 500; // İstanbul'dan ilk bölgeye
    const interRegionDistance = 300; // Bölgeler arası ortalama
    
    return baseDistance + (regions.length - 1) * interRegionDistance;
  }

  /**
   * Mesafeye göre süre tahmini (saat)
   */
  private static estimateDuration(distance: number): number {
    const averageSpeed = 80; // km/h ortalama hız
    const restTime = 2; // dinlenme/yükleme süresi
    
    return Math.ceil(distance / averageSpeed) + restTime;
  }

  /**
   * Debug için rota bilgilerini yazdır
   */
  static debugRoute(route: OptimizedRoute): void {
    console.log('🗺️ Optimized Route Debug:', {
      cities: route.cities,
      regions: route.regions,
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      generatedAt: route.generatedAt
    });
  }
}
