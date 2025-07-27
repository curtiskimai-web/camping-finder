# 🏕️ Camping Finder - 데이터 모델 및 타입

## 📚 문서 정보
**문서명**: 데이터 모델 및 타입  
**버전**: v1.0.0  
**작성일**: 2024년 1월 4일  
**최종 업데이트**: 2024년 1월 4일  
**문서 상태**: 완료

---

## 🏗️ TypeScript 타입 정의

### 기본 타입 정의
Camping Finder는 **TypeScript**를 활용하여 타입 안전성을 보장하며, 모든 데이터 구조에 대해 명확한 타입 정의를 제공합니다.

#### 위치 관련 타입
```typescript
// 위도/경도 좌표
export interface LatLng {
  lat: number;  // 위도 (latitude)
  lng: number;  // 경도 (longitude)
}

// 지도 경계
export interface Bounds {
  north: number;  // 북쪽 경계
  south: number;  // 남쪽 경계
  east: number;   // 동쪽 경계
  west: number;   // 서쪽 경계
}

// 지도 뷰포트
export interface Viewport {
  center: LatLng;
  zoom: number;
  bounds?: Bounds;
}
```

#### 캠핑장 데이터 타입
```typescript
// 캠핑장 기본 정보
export interface CampingSite {
  // 기본 식별 정보
  contentId: string;        // 콘텐츠 ID (고유 식별자)
  facltNm: string;          // 캠핑장명
  
  // 소개 정보
  lineIntro?: string;       // 한 줄 소개
  intro?: string;           // 상세 소개
  
  // 관리 정보
  allar?: string;           // 면적
  insrncAt?: string;        // 보험 가입일
  trsagntNo?: string;       // 여행사업등록번호
  bizrno?: string;          // 사업자등록번호
  facltDivNm?: string;      // 시설구분명
  mangeDivNm?: string;      // 관리구분명
  mgcDiv?: string;          // 관리구분
  manageSttus?: string;     // 관리상태
  
  // 운영 정보
  hvofBgnde?: string;       // 휴장 시작일
  hvofEnddle?: string;      // 휴장 종료일
  featureNm?: string;       // 특징명
  induty?: string;          // 업종
  lctCl?: string;           // 입지구분
  
  // 위치 정보
  doNm: string;             // 도명
  sigunguNm: string;        // 시군구명
  zipcode?: string;         // 우편번호
  addr1: string;            // 주소1
  addr2?: string;           // 주소2
  mapX: string;             // 지도 X좌표 (경도)
  mapY: string;             // 지도 Y좌표 (위도)
  direction?: string;       // 오시는 길
  
  // 연락처 정보
  tel?: string;             // 전화번호
  homepage?: string;        // 홈페이지
  resveUrl?: string;        // 예약 URL
  resveCl?: string;         // 예약 구분
  
  // 관리 인원
  manageNmpr?: string;      // 관리 인원수
  
  // 사이트 정보
  gnrlSiteCo?: string;      // 일반 사이트 수
  autoSiteCo?: string;      // 자동차 사이트 수
  glampSiteCo?: string;     // 글램핑 사이트 수
  caravSiteCo?: string;     // 카라반 사이트 수
  indvdlCaravSiteCo?: string; // 개인 카라반 사이트 수
  
  // 사이트 크기
  sitedStnc?: string;       // 사이트 간격
  siteMg1Width?: string;    // 사이트 크기1 (가로)
  siteMg2Width?: string;    // 사이트 크기2 (가로)
  siteMg3Width?: string;    // 사이트 크기3 (가로)
  siteMg1Vrticl?: string;   // 사이트 크기1 (세로)
  siteMg2Vrticl?: string;   // 사이트 크기2 (세로)
  siteMg3Vrticl?: string;   // 사이트 크기3 (세로)
  siteMg1Co?: string;       // 사이트 수1
  siteMg2Co?: string;       // 사이트 수2
  siteMg3Co?: string;       // 사이트 수3
  
  // 사이트 바닥 재질
  siteBottomCl1?: string;   // 사이트 바닥 재질1
  siteBottomCl2?: string;   // 사이트 바닥 재질2
  siteBottomCl3?: string;   // 사이트 바닥 재질3
  siteBottomCl4?: string;   // 사이트 바닥 재질4
  siteBottomCl5?: string;   // 사이트 바닥 재질5
  
  // 시설 정보
  glampInnerFclty?: string; // 글램핑 내부시설
  caravInnerFclty?: string; // 카라반 내부시설
  
  // 운영 정보
  prmisnDe?: string;        // 허가일
  operPdCl?: string;        // 운영기간 구분
  operDeCl?: string;        // 운영일 구분
  trlerAcmpnyAt?: string;   // 트레일러 동반 여부
  caravAcmpnyAt?: string;   // 카라반 동반 여부
  
  // 편의시설
  toiletCo?: string;        // 화장실 수
  swrmCo?: string;          // 샤워실 수
  wtrplCo?: string;         // 세면장 수
  brazierCl?: string;       // 화로 구분
  sbrsCl?: string;          // 부대시설 구분
  sbrsEtc?: string;         // 부대시설 기타
  
  // 가능한 시설
  posblFcltyCl?: string;    // 가능한 시설 구분
  posblFcltyEtc?: string;   // 가능한 시설 기타
  
  // 문화행사
  clturEventAt?: string;    // 문화행사 여부
  clturEvent?: string;      // 문화행사
  
  // 체험프로그램
  exprnProgrmAt?: string;   // 체험프로그램 여부
  exprnProgrm?: string;     // 체험프로그램
  
  // 기타 시설
  extshrCo?: string;        // 소화기 수
  frprvtWrppCo?: string;    // 화재예방 랩 수
  frprvtSandCo?: string;    // 화재예방 모래 수
  fireSensorCo?: string;    // 화재감지기 수
  
  // 테마 환경
  themaEnvrnCl?: string;    // 테마환경 구분
  eqpmnLendCl?: string;     // 장비대여 구분
  animalCmgCl?: string;     // 동물출입 구분
  tourEraCl?: string;       // 관광시기 구분
  
  // 이미지
  firstImageUrl?: string;   // 대표 이미지 URL
  
  // 메타데이터
  createdtime: string;      // 생성일시
  modifiedtime: string;     // 수정일시
  
  // 계산된 필드
  distance?: number;        // 사용자 위치로부터의 거리
  location?: LatLng;        // 위치 좌표 (파싱된)
}
```

