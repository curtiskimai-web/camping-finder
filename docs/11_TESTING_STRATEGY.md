# 🧪 Camping Finder - 테스트 전략

## 📚 문서 개요
**프로젝트명**: Camping Finder  
**버전**: v1.0.0  
**최종 업데이트**: 2024년 1월 4일  
**문서 상태**: 테스트 전략 설계

## 🎯 테스트 전략 목표

### 핵심 목표
- **품질 보장**: 모든 기능의 정상 동작 확인
- **회귀 방지**: 새로운 기능 추가 시 기존 기능 보호
- **안정성 확보**: 프로덕션 환경에서의 안정적인 서비스 제공
- **개발 효율성**: 자동화된 테스트로 수동 테스트 시간 단축

### 테스트 원칙
- **피라미드 구조**: 단위 테스트 > 통합 테스트 > E2E 테스트
- **자동화 우선**: 가능한 모든 테스트 자동화
- **지속적 테스트**: CI/CD 파이프라인에 테스트 통합
- **실용적 접근**: 비즈니스 가치에 집중한 테스트 설계

## 🏗️ 테스트 아키텍처

### 테스트 피라미드
```
                    ┌─────────────────┐
                    │   E2E Tests     │ ← 사용자 시나리오 기반
                    │   (10-20%)      │
                    └─────────────────┘
                           │
                    ┌─────────────────┐
                    │ Integration     │ ← 컴포넌트 간 상호작용
                    │ Tests (20-30%)  │
                    └─────────────────┘
                           │
                    ┌─────────────────┐
                    │ Unit Tests      │ ← 개별 함수/컴포넌트
                    │ (50-70%)        │
                    └─────────────────┘
```

### 테스트 도구 스택
```typescript
// 테스트 도구 구성
const testStack = {
  unit: {
    framework: 'Jest',
    utilities: 'React Testing Library',
    mocking: 'Jest Mock',
    coverage: 'Jest Coverage'
  },
  integration: {
    framework: 'Jest',
    utilities: 'React Testing Library',
    api: 'MSW (Mock Service Worker)',
    database: 'In-Memory Database'
  },
  e2e: {
    framework: 'Playwright',
    browser: 'Chromium, Firefox, Safari',
    reporting: 'Playwright Report'
  },
  visual: {
    framework: 'Playwright',
    comparison: 'Pixel-by-Pixel',
    baseline: 'Screenshot Comparison'
  }
};
```

## 🔬 단위 테스트 전략

### 테스트 대상
1. **유틸리티 함수**
   - 데이터 정규화 함수
   - 거리 계산 함수
   - API 응답 처리 함수

2. **React 컴포넌트**
   - 순수 컴포넌트 (Presentational)
   - 로직 컴포넌트 (Container)
   - 커스텀 훅

3. **서비스 레이어**
   - API 호출 함수
   - 데이터 변환 로직
   - 캐싱 로직

### 단위 테스트 예제

#### 1. 유틸리티 함수 테스트
```typescript
// src/utils/distance.test.ts
import { calculateDistance, formatDistance } from './distance';

describe('Distance Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      const point1 = { lat: 37.5665, lng: 126.9780 }; // 서울
      const point2 = { lat: 35.1796, lng: 129.0756 }; // 부산
      
      const distance = calculateDistance(point1, point2);
      
      expect(distance).toBeCloseTo(325.5, 1); // 약 325.5km
    });

    it('should return 0 for same coordinates', () => {
      const point = { lat: 37.5665, lng: 126.9780 };
      
      const distance = calculateDistance(point, point);
      
      expect(distance).toBe(0);
    });

    it('should handle invalid coordinates', () => {
      const point1 = { lat: 91, lng: 181 }; // 유효하지 않은 좌표
      const point2 = { lat: 37.5665, lng: 126.9780 };
      
      expect(() => calculateDistance(point1, point2)).toThrow();
    });
  });

  describe('formatDistance', () => {
    it('should format distance in kilometers', () => {
      expect(formatDistance(1500)).toBe('1.5km');
      expect(formatDistance(500)).toBe('0.5km');
    });

    it('should format distance in meters for short distances', () => {
      expect(formatDistance(800)).toBe('800m');
      expect(formatDistance(50)).toBe('50m');
    });
  });
});
```

