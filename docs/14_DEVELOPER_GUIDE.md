# 👨‍💻 Camping Finder - 개발자 가이드

## 📚 문서 개요
**프로젝트명**: Camping Finder  
**버전**: v1.0.0  
**최종 업데이트**: 2024년 1월 4일  
**문서 상태**: 개발자 가이드 설계

## 🎯 개발자 가이드 목표

### 핵심 목표
- **빠른 온보딩**: 새로운 개발자의 빠른 프로젝트 참여
- **일관된 개발**: 팀 전체의 일관된 개발 방식
- **품질 보장**: 코드 품질 및 개발 프로세스 표준화
- **협업 효율성**: 효과적인 팀 협업 및 커뮤니케이션

### 개발 원칙
- **코드 품질 우선**: 깔끔하고 유지보수 가능한 코드 작성
- **문서화**: 코드와 프로세스의 적절한 문서화
- **테스트 주도**: 테스트 가능한 코드 설계
- **지속적 개선**: 개발 프로세스의 지속적 개선

## 🛠️ 개발 환경 설정

### 필수 도구 설치

#### 1. Node.js 및 npm 설정
```bash
# Node.js 버전 확인 (18.x 이상 필요)
node --version
npm --version

# 프로젝트 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드 실행
npm run build

# 테스트 실행
npm test
```

#### 2. 개발 도구 설정
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "css",
    "*.scss": "scss"
  }
}

// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### 3. 환경 변수 설정
```bash
# .env.local 파일 생성
cp env.example .env.local

# 환경 변수 설정
VITE_API_BASE_URL=https://your-api-domain.com
VITE_MAP_API_KEY=your-map-api-key
VITE_ANALYTICS_ID=your-analytics-id
```

### 개발 환경 구성

#### 1. TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 2. ESLint 설정
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

#### 3. Prettier 설정
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}

// .prettierignore
node_modules
dist
build
coverage
*.min.js
*.min.css
```

## 📝 코딩 컨벤션

### TypeScript 코딩 컨벤션

#### 1. 네이밍 컨벤션
```typescript
// 파일명 컨벤션
// 컴포넌트: PascalCase
CampingCard.tsx
SearchFilter.tsx
Map.tsx

// 유틸리티: camelCase
distance.ts
validation.ts
api.ts

// 타입 정의: camelCase
camping.ts
user.ts
api.ts

// 상수: UPPER_SNAKE_CASE
const API_ENDPOINTS = {
  CAMPING: '/api/camping',
  USER: '/api/user'
};

// 변수/함수: camelCase
const campingData = [];
const fetchCampingData = async () => {};

// 컴포넌트: PascalCase
const CampingCard: React.FC<CampingCardProps> = () => {};

// 인터페이스: PascalCase
interface CampingCardProps {
  camping: Camping;
  onSelect: (camping: Camping) => void;
}

// 타입: PascalCase
type CampingStatus = 'available' | 'booked' | 'maintenance';
```

#### 2. 컴포넌트 작성 컨벤션
```typescript
// 컴포넌트 구조 템플릿
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Camping } from '@/types/camping';
import { useCampingData } from '@/hooks/useCampingData';
import './CampingCard.css';

// Props 인터페이스 정의
interface CampingCardProps {
  camping: Camping;
  onSelect: (camping: Camping) => void;
  isSelected?: boolean;
  className?: string;
}

// 컴포넌트 정의
export const CampingCard: React.FC<CampingCardProps> = React.memo(({
  camping,
  onSelect,
  isSelected = false,
  className = ''
}) => {
  // 상태 정의
  const [isLoading, setIsLoading] = useState(false);
  
  // 커스텀 훅 사용
  const { data, error } = useCampingData(camping.id);
  
  // 이벤트 핸들러
  const handleClick = useCallback(() => {
    onSelect(camping);
  }, [camping, onSelect]);
  
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  // 계산된 값
  const cardClassName = useMemo(() => {
    return `camping-card ${isSelected ? 'selected' : ''} ${className}`.trim();
  }, [isSelected, className]);
  
  // 사이드 이펙트
  useEffect(() => {
    if (camping.imageUrl) {
      setIsLoading(true);
    }
  }, [camping.imageUrl]);
  
  // 조기 반환
  if (error) {
    return <div className="camping-card-error">로딩 중 오류가 발생했습니다.</div>;
  }
  
  // 렌더링
  return (
    <div 
      className={cardClassName}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="camping-card-image">
        {isLoading && <div className="loading-spinner" />}
        <img 
          src={camping.imageUrl} 
          alt={camping.name}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
      
      <div className="camping-card-content">
        <h3 className="camping-card-title">{camping.name}</h3>
        <p className="camping-card-address">{camping.address}</p>
        <p className="camping-card-price">{camping.price}</p>
      </div>
    </div>
  );
});