#### 필터 및 정렬 타입
```typescript
// 필터 상태
export interface FilterState {
  do: string;               // 선택된 도
  sigungu: string;          // 선택된 시군구
  induty?: string;          // 업종 필터
  resveCl?: string;         // 예약 구분 필터
  brazierCl?: string;       // 화로 구분 필터
}

// 정렬 옵션
export type SortOption = 'name' | 'distance' | 'created' | 'rating';

// 정렬 방향
export type SortDirection = 'asc' | 'desc';

// 정렬 상태
export interface SortState {
  by: SortOption;
  direction: SortDirection;
}
```

#### 페이지네이션 타입
```typescript
// 페이지네이션 상태
export interface PaginationState {
  currentPage: number;      // 현재 페이지
  itemsPerPage: number;     // 페이지당 아이템 수
  totalItems: number;       // 전체 아이템 수
  totalPages: number;       // 전체 페이지 수
}

// 페이지네이션 계산 결과
export interface PaginationResult<T> {
  items: T[];               // 현재 페이지 아이템들
  pagination: PaginationState;
}
```

#### API 응답 타입
```typescript
// API 응답 헤더
export interface ApiResponseHeader {
  resultCode: string;       // 결과 코드 ('0000': 성공)
  resultMsg: string;        // 결과 메시지
}

// API 응답 바디
export interface ApiResponseBody<T> {
  items: {
    item: T | T[];          // 응답 데이터 (단일 또는 배열)
  };
  numOfRows: number;        // 한 페이지 결과 수
  pageNo: number;           // 페이지 번호
  totalCount: number;       // 전체 결과 수
}

// API 응답
export interface ApiResponse<T> {
  response: {
    header: ApiResponseHeader;
    body: ApiResponseBody<T>;
  };
}

// 에러 응답
export interface ApiErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
}
```

---

## 🔄 데이터 구조 설계

