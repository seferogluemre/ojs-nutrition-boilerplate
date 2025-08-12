import { prisma } from '#core';
import { BadRequestException, NotFoundException } from '../../utils';
import { RouteOptimizationService } from './route-optimization';

interface GPSCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

interface LocationData {
  coordinates: GPSCoordinates;
  address?: string;
  city?: string;
  deviceInfo?: any;
}

export class LocationService {
  static async autoDetectAndLogLocation(parcelId: number, locationData: LocationData, courierId: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: {
        courier: true,
        order: { include: { user: true } }
      }
    });

    if (!parcel) {
      throw new NotFoundException('Kargo bulunamadı');
    }

    if (parcel.courierId !== courierId) {
      throw new BadRequestException('Bu kargo size atanmamış');
    }

    const validatedCoords = this.validateGPSCoordinates(locationData.coordinates);
    
    const detectedCity = await this.detectCityFromLocation(locationData);
    
    const courierLocation = await prisma.courierLocation.create({
      data: {
        courierId,
        parcelId,
        latitude: validatedCoords.lat,
        longitude: validatedCoords.lng,
        accuracy: validatedCoords.accuracy,
        address: locationData.address,
        city: detectedCity,
        deviceInfo: locationData.deviceInfo
      }
    });

    const eventDescription = this.generateLocationDescription(detectedCity, parcel.courier?.firstName);
    
    await this.createLocationEvent(parcelId, {
      eventType: 'LOCATION_UPDATE',
      description: eventDescription,
      location: detectedCity,
      coordinates: validatedCoords,
      courierId,
      metadata: {
        autoDetected: true,
        accuracy: validatedCoords.accuracy,
        address: locationData.address,
        timestamp: new Date().toISOString()
      }
    });

    await this.updateRouteProgress(parcel, detectedCity);

    return {
      success: true,
      location: {
        uuid: courierLocation.uuid,
        coordinates: {
          lat: Number(courierLocation.latitude),
          lng: Number(courierLocation.longitude),
          accuracy: courierLocation.accuracy
        },
        detectedCity,
        address: courierLocation.address,
        timestamp: courierLocation.createdAt
      },
      event: {
        description: eventDescription,
        location: detectedCity
      },
      message: 'Konum başarıyla tespit edildi ve log eklendi'
    };
  }

  static validateGPSCoordinates(coords: GPSCoordinates): GPSCoordinates {
    const { lat, lng, accuracy } = coords;

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Geçersiz latitude değeri');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Geçersiz longitude değeri');
    }

    if (lat < 35.8 || lat > 42.1 || lng < 25.7 || lng > 44.8) {
      console.warn('⚠️ Koordinat Türkiye sınırları dışında:', { lat, lng });
    }

    if (accuracy && (accuracy < 0 || accuracy > 10000)) {
      console.warn('⚠️ Şüpheli GPS accuracy değeri:', accuracy);
    }

    return {
      lat: Number(lat.toFixed(6)), // 6 ondalık yeterli
      lng: Number(lng.toFixed(6)),
      accuracy: accuracy ? Number(accuracy.toFixed(2)) : undefined
    };
  }

  static async detectCityFromLocation(locationData: LocationData): Promise<string> {
    if (locationData.address) {
      const cityFromAddress = this.extractCityFromAddress(locationData.address);
      if (cityFromAddress) {
        return cityFromAddress;
      }
    }

    if (locationData.city) {
      return locationData.city;
    }

    const cityFromGPS = await this.reverseGeocode(locationData.coordinates);
    if (cityFromGPS) {
      return cityFromGPS;
    }

    return 'Bilinmeyen Konum';
  }

  private static extractCityFromAddress(address: string): string | null {
    if (!address) return null;

    const turkishCities = [
      'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Diyarbakır',
      'Kayseri', 'Eskişehir', 'Urfa', 'Malatya', 'Trabzon', 'Balıkesir', 'Kahramanmaraş', 'Van', 'Aydın', 'Denizli',
      'Sakarya', 'Kocaeli', 'Muğla', 'Tekirdağ', 'Sivas', 'Manisa', 'Tokat', 'Elazığ', 'Zonguldak', 'Çorum',
      'Rize', 'Ordu', 'Giresun', 'Samsun', 'Artvin', 'Gümüşhane', 'Trabzon', 'Erzurum', 'Kars', 'Ağrı'
    ];

    for (const city of turkishCities) {
      const regex = new RegExp(city, 'gi');
      if (regex.test(address)) {
        return city;
      }
    }

    return null;
  }

  private static async reverseGeocode(coords: GPSCoordinates): Promise<string | null> {
    try {
      const { lat, lng } = coords;
      if (lat >= 40.8 && lat <= 41.4 && lng >= 28.5 && lng <= 29.3) {
        return 'İstanbul';
      }

      if (lat >= 39.7 && lat <= 40.1 && lng >= 32.4 && lng <= 33.0) {
        return 'Ankara';
      }

      if (lat >= 38.2 && lat <= 38.6 && lng >= 26.8 && lng <= 27.3) {
        return 'İzmir';
      }

      if (lat >= 40.5 && lat <= 41.5 && lng >= 35.0 && lng <= 42.0) {
        if (lng >= 40.0) return 'Rize';
        if (lng >= 39.0) return 'Trabzon';
        if (lng >= 37.0) return 'Ordu';
        if (lng >= 35.0) return 'Samsun';
      }

      if (lat >= 38.5 && lat <= 40.5 && lng >= 38.0 && lng <= 42.0) {
        if (lng >= 40.5) return 'Erzurum';
        if (lng >= 39.0) return 'Elazığ';
      }
      // TODO: Daha detaylı koordinat tablosu eklenebilir
      // Veya Google Maps/OpenStreetMap API kullanılabilir

      return null;
    } catch (error) {
      console.error('Reverse geocoding hatası:', error);
      return null;
    }
  }

  private static generateLocationDescription(city: string, courierName?: string): string {
    const courier = courierName ? `${courierName} ******` : 'Kuryemiz';

    if (city === 'Bilinmeyen Konum') {
      return `${courier} konumu güncellendi`;
    }

    return `${courier} ${city} bölgesinde bulunuyor`;
  }

  private static async createLocationEvent(
    parcelId: number,
    data: {
      eventType: string;
      description: string;
      location?: string;
      coordinates?: GPSCoordinates;
      courierId: string;
      metadata?: any;
    }
  ) {
    await prisma.parcelEvent.create({
      data: {
        parcelId,
        eventType: data.eventType,
        description: data.description,
        location: data.location,
        coordinates: data.coordinates,
        courierId: data.courierId,
        metadata: data.metadata,
      }
    });
  }

  private static async updateRouteProgress(parcel: any, currentCity: string) {  
    try {
      const route = parcel.route as any;
      
      if (!route || !route.cities) {
        console.log('ℹ️ Parcel route bilgisi bulunamadı');
        return;
      }

      const cityIndex = route.cities.findIndex((city: string) => 
        RouteOptimizationService.findCityRegion(city)?.regionKey === 
        RouteOptimizationService.findCityRegion(currentCity)?.regionKey
      );

      if (cityIndex > -1 && cityIndex !== route.currentCityIndex) {
        await prisma.parcel.update({
          where: { id: parcel.id },
          data: {
            route: {
              ...route,
              currentCityIndex: cityIndex,
              lastUpdated: new Date().toISOString()
            }
          }
        });

        console.log(`📍 Route progress güncellendi: ${currentCity} (${cityIndex + 1}/${route.cities.length})`);
      }
    } catch (error) {
      console.error('Route progress güncelleme hatası:', error);
    }
  }

  static async getCourierLastLocation(courierId: string, parcelId?: number) {
    const where: any = { courierId };
    if (parcelId) {
      where.parcelId = parcelId;
    }

    const lastLocation = await prisma.courierLocation.findFirst({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        parcel: {
          select: {
            trackingNumber: true,
            status: true
          }
        }
      }
    });

    if (!lastLocation) {
      return null;
    }

    return {
      uuid: lastLocation.uuid,
      coordinates: {
        lat: Number(lastLocation.latitude),
        lng: Number(lastLocation.longitude),
        accuracy: lastLocation.accuracy
      },
      address: lastLocation.address,
      city: lastLocation.city,
      parcel: lastLocation.parcel,
      timestamp: lastLocation.createdAt
    };
  }
}
