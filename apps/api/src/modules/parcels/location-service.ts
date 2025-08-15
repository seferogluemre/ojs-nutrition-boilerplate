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

interface OpenCageResponse {
  results: Array<{
    components: {
      _normalized_city?: string;
      _type?: string;
      continent?: string;
      country?: string;
      country_code?: string;
      county?: string;
      province?: string;
      region?: string;
      road?: string;
      road_type?: string;
      state?: string;
      village?: string;
    };
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
  status: {
    code: number;
    message: string;
  };
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
    
    const detailedLocation = await this.getLocationFromOpenCage(validatedCoords);
    const detectedCity = detailedLocation?.city || detailedLocation?.village || detailedLocation?.county || 'Bilinmeyen Konum';
    
    const courierLocation = await prisma.courierLocation.create({
      data: {
        courierId,
        parcelId,
        latitude: validatedCoords.lat,
        longitude: validatedCoords.lng,
        accuracy: validatedCoords.accuracy,
        address: detailedLocation?.formattedAddress || locationData.address,
        city: detectedCity,
        deviceInfo: locationData.deviceInfo
      }
    });

    const eventDescription = this.generateLocationDescription(detectedCity, parcel.courier?.firstName, detailedLocation);
    
    await this.createLocationEvent(parcelId, {
      eventType: 'LOCATION_UPDATE',
      description: eventDescription,
      location: detailedLocation?.formattedAddress || detectedCity,
      coordinates: validatedCoords,
      courierId,
      metadata: {
        autoDetected: true,
        accuracy: validatedCoords.accuracy,
        detailedLocation,
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
        detectedLocation: {
          country: detailedLocation?.country || '',
          province: detailedLocation?.province || '',
          county: detailedLocation?.county || '',
          village: detailedLocation?.village || '',
          city: detailedLocation?.city || '',
          road: detailedLocation?.road || '',
          formattedAddress: detailedLocation?.formattedAddress || ''
        },
        timestamp: courierLocation.createdAt.toISOString()
      },
      event: {
        description: eventDescription,
        location: detailedLocation?.formattedAddress || detectedCity
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
      lat: Number(lat.toFixed(6)),
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
      const locationInfo = await this.getLocationFromOpenCage(coords);
      if (locationInfo) {
        const { county, village, city } = locationInfo;
        return city || village || county || 'Bilinmeyen Konum';
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding hatası:', error);
      return null;
    }
  }

  static async getLocationFromOpenCage(coords: GPSCoordinates) {
    try {
      const { lat, lng } = coords;
      const apiKey = '416fc3eda9674c9183d0902d1dac1e82'; 
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=tr&pretty=1`;
      
      const response = await fetch(url);
      const data: OpenCageResponse = await response.json();
      
      if (data.status.code === 200 && data.results.length > 0) {
        const result = data.results[0];
        const components = result.components;
        
        return {
          country: components.country || '',
          province: components.province || components.state || '',
          county: components.county || '',
          village: components.village || components._normalized_city || '',
          city: components._normalized_city || '',
          road: components.road || '',
          formattedAddress: result.formatted,
          coordinates: result.geometry
        };
      }
      
      return null;
    } catch (error) {
      console.error('OpenCage API hatası:', error);
      return null;
    }
  }

  private static generateLocationDescription(city: string, courierName?: string, detailedLocation?: any): string {
    let courier = 'Kuryemiz';
    if (courierName) {
      const nameParts = courierName.split(' ').filter(part => part && part.trim() !== '');
      if (nameParts.length >= 2) {
        courier = `${nameParts[0]} ${nameParts[1].charAt(0)}${'*'.repeat(5)}`;
      } else if (nameParts.length === 1) {
        courier = `${nameParts[0]} ${'*'.repeat(6)}`;
      }
    }

    if (city === 'Bilinmeyen Konum') {
      return `${courier} konumu güncellendi`;
    }

    if (detailedLocation) {
      const { county, village, city: detectedCity } = detailedLocation;
      
      if (county && village) {
        const normalizedCounty = county.toLowerCase().replace(/\s+/g, '');
        const normalizedVillage = village.toLowerCase().replace(/\s+/g, '');
        const normalizedCity = detectedCity?.toLowerCase().replace(/\s+/g, '');
        
        if (normalizedCounty.includes(normalizedVillage) || normalizedVillage.includes(normalizedCounty)) {
          return `${courier} ${county}'ye ulaştı`;
        } else {
          return `${courier} ${county} ${village}'ye ulaştı`;
        }
      } else if (county) {
        return `${courier} ${county}'ye ulaştı`;
      } else if (village) {
        return `${courier} ${village}'ye ulaştı`;
      }
    }

    return `${courier} ${city} bölgesinde bulunuyor`;
  }

  static generateDeliveryStatusDescription(courierName?: string, location?: any): string {
    let courier = 'Kuryemiz';
    if (courierName) {
      const nameParts = courierName.split(' ').filter(part => part && part.trim() !== '');
      if (nameParts.length >= 2) {
        courier = `${nameParts[0]} ${nameParts[1].charAt(0)}${'*'.repeat(5)}`;
      } else if (nameParts.length === 1) {
        courier = `${nameParts[0]} ${'*'.repeat(6)}`;
      }
    }
    
    if (location?.county) {
      return `${courier} ${location.county}'de dağıtıma çıkmıştır`;
    }
    
    return `${courier} dağıtıma çıkmıştır`;
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
        console.warn('ℹ️ Parcel route bilgisi bulunamadı');
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

        console.warn(`📍 Route progress güncellendi: ${currentCity} (${cityIndex + 1}/${route.cities.length})`);
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