### 데이터 정규화
#### 도/시군구 정규화
```typescript
// 도 이름 정규화 매핑
export const DO_NAME_MAPPING: Record<string, string> = {
  '강원': '강원도',
  '강원도': '강원도',
  '강원 특별자치도': '강원도',
  '강원특별자치도': '강원도',
  '서울시': '서울특별시',
  '서울특별시': '서울특별시',
  '서울': '서울특별시',
  '부산시': '부산광역시',
  '부산광역시': '부산광역시',
  '부산': '부산광역시',
  '대구시': '대구광역시',
  '대구광역시': '대구광역시',
  '대구': '대구광역시',
  '인천시': '인천광역시',
  '인천광역시': '인천광역시',
  '인천': '인천광역시',
  '광주시': '광주광역시',
  '광주광역시': '광주광역시',
  '광주': '광주광역시',
  '대전시': '대전광역시',
  '대전광역시': '대전광역시',
  '대전': '대전광역시',
  '울산시': '울산광역시',
  '울산광역시': '울산광역시',
  '울산': '울산광역시',
  '세종시': '세종특별자치시',
  '세종특별자치시': '세종특별자치시',
  '세종': '세종특별자치시',
  '경기': '경기도',
  '경기도': '경기도',
  '충북': '충청북도',
  '충청북도': '충청북도',
  '충남': '충청남도',
  '충청남도': '충청남도',
  '전북': '전라북도',
  '전라북도': '전라북도',
  '전남': '전라남도',
  '전라남도': '전라남도',
  '경북': '경상북도',
  '경상북도': '경상북도',
  '경남': '경상남도',
  '경상남도': '경상남도',
  '제주': '제주특별자치도',
  '제주특별자치도': '제주특별자치도',
  '제주도': '제주특별자치도'
};

// 도 이름 정규화 함수
export const normalizeDoName = (doName: string): string => {
  return DO_NAME_MAPPING[doName] || doName;
};

// 시군구 이름 정규화 매핑
export const SIGUNGU_NAME_MAPPING: Record<string, string> = {
  // 서울특별시
  '강남구': '강남구',
  '강동구': '강동구',
  '강북구': '강북구',
  '강서구': '강서구',
  '관악구': '관악구',
  '광진구': '광진구',
  '구로구': '구로구',
  '금천구': '금천구',
  '노원구': '노원구',
  '도봉구': '도봉구',
  '동대문구': '동대문구',
  '동작구': '동작구',
  '마포구': '마포구',
  '서대문구': '서대문구',
  '서초구': '서초구',
  '성동구': '성동구',
  '성북구': '성북구',
  '송파구': '송파구',
  '양천구': '양천구',
  '영등포구': '영등포구',
  '용산구': '용산구',
  '은평구': '은평구',
  '종로구': '종로구',
  '중구': '중구',
  '중랑구': '중랑구',
  
  // 기타 시군구들...
};

// 시군구 이름 정규화 함수
export const normalizeSigunguName = (sigunguName: string): string => {
  return SIGUNGU_NAME_MAPPING[sigunguName] || sigunguName;
};
```

#### 데이터 변환 유틸리티
```typescript
// 캠핑장 데이터 정규화
export const normalizeCampingData = (rawData: any[]): CampingSite[] => {
  return rawData.map(item => ({
    ...item,
    // 도/시군구 이름 정규화
    doNm: normalizeDoName(item.doNm),
    sigunguNm: normalizeSigunguName(item.sigunguNm),
    
    // 위치 좌표 파싱
    location: {
      lat: parseFloat(item.mapY),
      lng: parseFloat(item.mapX)
    },
    
    // 숫자 필드 파싱
    distance: item.distance ? parseFloat(item.distance) : undefined,
    
    // 날짜 필드 파싱
    createdtime: new Date(item.createdtime).toISOString(),
    modifiedtime: new Date(item.modifiedtime).toISOString()
  }));
};

// 데이터 검증
export const validateCampingData = (data: any): data is CampingSite => {
  return (
    typeof data === 'object' &&
    typeof data.contentId === 'string' &&
    typeof data.facltNm === 'string' &&
    typeof data.doNm === 'string' &&
    typeof data.sigunguNm === 'string' &&
    typeof data.addr1 === 'string' &&
    typeof data.mapX === 'string' &&
    typeof data.mapY === 'string'
  );
};
```

### 데이터 캐싱 구조
```typescript
// 캐시 아이템 타입
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// 캐시 클래스
export class DataCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5분 기본값
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 체크
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}
```

---

## 🔍 인터페이스 명세