#### 2. React 컴포넌트 테스트
```typescript
// src/components/CampingCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CampingCard } from './CampingCard';

const mockCamping = {
  id: '1',
  name: '테스트 캠핑장',
  address: '서울시 강남구',
  phone: '02-1234-5678',
  lat: 37.5665,
  lng: 126.9780,
  facilities: ['전기', '온수', '화장실'],
  price: '50,000원',
  rating: 4.5
};

describe('CampingCard', () => {
  it('should render camping information correctly', () => {
    const mockOnSelect = jest.fn();
    
    render(<CampingCard camping={mockCamping} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('테스트 캠핑장')).toBeInTheDocument();
    expect(screen.getByText('서울시 강남구')).toBeInTheDocument();
    expect(screen.getByText('02-1234-5678')).toBeInTheDocument();
    expect(screen.getByText('50,000원')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    
    render(<CampingCard camping={mockCamping} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockCamping);
  });

  it('should show selected state when isSelected is true', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <CampingCard 
        camping={mockCamping} 
        onSelect={mockOnSelect} 
        isSelected={true} 
      />
    );
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('selected');
  });

  it('should display facilities correctly', () => {
    const mockOnSelect = jest.fn();
    
    render(<CampingCard camping={mockCamping} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('전기')).toBeInTheDocument();
    expect(screen.getByText('온수')).toBeInTheDocument();
    expect(screen.getByText('화장실')).toBeInTheDocument();
  });
});
```

#### 3. 커스텀 훅 테스트
```typescript
// src/hooks/useCampingData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useCampingData } from './useCampingData';
import { mockCampingData } from '../__mocks__/campingData';

// MSW를 사용한 API 모킹
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/camping', (req, res, ctx) => {
    return res(ctx.json(mockCampingData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useCampingData', () => {
  it('should fetch camping data successfully', async () => {
    const { result } = renderHook(() => useCampingData());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockCampingData);
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors', async () => {
    server.use(
      rest.get('/api/camping', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useCampingData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBe(null);
  });

  it('should apply filters correctly', async () => {
    const { result } = renderHook(() => 
      useCampingData({ 
        region: '서울', 
        facilities: ['전기'] 
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 필터링된 결과 확인
    const filteredData = result.current.data;
    expect(filteredData).toBeDefined();
    // 필터링 로직 검증
  });
});
```

### 단위 테스트 커버리지 목표
```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

## 🔗 통합 테스트 전략

### 테스트 대상
1. **컴포넌트 간 상호작용**
   - 검색 필터와 캠핑 목록 연동
   - 지도와 캠핑 카드 선택 연동
   - 페이지 간 데이터 전달

2. **API 통합**
   - Vercel API Routes와 프론트엔드 연동
   - 에러 처리 및 로딩 상태
   - 데이터 캐싱 동작

3. **사용자 플로우**
   - 검색 → 필터링 → 선택 → 상세보기
   - 지도 탐색 → 마커 클릭 → 정보 표시

### 통합 테스트 예제

#### 1. 검색 및 필터링 통합 테스트
```typescript
// src/components/__tests__/SearchFilter.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchFilter } from '../SearchFilter';
import { CampingList } from '../CampingList';
import { CampingProvider } from '../../contexts/CampingContext';

const IntegrationTestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CampingProvider>
    {children}
  </CampingProvider>
);

