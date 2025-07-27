import { CampingSpot, SearchFilter, ApiResponse } from '../types/camping';

// 공공데이터 포털 API 설정
const API_BASE_URL = 'http://apis.data.go.kr/B551011/GoCamping';
// 디코딩된 키 사용 (테스트 결과 동작 확인됨)
const API_KEY = import.meta.env.VITE_CAMPING_API_KEY || 'wGe6JiB70SrZJGSyox1BxgjxraEm0XTQ9WpgAwTFLsCLBcb3De2jkdfKaTVuKAFWcVGhOX8m20z8Mk6NR74Pnw==';

class CampingApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
    console.log('CampingApiService 초기화:');
    console.log('Base URL:', this.baseUrl);
    console.log('API Key:', this.apiKey ? '설정됨' : '설정되지 않음');
  }

  // 캠핑장 목록 조회
  async getCampingSpots(filter?: { doName?: string; sigunguName?: string }, pageNo: number = 1): Promise<CampingSpot[]> {
    try {
      console.log('=== API 호출 시작 ===');
      console.log('API 키:', this.apiKey);
      console.log('Base URL:', this.baseUrl);
      console.log('페이지 번호:', pageNo);
      console.log('필터:', filter);
      
      const params = new URLSearchParams({
        serviceKey: this.apiKey,
        numOfRows: '10000', // 전체 데이터를 가져오기 위해 충분히 큰 값 설정
        pageNo: pageNo.toString(),
        MobileOS: 'ETC',
        MobileApp: 'CampingFinder',
        _type: 'json'
      });

      // 필터가 undefined가 아닐 때만 파라미터 추가
      console.log('=== API 호출 필터 정보 ===');
      console.log('전체 필터 객체:', filter);
      console.log('필터 타입:', typeof filter);
      console.log('필터가 존재하는가:', !!filter);
      
      if (filter && filter.doName) {
        params.append('doNm', filter.doName);
        console.log('도 이름 추가:', filter.doName);
      }
      if (filter && filter.sigunguName) {
        params.append('sigunguNm', filter.sigunguName);
        console.log('시군구 이름 추가:', filter.sigunguName);
      }
      
      console.log('최종 파라미터:', params.toString());

      const url = `${this.baseUrl}/basedList?${params}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url);
      console.log('응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('응답 데이터:', data);
      console.log('응답 헤더:', data.response?.header);
      console.log('응답 바디:', data.response?.body);

      if (data.response?.header?.resultCode === '0000') {
        const items = data.response.body.items.item;
        console.log('API 응답 아이템 개수:', Array.isArray(items) ? items.length : 1);
        console.log('API 응답 totalCount:', data.response.body.totalCount);
        console.log('API 응답 numOfRows:', data.response.body.numOfRows);
        console.log('API 응답 pageNo:', data.response.body.pageNo);
        console.log('아이템 데이터:', items);
        return this.transformCampingData(items);
      } else {
        console.error('API 응답 오류:', data.response?.header);
        console.error('전체 응답:', data);
        throw new Error(`API 호출 실패: ${data.response?.header?.resultMsg || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('캠핑장 목록 조회 실패:', error);
      console.log('목 데이터로 대체합니다.');
      return this.getMockData(); // 개발용 목 데이터
    }
  }

  // 전체 캠핑장 개수 조회
  async getTotalCampingCount(filter?: { doName?: string; sigunguName?: string }): Promise<number> {
    try {
      const params = new URLSearchParams({
        serviceKey: this.apiKey,
        numOfRows: '1', // 최소한의 데이터만 가져와서 totalCount만 확인
        pageNo: '1',
        MobileOS: 'ETC',
        MobileApp: 'CampingFinder',
        _type: 'json'
      });

      // 필터가 undefined가 아닐 때만 파라미터 추가
      if (filter && filter.doName) {
        params.append('doNm', filter.doName);
        console.log('전체 개수 조회 - 도 이름 추가:', filter.doName);
      }
      if (filter && filter.sigunguName) {
        params.append('sigunguNm', filter.sigunguName);
        console.log('전체 개수 조회 - 시군구 이름 추가:', filter.sigunguName);
      }

      const response = await fetch(`${this.baseUrl}/basedList?${params}`);
      const data = await response.json();
      
      console.log('전체 개수 조회 응답:', data);
      console.log('전체 개수 조회 헤더:', data.response?.header);

      if (data.response?.header?.resultCode === '0000') {
        return data.response.body.totalCount || 0;
      } else {
        console.error('전체 개수 조회 실패 - 전체 응답:', data);
        throw new Error(`API 호출 실패: ${data.response?.header?.resultMsg || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('전체 캠핑장 개수 조회 실패:', error);
      return 0;
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

      if (data.response?.header?.resultCode === '0000') {
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