### API 인터페이스
```typescript
// API 서비스 인터페이스
export interface CampingApiService {
  // 캠핑장 목록 조회
  getCampingList(params?: {
    numOfRows?: number;
    pageNo?: number;
    do?: string;
    sigungu?: string;
  }): Promise<ApiResponse<CampingSite[]>>;

  // 캠핑장 상세 정보 조회
  getCampingDetail(contentId: string): Promise<ApiResponse<CampingSite>>;

  // 캠핑장 검색
  searchCamping(query: string): Promise<ApiResponse<CampingSite[]>>;
}

// 데이터 서비스 인터페이스
export interface DataService {
  // 데이터 로딩
  loadData(): Promise<CampingSite[]>;
  
  // 데이터 필터링
  filterData(data: CampingSite[], filters: FilterState): CampingSite[];
  
  // 데이터 정렬
  sortData(data: CampingSite[], sortState: SortState): CampingSite[];
  
  // 데이터 페이지네이션
  paginateData(data: CampingSite[], pagination: PaginationState): PaginationResult<CampingSite>;
  
  // 거리 계산
  calculateDistances(data: CampingSite[], userLocation: LatLng): CampingSite[];
}
```

### 컴포넌트 인터페이스
```typescript
// 컴포넌트 Props 인터페이스
export interface ComponentProps {
  // 공통 Props
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// 캠핑장 카드 Props
export interface CampingCardProps extends ComponentProps {
  camping: CampingSite;
  isSelected?: boolean;
  showDistance?: boolean;
  onSelect: (camping: CampingSite) => void;
  onFavorite?: (camping: CampingSite) => void;
}

// 검색 필터 Props
export interface SearchFilterProps extends ComponentProps {
  filters: FilterState;
  availableFilters: {
    do: string[];
    sigungu: string[];
    induty: string[];
  };
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

// 지도 Props
export interface MapProps extends ComponentProps {
  campingSites: CampingSite[];
  selectedCamping: CampingSite | null;
  userLocation: LatLng | null;
  onCampingSelect: (camping: CampingSite) => void;
  onLocationRequest: () => void;
}
```

### 이벤트 인터페이스
```typescript
// 이벤트 핸들러 타입
export type EventHandler<T = void> = () => T;
export type AsyncEventHandler<T = void> = () => Promise<T>;

// 캠핑장 선택 이벤트
export interface CampingSelectEvent {
  camping: CampingSite;
  userLocation?: LatLng;
  timestamp: number;
}

// 필터 변경 이벤트
export interface FilterChangeEvent {
  previousFilters: FilterState;
  newFilters: FilterState;
  timestamp: number;
}

// 지도 이벤트
export interface MapEvent {
  type: 'zoom' | 'pan' | 'click' | 'marker_click';
  data: any;
  timestamp: number;
}
```

---

## 🛡️ 타입 안전성 보장

### 타입 가드 함수
```typescript
// 타입 가드 함수들
export const isLatLng = (value: any): value is LatLng => {
  return (
    typeof value === 'object' &&
    typeof value.lat === 'number' &&
    typeof value.lng === 'number' &&
    value.lat >= -90 && value.lat <= 90 &&
    value.lng >= -180 && value.lng <= 180
  );
};

export const isCampingSite = (value: any): value is CampingSite => {
  return (
    typeof value === 'object' &&
    typeof value.contentId === 'string' &&
    typeof value.facltNm === 'string' &&
    typeof value.doNm === 'string' &&
    typeof value.sigunguNm === 'string' &&
    typeof value.addr1 === 'string' &&
    typeof value.mapX === 'string' &&
    typeof value.mapY === 'string'
  );
};

export const isFilterState = (value: any): value is FilterState => {
  return (
    typeof value === 'object' &&
    typeof value.do === 'string' &&
    typeof value.sigungu === 'string'
  );
};

export const isApiResponse = <T>(value: any): value is ApiResponse<T> => {
  return (
    typeof value === 'object' &&
    value.response &&
    value.response.header &&
    typeof value.response.header.resultCode === 'string'
  );
};
```