// 디스플레이 네임 설정
CampingCard.displayName = 'CampingCard';
```

#### 3. 훅 작성 컨벤션
```typescript
// 커스텀 훅 템플릿
import { useState, useEffect, useCallback, useRef } from 'react';
import { Camping } from '@/types/camping';
import { campingApi } from '@/services/campingApi';

// 훅 인터페이스 정의
interface UseCampingDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: Camping[]) => void;
  onError?: (error: Error) => void;
}

interface UseCampingDataReturn {
  data: Camping[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// 커스텀 훅 정의
export const useCampingData = (
  options: UseCampingDataOptions = {}
): UseCampingDataReturn => {
  const {
    enabled = true,
    refetchInterval,
    onSuccess,
    onError
  } = options;
  
  // 상태 정의
  const [data, setData] = useState<Camping[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // ref 사용
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 데이터 페칭 함수
  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await campingApi.getCampings({
        signal: abortControllerRef.current.signal
      });
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, onSuccess, onError]);
  
  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // 자동 리페칭 설정
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(fetchData, refetchInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, fetchData]);
  
  // 정리 함수
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
```

#### 4. 타입 정의 컨벤션
```typescript
// 타입 정의 파일 구조
// src/types/camping.ts

// 기본 타입 정의
export interface Camping {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  facilities: string[];
  price: string;
  rating: number;
  imageUrl?: string;
  description?: string;
}

// API 응답 타입
export interface CampingApiResponse {
  data: Camping[];
  total: number;
  page: number;
  limit: number;
}

// 필터 타입
export interface CampingFilter {
  region?: string;
  facilities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
}

// 정렬 타입
export type CampingSortBy = 'name' | 'price' | 'rating' | 'distance';
export type CampingSortOrder = 'asc' | 'desc';

// 유니온 타입
export type CampingStatus = 'available' | 'booked' | 'maintenance' | 'closed';

// 제네릭 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 유틸리티 타입
export type CampingWithoutId = Omit<Camping, 'id'>;
export type CampingPreview = Pick<Camping, 'id' | 'name' | 'address' | 'rating'>;
export type CampingRequired = Required<Camping>;
export type CampingPartial = Partial<Camping>;

// 함수 타입
export type CampingSelectHandler = (camping: Camping) => void;
export type CampingFilterHandler = (filter: CampingFilter) => void;
export type CampingSortHandler = (sortBy: CampingSortBy, order: CampingSortOrder) => void;
```

### CSS/스타일링 컨벤션

#### 1. CSS 클래스 네이밍
```css
/* BEM 방법론 사용 */
.camping-card { /* Block */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.camping-card--selected { /* Modifier */
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.camping-card__image { /* Element */
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.camping-card__title { /* Element */
  font-size: 18px;
  font-weight: 600;
  margin: 8px 0;
}

.camping-card__price { /* Element */
  color: #007bff;
  font-weight: 500;
}

/* 상태 클래스 */
.camping-card--loading {
  opacity: 0.6;
  pointer-events: none;
}

.camping-card--error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

/* 반응형 클래스 */
@media (max-width: 768px) {
  .camping-card {
    padding: 12px;
  }
  
  .camping-card__title {
    font-size: 16px;
  }
}
```

#### 2. CSS 변수 사용
```css
/* CSS 변수 정의 */
:root {
  /* 색상 */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  
  /* 텍스트 색상 */
  --color-text-primary: #212529;
  --color-text-secondary: #6c757d;
  --color-text-muted: #868e96;
  
  /* 배경 색상 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #e9ecef;
  
  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 폰트 크기 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* 폰트 무게 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 테두리 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* 그림자 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 컴포넌트에서 CSS 변수 사용 */
.camping-card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.camping-card__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.camping-card__price {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
```

## 🔄 Git 워크플로우

### 브랜치 전략

#### 1. Git Flow 브랜치 구조
```bash
# 메인 브랜치
main          # 프로덕션 배포용
develop       # 개발 통합용

# 기능 브랜치
feature/      # 새로운 기능 개발
bugfix/       # 버그 수정
hotfix/       # 긴급 수정
release/      # 릴리스 준비

# 브랜치 네이밍 컨벤션
feature/add-camping-reviews
feature/improve-search-performance
bugfix/fix-map-marker-click
hotfix/fix-api-endpoint-error
release/v1.1.0
```

#### 2. 브랜치 생성 및 관리
```bash
# 개발 브랜치에서 시작
git checkout develop
git pull origin develop

# 기능 브랜치 생성
git checkout -b feature/add-camping-reviews

# 작업 후 커밋
git add .
git commit -m "feat: 캠핑장 리뷰 기능 추가

- 리뷰 작성 폼 컴포넌트 구현
- 리뷰 목록 표시 기능 추가
- 리뷰 평점 계산 로직 구현

Closes #123"

# 원격 브랜치에 푸시
git push origin feature/add-camping-reviews

# Pull Request 생성
# GitHub에서 develop 브랜치로 PR 생성
```

#### 3. 커밋 메시지 컨벤션
```bash
# 커밋 타입
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가 또는 수정
chore: 빌드 프로세스 또는 보조 도구 변경

# 커밋 메시지 예시
feat: 캠핑장 검색 필터 기능 추가

- 지역별 필터링 기능 구현
- 가격 범위 필터링 기능 구현
- 시설별 필터링 기능 구현

Closes #123

fix: 지도 마커 클릭 이벤트 수정

- 마커 클릭 시 팝업이 표시되지 않는 문제 해결
- 이벤트 핸들러 등록 로직 개선

Fixes #456

refactor: 컴포넌트 구조 개선

- CampingCard 컴포넌트를 더 작은 단위로 분리
- 성능 최적화를 위한 React.memo 적용
- 타입 안전성 개선

BREAKING CHANGE: CampingCard 컴포넌트의 props 구조 변경
```

### Pull Request 프로세스

#### 1. PR 템플릿
```markdown
<!-- .github/pull_request_template.md -->
## 📝 변경 사항

### 변경 유형
- [ ] 버그 수정
- [ ] 새로운 기능
- [ ] 기존 기능 개선
- [ ] 문서 업데이트
- [ ] 스타일 변경
- [ ] 리팩토링
- [ ] 성능 개선
- [ ] 테스트 추가

### 변경 내용
<!-- 변경된 내용을 간단히 설명해주세요 -->

### 관련 이슈
<!-- 관련된 이슈 번호를 입력해주세요 -->
Closes #

## 🧪 테스트

### 테스트 완료 항목
- [ ] 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 수동 테스트 완료

### 테스트 시나리오
<!-- 테스트한 시나리오를 설명해주세요 -->

## 📸 스크린샷
<!-- UI 변경사항이 있다면 스크린샷을 첨부해주세요 -->

## ✅ 체크리스트
- [ ] 코드가 프로젝트 스타일 가이드를 따릅니다
- [ ] 자체 코드 리뷰를 완료했습니다
- [ ] 코드에 충분한 주석을 추가했습니다
- [ ] 관련 문서를 업데이트했습니다
- [ ] 변경사항이 새로운 경고를 발생시키지 않습니다
- [ ] 테스트를 추가했으며, 기존 테스트가 통과합니다

## 📋 추가 정보
<!-- 추가적인 정보나 컨텍스트가 있다면 여기에 작성해주세요 -->
```

#### 2. PR 리뷰 체크리스트
```markdown
## 🔍 코드 리뷰 체크리스트

### 코드 품질
- [ ] 코드가 읽기 쉽고 이해하기 쉬운가?
- [ ] 적절한 네이밍 컨벤션을 따르는가?
- [ ] 중복 코드가 없는가?
- [ ] 함수와 클래스가 단일 책임을 가지는가?

### 기능성
- [ ] 요구사항을 올바르게 구현했는가?
- [ ] 에러 처리가 적절한가?
- [ ] 엣지 케이스를 고려했는가?
- [ ] 성능에 영향을 주지 않는가?

### 보안
- [ ] 보안 취약점이 없는가?
- [ ] 사용자 입력을 적절히 검증하는가?
- [ ] 민감한 정보가 노출되지 않는가?

### 테스트
- [ ] 충분한 테스트 커버리지가 있는가?
- [ ] 테스트가 의미있는 시나리오를 다루는가?
- [ ] 테스트가 독립적이고 반복 가능한가?

### 문서화
- [ ] 코드에 적절한 주석이 있는가?
- [ ] README나 문서가 업데이트되었는가?
- [ ] API 변경사항이 문서화되었는가?
```

## 👥 코드 리뷰 프로세스

### 리뷰 프로세스

#### 1. 리뷰 단계
```typescript
// 코드 리뷰 워크플로우
interface CodeReviewWorkflow {
  // 1. 자동 검사
  automated: {
    linting: boolean;
    testing: boolean;
    security: boolean;
    performance: boolean;
  };
  
  // 2. 동료 리뷰
  peerReview: {
    required: number; // 필요한 리뷰어 수
    approvers: string[]; // 승인자 목록
    timeLimit: number; // 리뷰 시간 제한 (시간)
  };
  
  // 3. 리뷰 기준
  criteria: {
    codeQuality: string[];
    functionality: string[];
    security: string[];
    performance: string[];
    testing: string[];
  };
  
  // 4. 리뷰 결과
  outcomes: {
    approved: string;
    changesRequested: string;
    rejected: string;
  };
}
```

#### 2. 리뷰 코멘트 가이드라인
```markdown
## 💬 리뷰 코멘트 작성 가이드

### 코멘트 유형
- **질문**: 이해가 안 되는 부분에 대한 질문
- **제안**: 개선 방안 제안
- **지적**: 문제점이나 버그 지적
- **칭찬**: 잘한 부분에 대한 긍정적 피드백

### 코멘트 작성 예시

#### 질문
```typescript
// 이 함수가 언제 호출되는지 설명해주실 수 있나요?
const handleClick = () => {
  // ...
};
```

#### 제안
```typescript
// 성능을 위해 useCallback을 사용하는 것을 고려해보세요
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

#### 지적
```typescript
// 이 부분에서 메모리 누수가 발생할 수 있습니다
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  // cleanup 함수가 필요합니다
}, []);
```

#### 칭찬
```typescript
// 좋은 에러 처리 방식입니다!
try {
  // ...
} catch (error) {
  console.error('Error occurred:', error);
  // 사용자에게 적절한 에러 메시지 표시
}
```
```

#### 3. 리뷰 도구 설정
```json
// .github/reviewers.yml
# 자동 리뷰어 할당
reviewers:
  - username1
  - username2

# 특정 파일 패턴에 대한 리뷰어
pull_request_reviews:
  - name: "Frontend Review"
    paths:
      - "src/components/**"
      - "src/hooks/**"
    reviewers:
      - frontend-reviewer1
      - frontend-reviewer2
  
  - name: "Backend Review"
    paths:
      - "api/**"
      - "src/services/**"
    reviewers:
      - backend-reviewer1
      - backend-reviewer2
  
  - name: "Security Review"
    paths:
      - "**/*.js"
      - "**/*.ts"
      - "**/*.tsx"
    reviewers:
      - security-reviewer
```

## 📚 개발 문서화

### 코드 문서화

#### 1. JSDoc 주석 작성
```typescript
/**
 * 캠핑장 정보를 표시하는 카드 컴포넌트
 * 
 * @param camping - 표시할 캠핑장 정보
 * @param onSelect - 캠핑장 선택 시 호출되는 콜백 함수
 * @param isSelected - 선택된 상태 여부
 * @param className - 추가 CSS 클래스명
 * 
 * @example
 * ```tsx
 * <CampingCard
 *   camping={campingData}
 *   onSelect={(camping) => console.log('Selected:', camping)}
 *   isSelected={true}
 * />
 * ```
 * 
 * @returns 캠핑장 카드 JSX 요소
 */
export const CampingCard: React.FC<CampingCardProps> = ({ ... }) => {
  // ...
};

/**
 * 캠핑장 데이터를 가져오는 커스텀 훅
 * 
 * @param options - 훅 옵션
 * @param options.enabled - 데이터 페칭 활성화 여부
 * @param options.refetchInterval - 자동 리페칭 간격 (ms)
 * @param options.onSuccess - 성공 시 콜백
 * @param options.onError - 에러 시 콜백
 * 
 * @returns 캠핑장 데이터와 상태 정보
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCampingData({
 *   enabled: true,
 *   refetchInterval: 30000,
 *   onSuccess: (data) => console.log('Data loaded:', data)
 * });
 * ```
 */
export const useCampingData = (options: UseCampingDataOptions = {}) => {
  // ...
};
```

#### 2. README 문서 작성
```markdown
# Camping Finder

캠핑장 검색 및 정보 제공 웹 애플리케이션

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18.x 이상
- npm 9.x 이상

### 설치
```bash
# 저장소 클론
git clone https://github.com/your-username/camping-finder.git
cd camping-finder

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env.local
# .env.local 파일을 편집하여 필요한 값들을 설정하세요

# 개발 서버 실행
npm run dev
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🛠️ 개발

### 스크립트
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run test` - 테스트 실행
- `npm run test:coverage` - 테스트 커버리지 확인
- `npm run lint` - ESLint 검사
- `npm run lint:fix` - ESLint 자동 수정
- `npm run format` - Prettier 포맷팅

### 프로젝트 구조
```
src/
├── components/     # React 컴포넌트
├── hooks/         # 커스텀 훅
├── services/      # API 서비스
├── types/         # TypeScript 타입 정의
├── utils/         # 유틸리티 함수
└── pages/         # 페이지 컴포넌트
```

### 코딩 컨벤션
- TypeScript 사용
- ESLint + Prettier 설정 준수
- 컴포넌트는 함수형 컴포넌트 사용
- 커스텀 훅으로 로직 분리
- 적절한 타입 정의

## 🧪 테스트

### 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

### 테스트 구조
- `__tests__/` - 테스트 파일
- `*.test.ts` - 단위 테스트
- `*.spec.ts` - 통합 테스트

## 📦 배포

### Vercel 배포
1. GitHub 저장소를 Vercel에 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 수동 배포
```bash
npm run build
# dist 폴더의 내용을 웹 서버에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/camping-finder](https://github.com/your-username/camping-finder)
```

## 📋 개발 체크리스트

### 새 기능 개발 체크리스트
- [ ] 요구사항 분석 및 설계
- [ ] 브랜치 생성 (`feature/기능명`)
- [ ] 코드 구현
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 코드 리뷰 요청
- [ ] 문서 업데이트
- [ ] Pull Request 생성
- [ ] 리뷰 피드백 반영
- [ ] 메인 브랜치 병합

### 버그 수정 체크리스트
- [ ] 버그 재현 및 분석
- [ ] 브랜치 생성 (`bugfix/버그명`)
- [ ] 수정 코드 작성
- [ ] 테스트 케이스 추가
- [ ] 수정 사항 검증
- [ ] 코드 리뷰 요청
- [ ] Pull Request 생성
- [ ] 메인 브랜치 병합

### 릴리스 체크리스트
- [ ] 모든 테스트 통과 확인
- [ ] 성능 테스트 완료
- [ ] 보안 검사 완료
- [ ] 문서 업데이트
- [ ] 버전 태그 생성
- [ ] 릴리스 노트 작성
- [ ] 배포 실행
- [ ] 배포 후 검증

---

**이 개발자 가이드를 통해 Camping Finder 프로젝트의 일관되고 효율적인 개발을 보장할 수 있습니다.** 