describe('Search and Filter Integration', () => {
  it('should filter camping list when search criteria changes', async () => {
    render(
      <IntegrationTestWrapper>
        <SearchFilter />
        <CampingList />
      </IntegrationTestWrapper>
    );

    // 초기 상태 확인
    await waitFor(() => {
      expect(screen.getAllByTestId('camping-card')).toHaveLength(10);
    });

    // 지역 필터 적용
    const regionSelect = screen.getByLabelText('지역 선택');
    fireEvent.change(regionSelect, { target: { value: '서울' } });

    // 필터링된 결과 확인
    await waitFor(() => {
      const filteredCards = screen.getAllByTestId('camping-card');
      expect(filteredCards.length).toBeLessThan(10);
      
      // 서울 지역 캠핑장만 표시되는지 확인
      filteredCards.forEach(card => {
        expect(card).toHaveTextContent('서울');
      });
    });
  });

  it('should update map markers when filters change', async () => {
    render(
      <IntegrationTestWrapper>
        <SearchFilter />
        <Map />
      </IntegrationTestWrapper>
    );

    // 초기 마커 수 확인
    await waitFor(() => {
      const markers = screen.getAllByTestId('map-marker');
      expect(markers).toHaveLength(10);
    });

    // 시설 필터 적용
    const facilityCheckbox = screen.getByLabelText('전기');
    fireEvent.click(facilityCheckbox);

    // 필터링된 마커 수 확인
    await waitFor(() => {
      const filteredMarkers = screen.getAllByTestId('map-marker');
      expect(filteredMarkers.length).toBeLessThan(10);
    });
  });
});
```

#### 2. API 통합 테스트
```typescript
// src/services/__tests__/campingApi.integration.test.ts
import { fetchCampingData, searchCamping } from '../campingApi';
import { server } from '../../../__mocks__/server';