### 런타임 타입 검증
```typescript
// Zod를 사용한 스키마 검증
import { z } from 'zod';

// 캠핑장 스키마
export const CampingSiteSchema = z.object({
  contentId: z.string(),
  facltNm: z.string(),
  lineIntro: z.string().optional(),
  intro: z.string().optional(),
  doNm: z.string(),
  sigunguNm: z.string(),
  addr1: z.string(),
  addr2: z.string().optional(),
  mapX: z.string(),
  mapY: z.string(),
  tel: z.string().optional(),
  homepage: z.string().optional(),
  createdtime: z.string(),
  modifiedtime: z.string()
});

// API 응답 스키마
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    response: z.object({
      header: z.object({
        resultCode: z.string(),
        resultMsg: z.string()
      }),
      body: z.object({
        items: z.object({
          item: z.union([dataSchema, z.array(dataSchema)])
        }),
        numOfRows: z.number(),
        pageNo: z.number(),
        totalCount: z.number()
      })
    })
  });

// 데이터 검증 함수
export const validateCampingData = (data: any): CampingSite[] => {
  try {
    const schema = z.array(CampingSiteSchema);
    return schema.parse(data);
  } catch (error) {
    console.error('Data validation failed:', error);
    throw new Error('Invalid camping data format');
  }
};

export const validateApiResponse = <T>(data: any, dataSchema: z.ZodType<T>): ApiResponse<T> => {
  try {
    const schema = ApiResponseSchema(dataSchema);
    return schema.parse(data);
  } catch (error) {
    console.error('API response validation failed:', error);
    throw new Error('Invalid API response format');
  }
};
```

### 타입 유틸리티
```typescript
// 유틸리티 타입들
export type PartialCampingSite = Partial<CampingSite>;
export type RequiredCampingSite = Required<CampingSite>;
export type PickCampingSite = Pick<CampingSite, 'contentId' | 'facltNm' | 'doNm' | 'sigunguNm'>;
export type OmitCampingSite = Omit<CampingSite, 'distance' | 'location'>;

// 조건부 타입
export type CampingSiteWithDistance = CampingSite & {
  distance: number;
};

export type CampingSiteWithLocation = CampingSite & {
  location: LatLng;
};

// 함수 타입
export type CampingFilterFunction = (camping: CampingSite) => boolean;
export type CampingSortFunction = (a: CampingSite, b: CampingSite) => number;
export type CampingTransformFunction = (camping: CampingSite) => CampingSite;

// 이벤트 핸들러 타입
export type CampingSelectHandler = (camping: CampingSite) => void;
export type FilterChangeHandler = (filters: FilterState) => void;
export type SortChangeHandler = (sortState: SortState) => void;
```

---

## 📊 데이터 변환 및 매핑

### 데이터 변환 함수
```typescript
// 데이터 변환 유틸리티
export class DataTransformer {
  // 원시 데이터를 CampingSite로 변환
  static toCampingSite(rawData: any): CampingSite {
    return {
      ...rawData,
      doNm: normalizeDoName(rawData.doNm),
      sigunguNm: normalizeSigunguName(rawData.sigunguNm),
      location: {
        lat: parseFloat(rawData.mapY),
        lng: parseFloat(rawData.mapX)
      },
      createdtime: new Date(rawData.createdtime).toISOString(),
      modifiedtime: new Date(rawData.modifiedtime).toISOString()
    };
  }

  // CampingSite 배열 변환
  static toCampingSiteArray(rawData: any[]): CampingSite[] {
    return rawData.map(item => this.toCampingSite(item));
  }

  // 거리 계산 추가
  static addDistances(campingSites: CampingSite[], userLocation: LatLng): CampingSite[] {
    return campingSites.map(site => ({
      ...site,
      distance: calculateDistance(userLocation, site.location!)
    }));
  }

  // 필터링
  static filter(campingSites: CampingSite[], filters: FilterState): CampingSite[] {
    return campingSites.filter(site => {
      if (filters.do && site.doNm !== filters.do) return false;
      if (filters.sigungu && site.sigunguNm !== filters.sigungu) return false;
      if (filters.induty && site.induty !== filters.induty) return false;
      if (filters.resveCl && site.resveCl !== filters.resveCl) return false;
      return true;
    });
  }

  // 정렬
  static sort(campingSites: CampingSite[], sortState: SortState): CampingSite[] {
    const sorted = [...campingSites];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortState.by) {
        case 'name':
          comparison = a.facltNm.localeCompare(b.facltNm, 'ko');
          break;
        case 'distance':
          comparison = (a.distance || 0) - (b.distance || 0);
          break;
        case 'created':
          comparison = new Date(a.createdtime).getTime() - new Date(b.createdtime).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }

  // 페이지네이션
  static paginate(
    campingSites: CampingSite[], 
    pagination: PaginationState
  ): PaginationResult<CampingSite> {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const items = campingSites.slice(startIndex, endIndex);
    
    return {
      items,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.totalItems / pagination.itemsPerPage)
      }
    };
  }
}
```

