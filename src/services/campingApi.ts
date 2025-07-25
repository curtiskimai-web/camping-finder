import { CampingSpot, SearchFilter, ApiResponse } from '../types/camping';

// 공공데이터 포털 API 설정
const API_BASE_URL = 'http://apis.data.go.kr/B551011/GoCamping';
const API_KEY = process.env.VITE_CAMPING_API_KEY || 'YOUR_API_KEY_HERE';

class CampingApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  // 캠핑장 목록 조회
  async getCampingSpots(filter?: SearchFilter): Promise<CampingSpot[]> {
    try {
      const params = new URLSearchParams({
        serviceKey: this.apiKey,
        numOfRows: '100',
        pageNo: '1',
        MobileOS: 'ETC',
        MobileApp: 'CampingFinder',
        _type: 'json'
      });

      if (filter?.region.province) {
        params.append('doNm', filter.region.province);
      }
      if (filter?.region.city) {
        params.append('sigunguNm', filter.region.city);
      }
      if (filter?.keyword) {
        params.append('facltNm', filter.keyword);
      }

      const response = await fetch(`${this.baseUrl}/basedList?${params}`);
      const data = await response.json();

      if (data.response?.header?.resultCode === '00') {
        return this.transformCampingData(data.response.body.items.item);
      } else {
        throw new Error('API 호출 실패');
      }
    } catch (error) {
      console.error('캠핑장 목록 조회 실패:', error);
      return this.getMockData(); // 개발용 목 데이터
    }
  }

  // 캠핑장 상세 정보 조회
  async getCampingSpotDetail(contentId: string): Promise<CampingSpot | null> {
    try {
      const params = new URLSearchParams({
        serviceKey: this.apiKey,
        contentId: contentId,
        MobileOS: 'ETC',
        MobileApp: 'CampingFinder',
        _type: 'json'
      });

      const response = await fetch(`${this.baseUrl}/detailList?${params}`);
      const data = await response.json();

      if (data.response?.header?.resultCode === '00') {
        const items = data.response.body.items.item;
        return items ? this.transformCampingData([items])[0] : null;
      } else {
        throw new Error('API 호출 실패');
      }
    } catch (error) {
      console.error('캠핑장 상세 정보 조회 실패:', error);
      return null;
    }
  }

  // API 데이터를 내부 타입으로 변환
  private transformCampingData(items: any[]): CampingSpot[] {
    return items.map(item => ({
      id: item.contentId || String(Math.random()),
      name: item.facltNm || '캠핑장',
      address: item.addr1 || '',
      phone: item.tel || '',
      latitude: parseFloat(item.mapY) || 0,
      longitude: parseFloat(item.mapX) || 0,
      facilities: this.parseFacilities(item.sbrsCltr || ''),
      price: {
        type: item.chrgeInfo === '무료' ? 'free' : 'paid',
        amount: item.chrgeInfo ? parseInt(item.chrgeInfo.replace(/[^0-9]/g, '')) : undefined
      },
      reservation: {
        available: item.resveUrl ? true : false,
        method: item.resveUrl || '예약 불가'
      },
      images: item.firstImageUrl ? [item.firstImageUrl] : [],
      description: item.intro || '',
      operatingHours: item.operDeCl || '24시간',
      lastUpdated: new Date()
    }));
  }

  // 시설 정보 파싱
  private parseFacilities(facilitiesStr: string): string[] {
    if (!facilitiesStr) return [];
    
    const facilityMap: { [key: string]: string } = {
      '전기': 'electricity',
      '온수': 'hotWater',
      '샤워장': 'shower',
      '화장실': 'toilet',
      '주차장': 'parking',
      '매점': 'store',
      '수영장': 'pool',
      '놀이터': 'playground'
    };

    return facilitiesStr.split(',').map(f => f.trim()).filter(f => facilityMap[f]);
  }

  // 개발용 목 데이터
  private getMockData(): CampingSpot[] {
    return [
      {
        id: '1',
        name: '강원도 캠핑장',
        address: '강원도 춘천시 남산면',
        phone: '033-123-4567',
        latitude: 37.5665,
        longitude: 126.9780,
        facilities: ['electricity', 'hotWater', 'shower', 'toilet'],
        price: { type: 'paid', amount: 30000 },
        reservation: { available: true, method: '온라인 예약' },
        images: ['https://via.placeholder.com/300x200?text=Camping+1'],
        description: '아름다운 자연 속에서 즐기는 캠핑',
        operatingHours: '24시간',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: '경기도 캠핑장',
        address: '경기도 가평군 청평면',
        phone: '031-987-6543',
        latitude: 37.7749,
        longitude: 127.4194,
        facilities: ['electricity', 'toilet', 'parking'],
        price: { type: 'free' },
        reservation: { available: false, method: '예약 불가' },
        images: ['https://via.placeholder.com/300x200?text=Camping+2'],
        description: '무료로 이용 가능한 캠핑장',
        operatingHours: '24시간',
        lastUpdated: new Date()
      }
    ];
  }
}

export const campingApiService = new CampingApiService(); 