describe('Camping API Integration', () => {
  it('should handle successful API response', async () => {
    const mockData = [
      {
        id: '1',
        name: '테스트 캠핑장',
        address: '서울시 강남구',
        lat: 37.5665,
        lng: 126.9780
      }
    ];

    server.use(
      rest.get('/api/camping', (req, res, ctx) => {
        return res(ctx.json(mockData));
      })
    );

    const result = await fetchCampingData();
    
    expect(result).toEqual(mockData);
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      rest.get('/api/camping', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    await expect(fetchCampingData()).rejects.toThrow();
  });

  it('should apply search parameters correctly', async () => {
    const searchParams = { region: '서울', facilities: ['전기'] };
    
    server.use(
      rest.get('/api/camping', (req, res, ctx) => {
        const { searchParams: params } = req.url;
        expect(params.get('region')).toBe('서울');
        expect(params.get('facilities')).toBe('전기');
        
        return res(ctx.json([]));
      })
    );

    await searchCamping(searchParams);
  });
});
```

## 🌐 E2E 테스트 전략

### 테스트 시나리오
1. **핵심 사용자 여정**
   - 홈페이지 접속 → 검색 → 결과 확인 → 상세보기
   - 지도 탐색 → 마커 클릭 → 정보 확인
   - 필터 적용 → 결과 필터링 확인

2. **크로스 브라우저 테스트**
   - Chrome, Firefox, Safari
   - 모바일 브라우저 (iOS Safari, Chrome Mobile)

3. **성능 테스트**
   - 페이지 로딩 시간
   - 지도 렌더링 성능
   - 검색 응답 시간

### E2E 테스트 예제

#### 1. 기본 사용자 여정 테스트
```typescript
// e2e/tests/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Journey Tests', () => {
  test('should complete full camping search journey', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('/');
    
    // 페이지 로딩 확인
    await expect(page.locator('h1')).toContainText('Camping Finder');
    await expect(page.locator('[data-testid="search-filter"]')).toBeVisible();

    // 2. 검색 조건 설정
    await page.selectOption('[data-testid="region-select"]', '서울');
    await page.check('[data-testid="facility-electric"]');
    await page.click('[data-testid="search-button"]');

    // 3. 검색 결과 확인
    await expect(page.locator('[data-testid="camping-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="camping-card"]')).toHaveCount.greaterThan(0);

    // 4. 캠핑장 선택
    const firstCard = page.locator('[data-testid="camping-card"]').first();
    await firstCard.click();

    // 5. 상세 정보 확인
    await expect(page.locator('[data-testid="camping-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="camping-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="camping-address"]')).toBeVisible();
  });

  test('should handle map interaction correctly', async ({ page }) => {
    await page.goto('/');

    // 지도 로딩 확인
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible();

    // 마커 클릭
    await page.click('[data-testid="map-marker"]:first-child');

    // 팝업 정보 확인
    await expect(page.locator('[data-testid="map-popup"]')).toBeVisible();
    await expect(page.locator('[data-testid="popup-name"]')).toBeVisible();
  });

  test('should apply filters and update results', async ({ page }) => {
    await page.goto('/');

    // 초기 결과 수 확인
    const initialCount = await page.locator('[data-testid="camping-card"]').count();

    // 필터 적용
    await page.selectOption('[data-testid="region-select"]', '부산');
    await page.click('[data-testid="apply-filters"]');

    // 필터링된 결과 확인
    await expect(page.locator('[data-testid="camping-card"]')).toHaveCount.lessThan(initialCount);

    // 모든 결과가 부산 지역인지 확인
    const cards = page.locator('[data-testid="camping-card"]');
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      await expect(card.locator('[data-testid="camping-address"]')).toContainText('부산');
    }
  });
});
```

#### 2. 크로스 브라우저 테스트
```typescript
// e2e/tests/cross-browser.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cross Browser Tests', () => {
  test('should work on Chrome', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Camping Finder');
  });

  test('should work on Firefox', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Camping Finder');
  });

  test('should work on Safari', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Camping Finder');
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 모바일 메뉴 확인
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // 반응형 레이아웃 확인
    await expect(page.locator('[data-testid="search-filter"]')).toBeVisible();
  });
});
```

#### 3. 성능 테스트
```typescript
// e2e/tests/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // 페이지 로딩 완료 대기
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 3초 이내 로딩 확인
    expect(loadTime).toBeLessThan(3000);
  });

  test('should render map efficiently', async ({ page }) => {
    await page.goto('/');
    
    // 지도 컨테이너 대기
    await page.waitForSelector('[data-testid="map-container"]');
    
    // 지도 렌더링 시간 측정
    const mapRenderTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const start = performance.now();
        const mapContainer = document.querySelector('[data-testid="map-container"]');
        
        const observer = new MutationObserver(() => {
          const end = performance.now();
          observer.disconnect();
          resolve(end - start);
        });
        
        observer.observe(mapContainer!, { childList: true, subtree: true });
      });
    });
    
    // 2초 이내 렌더링 확인
    expect(mapRenderTime).toBeLessThan(2000);
  });

  test('should handle large dataset efficiently', async ({ page }) => {
    await page.goto('/');
    
    // 대량 데이터 로딩 시뮬레이션
    await page.evaluate(() => {
      // 1000개의 캠핑장 데이터 시뮬레이션
      const mockData = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        name: `캠핑장 ${i}`,
        address: `주소 ${i}`,
        lat: 37.5665 + (i * 0.001),
        lng: 126.9780 + (i * 0.001)
      }));
      
      // 데이터 로딩 시뮬레이션
      window.dispatchEvent(new CustomEvent('loadCampingData', { 
        detail: mockData 
      }));
    });
    
    // 데이터 로딩 완료 대기
    await page.waitForSelector('[data-testid="camping-card"]');
    
    // 성능 메트릭 확인
    const performanceMetrics = await page.evaluate(() => {
      return {
        memoryUsage: performance.memory?.usedJSHeapSize || 0,
        domNodes: document.querySelectorAll('*').length
      };
    });
    
    // 메모리 사용량 제한 확인
    expect(performanceMetrics.memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
    expect(performanceMetrics.domNodes).toBeLessThan(10000); // 10,000개 노드
  });
});
```

## 🛠️ 테스트 환경 설정

### 개발 환경 설정
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "@playwright/test": "^1.35.0",
    "msw": "^1.2.1"
  }
}
```

