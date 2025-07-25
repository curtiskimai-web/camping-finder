// 캠핑장 기본 정보 타입
export interface CampingSpot {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  price: {
    type: 'free' | 'paid';
    amount?: number;
  };
  reservation: {
    available: boolean;
    method: string;
  };
  images: string[];
  description: string;
  operatingHours: string;
  lastUpdated: Date;
}

// 검색 필터 타입
export interface SearchFilter {
  region: {
    province: string;
    city: string;
  };
  facilities: string[];
  priceRange: 'all' | 'free' | 'paid';
  reservationAvailable: boolean;
  keyword: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 지역 정보 타입
export interface Region {
  province: string;
  cities: string[];
}

// 시설 정보 타입
export interface Facility {
  id: string;
  name: string;
  icon: string;
  description: string;
} 