### 데이터 매핑 함수
```typescript
// 데이터 매핑 유틸리티
export class DataMapper {
  // 도별 캠핑장 수 매핑
  static mapDoCounts(campingSites: CampingSite[]): Record<string, number> {
    return campingSites.reduce((acc, site) => {
      acc[site.doNm] = (acc[site.doNm] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // 시군구별 캠핑장 수 매핑
  static mapSigunguCounts(campingSites: CampingSite[]): Record<string, number> {
    return campingSites.reduce((acc, site) => {
      acc[site.sigunguNm] = (acc[site.sigunguNm] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  // 업종별 캠핑장 수 매핑
  static mapIndutyCounts(campingSites: CampingSite[]): Record<string, number> {
    return campingSites.reduce((acc, site) => {
      if (site.induty) {
        acc[site.induty] = (acc[site.induty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }

  // 거리별 캠핑장 그룹화
  static groupByDistance(
    campingSites: CampingSite[], 
    userLocation: LatLng
  ): Record<string, CampingSite[]> {
    const groups: Record<string, CampingSite[]> = {
      '5km 이내': [],
      '5-10km': [],
      '10-20km': [],
      '20-50km': [],
      '50km 이상': []
    };

    campingSites.forEach(site => {
      const distance = calculateDistance(userLocation, site.location!);
      
      if (distance <= 5) {
        groups['5km 이내'].push(site);
      } else if (distance <= 10) {
        groups['5-10km'].push(site);
      } else if (distance <= 20) {
        groups['10-20km'].push(site);
      } else if (distance <= 50) {
        groups['20-50km'].push(site);
      } else {
        groups['50km 이상'].push(site);
      }
    });

    return groups;
  }

  // 시설별 캠핑장 매핑
  static mapFacilities(campingSites: CampingSite[]): Record<string, CampingSite[]> {
    const facilities: Record<string, CampingSite[]> = {
      '화로': [],
      '전기': [],
      '온수': [],
      '샤워실': [],
      '화장실': [],
      '카라반': [],
      '글램핑': []
    };

    campingSites.forEach(site => {
      if (site.brazierCl && site.brazierCl.includes('개별')) {
        facilities['화로'].push(site);
      }
      if (site.posblFcltyCl && site.posblFcltyCl.includes('전기')) {
        facilities['전기'].push(site);
      }
      if (site.posblFcltyCl && site.posblFcltyCl.includes('온수')) {
        facilities['온수'].push(site);
      }
      if (site.swrmCo && parseInt(site.swrmCo) > 0) {
        facilities['샤워실'].push(site);
      }
      if (site.toiletCo && parseInt(site.toiletCo) > 0) {
        facilities['화장실'].push(site);
      }
      if (site.caravSiteCo && parseInt(site.caravSiteCo) > 0) {
        facilities['카라반'].push(site);
      }
      if (site.glampSiteCo && parseInt(site.glampSiteCo) > 0) {
        facilities['글램핑'].push(site);
      }
    });

    return facilities;
  }
}
```

---

## 🏆 데이터 모델 및 타입 성과

### 기술적 성과
- ✅ **타입 안전성**: 100% TypeScript 타입 정의
- ✅ **데이터 정규화**: 일관된 데이터 구조 보장
- ✅ **런타임 검증**: Zod를 통한 데이터 검증
- ✅ **타입 가드**: 런타임 타입 안전성 보장
- ✅ **유틸리티 타입**: 재사용 가능한 타입 정의

### 개발자 경험 성과
- ✅ **명확한 인터페이스**: 모든 데이터 구조에 대한 명확한 정의
- ✅ **자동완성**: IDE에서 완벽한 자동완성 지원
- ✅ **컴파일 타임 에러**: 타입 오류 조기 발견
- ✅ **리팩토링 안전성**: 타입 기반 안전한 리팩토링
- ✅ **문서화**: 타입 정의를 통한 자동 문서화

### 성능 성과
- ✅ **메모리 효율성**: 최적화된 데이터 구조
- ✅ **변환 성능**: 효율적인 데이터 변환 함수
- ✅ **캐싱 지원**: 타입 안전한 캐싱 시스템
- ✅ **검증 성능**: 빠른 런타임 데이터 검증

---

**다음 문서**: [08_BUILD_DEPLOYMENT.md](./08_BUILD_DEPLOYMENT.md) - 빌드 및 배포 상세 분석 