### Jest 설정
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx'
  ]
};
```

### Playwright 설정
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

### MSW 설정
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/camping', (req, res, ctx) => {
    const region = req.url.searchParams.get('region');
    const facilities = req.url.searchParams.get('facilities');
    
    let mockData = [
      {
        id: '1',
        name: '서울 캠핑장',
        address: '서울시 강남구',
        lat: 37.5665,
        lng: 126.9780,
        facilities: ['전기', '온수'],
        price: '50,000원'
      },
      {
        id: '2',
        name: '부산 캠핑장',
        address: '부산시 해운대구',
        lat: 35.1796,
        lng: 129.0756,
        facilities: ['전기'],
        price: '40,000원'
      }
    ];
    
    // 필터링 로직
    if (region) {
      mockData = mockData.filter(item => 
        item.address.includes(region)
      );
    }
    
    if (facilities) {
      const facilityList = facilities.split(',');
      mockData = mockData.filter(item =>
        facilityList.some(facility => 
          item.facilities.includes(facility)
        )
      );
    }
    
    return res(ctx.json(mockData));
  }),
  
  rest.get('/api/camping/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    const mockDetail = {
      id,
      name: `캠핑장 ${id}`,
      address: '상세 주소',
      phone: '02-1234-5678',
      description: '캠핑장 상세 설명',
      facilities: ['전기', '온수', '화장실', '샤워실'],
      price: '50,000원',
      rating: 4.5,
      images: ['image1.jpg', 'image2.jpg']
    };
    
    return res(ctx.json(mockDetail));
  })
];
```

## 📊 테스트 메트릭 및 품질 지표

### 커버리지 목표
```typescript
// 테스트 커버리지 목표
const coverageTargets = {
  unit: {
    statements: 85,
    branches: 80,
    functions: 85,
    lines: 85
  },
  integration: {
    statements: 70,
    branches: 65,
    functions: 70,
    lines: 70
  },
  e2e: {
    criticalPaths: 100, // 핵심 사용자 여정
    crossBrowser: 100,  // 크로스 브라우저 호환성
    accessibility: 90   // 접근성 테스트
  }
};
```

### 성능 지표
```typescript
// 성능 테스트 기준
const performanceTargets = {
  pageLoad: {
    firstContentfulPaint: 1500, // 1.5초
    largestContentfulPaint: 2500, // 2.5초
    timeToInteractive: 3000 // 3초
  },
  api: {
    responseTime: 1000, // 1초
    errorRate: 0.01 // 1%
  },
  memory: {
    maxHeapSize: 50 * 1024 * 1024, // 50MB
    maxDomNodes: 10000 // 10,000개 노드
  }
};
```

## 🔄 CI/CD 파이프라인 통합

### GitHub Actions 워크플로우
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## 🚀 테스트 실행 가이드

### 개발자 가이드
```bash
# 단위 테스트 실행
npm test                    # 모든 테스트 실행
npm run test:watch         # 감시 모드
npm run test:coverage      # 커버리지 포함

# 특정 테스트 실행
npm test -- --testNamePattern="CampingCard"
npm test -- --testPathPattern="components"

# E2E 테스트 실행
npm run test:e2e           # 헤드리스 모드
npm run test:e2e:headed    # 브라우저 표시
npm run test:e2e:ui        # Playwright UI

# 특정 브라우저에서 E2E 테스트
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### 테스트 작성 가이드라인
1. **명확한 테스트 이름**: 무엇을 테스트하는지 명확히 표현
2. **AAA 패턴**: Arrange, Act, Assert 구조 사용
3. **독립적인 테스트**: 각 테스트가 다른 테스트에 의존하지 않도록
4. **실용적인 테스트**: 비즈니스 가치에 집중
5. **유지보수 가능한 테스트**: 테스트 코드도 프로덕션 코드만큼 중요

---

**이 테스트 전략을 통해 Camping Finder 프로젝트의 품질과 안정성을 보장할 수 있습니다.** 