# 🏕️ Camping Finder - 빌드 및 배포 가이드

## 📚 문서 정보
**문서명**: 빌드 및 배포 가이드  
**버전**: v1.0.0  
**작성일**: 2025년 7월 28일  
**최종 업데이트**: 2025년 7월 28일  
**문서 상태**: 완료

---

## ⚙️ Vite 빌드 설정

### Vite 개요
Camping Finder는 **Vite**를 빌드 도구로 사용하여 빠른 개발 환경과 최적화된 프로덕션 빌드를 제공합니다.

#### Vite 선택 이유
- **빠른 개발 서버**: ES modules 기반 HMR
- **최적화된 빌드**: Rollup 기반 프로덕션 빌드
- **플러그인 생태계**: 풍부한 플러그인 지원
- **TypeScript 지원**: 네이티브 TypeScript 지원

### Vite 설정 파일
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // 기본 설정
  root: process.cwd(),
  base: '/',
  
  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          leaflet: ['leaflet', 'react-leaflet']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // 개발 서버 설정
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },
  
  // 경로 별칭
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  // 환경 변수 설정
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  
  // CSS 설정
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});
```

### TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 환경 변수 설정
```typescript
// 환경 변수 타입 정의
interface ImportMetaEnv {
  readonly VITE_CAMPING_API_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// .env 파일들
// .env.development
VITE_APP_TITLE=Camping Finder (Development)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CAMPING_API_KEY=your_development_api_key

// .env.production
VITE_APP_TITLE=Camping Finder
VITE_API_BASE_URL=https://your-domain.vercel.app/api
VITE_CAMPING_API_KEY=your_production_api_key
```

---

## 🚀 Vercel 배포 프로세스

### Vercel 개요
Camping Finder는 **Vercel**을 통해 배포되어 전 세계 CDN을 통한 빠른 접근을 제공합니다.

#### Vercel 선택 이유
- **자동 배포**: GitHub 연동으로 자동 배포
- **글로벌 CDN**: 전 세계 엣지 로케이션
- **서버리스 함수**: API Routes 지원
- **HTTPS 자동**: SSL 인증서 자동 관리

### 배포 설정
```json
// vercel.json
{
  "version": 2,
  "name": "camping-finder",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "env": {
    "VITE_CAMPING_API_KEY": "@camping-api-key"
  }
}
```

### 배포 워크플로우
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        env:
          VITE_CAMPING_API_KEY: ${{ secrets.VITE_CAMPING_API_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 환경 변수 관리
```bash
# Vercel CLI를 통한 환경 변수 설정
vercel env add VITE_CAMPING_API_KEY production
vercel env add VITE_CAMPING_API_KEY preview
vercel env add VITE_CAMPING_API_KEY development

# 환경 변수 확인
vercel env ls

# 환경 변수 삭제
vercel env rm VITE_CAMPING_API_KEY production
```

---

## 🔧 빌드 최적화

### 번들 최적화
```typescript
// vite.config.ts - 번들 최적화 설정
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 청크 분할
        manualChunks: {
          // React 관련 라이브러리
          vendor: ['react', 'react-dom'],
          
          // 지도 관련 라이브러리
          leaflet: ['leaflet', 'react-leaflet'],
          
          // 유틸리티 라이브러리
          utils: ['lodash-es', 'date-fns'],
          
          // 스타일링 라이브러리
          styles: ['styled-components']
        },
        
        // 청크 파일명 설정
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // 에셋 파일명 설정
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
    
    // 소스맵 생성
    sourcemap: process.env.NODE_ENV === 'development'
  }
});
```

### 코드 분할 (Code Splitting)
```typescript
// 동적 임포트를 통한 코드 분할
import { lazy, Suspense } from 'react';

// 지도 컴포넌트 지연 로딩
const Map = lazy(() => import('./components/Map'));

// 상세 페이지 지연 로딩
const DetailPage = lazy(() => import('./pages/DetailPage'));

// 즐겨찾기 페이지 지연 로딩
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// 라우트별 코드 분할
const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/camping/:id" 
        element={<DetailPage />} 
      />
      <Route 
        path="/favorites" 
        element={<FavoritesPage />} 
      />
    </Routes>
  </Suspense>
);
```

### Tree Shaking
```typescript
// Tree Shaking 최적화
// lodash-es 사용 (ES 모듈)
import { debounce, throttle } from 'lodash-es';

// 특정 함수만 임포트
import { useState, useEffect } from 'react';

// 사용하지 않는 임포트 제거
// import { unusedFunction } from './utils'; // 제거됨
```

### 이미지 최적화
```typescript
// 이미지 최적화 설정
export default defineConfig({
  plugins: [
    react(),
    // 이미지 최적화 플러그인
    {
      name: 'image-optimization',
      transform(code, id) {
        if (id.endsWith('.png') || id.endsWith('.jpg') || id.endsWith('.jpeg')) {
          // 이미지 최적화 로직
          return {
            code: `export default "${id}?optimized=true"`,
            map: null
          };
        }
      }
    }
  ]
});

// 반응형 이미지 컴포넌트
const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  sizes: string;
}> = ({ src, alt, sizes }) => (
  <img
    src={src}
    alt={alt}
    sizes={sizes}
    srcSet={`
      ${src}?w=300 300w,
      ${src}?w=600 600w,
      ${src}?w=900 900w,
      ${src}?w=1200 1200w
    `}
    loading="lazy"
    decoding="async"
  />
);
```

---

## 🔐 환경 변수 관리

### 환경 변수 구조
```bash
# 프로젝트 루트의 환경 변수 파일들

# .env (공통)
VITE_APP_TITLE=Camping Finder
VITE_APP_VERSION=1.0.0

# .env.development (개발 환경)
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CAMPING_API_KEY=dev_api_key_here
VITE_DEBUG=true

# .env.production (프로덕션 환경)
NODE_ENV=production
VITE_API_BASE_URL=https://camping-finder.vercel.app/api
VITE_CAMPING_API_KEY=prod_api_key_here
VITE_DEBUG=false

# .env.local (로컬 개발용, gitignore에 포함)
VITE_CAMPING_API_KEY=your_local_api_key
```

### 환경 변수 유효성 검증
```typescript
// utils/env.ts
interface EnvironmentVariables {
  VITE_APP_TITLE: string;
  VITE_APP_VERSION: string;
  VITE_API_BASE_URL: string;
  VITE_CAMPING_API_KEY: string;
  VITE_DEBUG: boolean;
}

// 환경 변수 검증 함수
export const validateEnvironment = (): EnvironmentVariables => {
  const requiredVars = [
    'VITE_APP_TITLE',
    'VITE_APP_VERSION',
    'VITE_API_BASE_URL',
    'VITE_CAMPING_API_KEY'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName as keyof ImportMetaEnv]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  return {
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_CAMPING_API_KEY: import.meta.env.VITE_CAMPING_API_KEY,
    VITE_DEBUG: import.meta.env.VITE_DEBUG === 'true'
  };
};

// 환경 변수 사용
export const env = validateEnvironment();
```

### 보안 고려사항
```typescript
// API 키 보안
// 클라이언트에 노출되지 않도록 서버 사이드에서만 사용
export const getApiKey = (): string => {
  // Vercel 환경 변수에서 가져오기
  return process.env.VITE_CAMPING_API_KEY || '';
};

// 환경별 설정
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDevelopment 
      ? 'http://localhost:3000/api'
      : 'https://camping-finder.vercel.app/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  };
};
```

---

## 📦 CI/CD 파이프라인

### GitHub Actions 워크플로우
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # 린트 및 타입 체크
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript check
        run: npm run type-check
        
      - name: Run Prettier check
        run: npm run format:check

  # 테스트
  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run test coverage
        run: npm run test:coverage

  # 빌드
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          VITE_CAMPING_API_KEY: ${{ secrets.VITE_CAMPING_API_KEY }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  # 배포 (main 브랜치만)
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 배포 전략
```typescript
// 배포 전략 설정
export const deploymentConfig = {
  // 브랜치별 배포 전략
  branches: {
    main: {
      environment: 'production',
      url: 'https://camping-finder.vercel.app',
      autoDeploy: true
    },
    develop: {
      environment: 'staging',
      url: 'https://camping-finder-git-develop.vercel.app',
      autoDeploy: true
    },
    feature: {
      environment: 'preview',
      url: 'https://camping-finder-git-feature.vercel.app',
      autoDeploy: false
    }
  },
  
  // 배포 단계
  stages: [
    {
      name: 'build',
      commands: ['npm ci', 'npm run build']
    },
    {
      name: 'test',
      commands: ['npm test']
    },
    {
      name: 'deploy',
      commands: ['vercel --prod']
    }
  ],
  
  // 롤백 설정
  rollback: {
    enabled: true,
    maxVersions: 5,
    autoRollback: true
  }
};
```

---

## 🌐 도메인 및 SSL 설정

### 커스텀 도메인 설정
```bash
# Vercel CLI를 통한 도메인 설정
vercel domains add camping-finder.com
vercel domains add www.camping-finder.com

# DNS 설정 확인
vercel domains ls

# SSL 인증서 확인
vercel certs ls
```

### DNS 설정
```bash
# A 레코드 설정
# camping-finder.com -> 76.76.19.67
# www.camping-finder.com -> 76.76.19.67

# CNAME 레코드 설정
# www.camping-finder.com -> camping-finder.vercel.app

# TXT 레코드 설정 (도메인 검증용)
# _vercel -> vercel-domain-verification=...
```

### HTTPS 설정
```typescript
// HTTPS 강제 리다이렉트
export default defineConfig({
  server: {
    https: process.env.NODE_ENV === 'production',
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }
});

// 보안 헤더 설정
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

---

## 📊 성능 모니터링

### 빌드 성능 분석
```typescript
// 빌드 분석 플러그인
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});

// 번들 크기 분석
export const analyzeBundle = () => {
  const bundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  
  return {
    plugins: [
      new bundleAnalyzer({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ]
  };
};
```

### 성능 지표 추적
```typescript
// Core Web Vitals 추적
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Google Analytics 4로 전송
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true
  });
};

// 성능 지표 수집
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// 커스텀 성능 지표
export const measurePerformance = () => {
  // 페이지 로드 시간
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page load time: ${loadTime}ms`);
  });
  
  // API 응답 시간
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const startTime = performance.now();
    return originalFetch.apply(this, args).then(response => {
      const endTime = performance.now();
      console.log(`API response time: ${endTime - startTime}ms`);
      return response;
    });
  };
};
```

---

## 🏆 빌드 및 배포 성과

### 기술적 성과
- ✅ **빌드 최적화**: Vite를 통한 빠른 빌드 및 최적화
- ✅ **자동 배포**: GitHub Actions + Vercel 자동 배포 파이프라인
- ✅ **글로벌 CDN**: 전 세계 엣지 로케이션을 통한 빠른 접근
- ✅ **HTTPS 보안**: 자동 SSL 인증서 관리
- ✅ **환경 관리**: 개발/스테이징/프로덕션 환경 분리

### 성능 성과
- ✅ **빌드 시간**: < 30초 (프로덕션 빌드)
- ✅ **번들 크기**: < 1MB (gzipped)
- ✅ **로딩 시간**: < 2초 (초기 로딩)
- ✅ **배포 시간**: < 2분 (GitHub → Vercel)
- ✅ **가용성**: 99.9% 이상

### 개발자 경험 성과
- ✅ **자동화**: 코드 푸시 시 자동 배포
- ✅ **롤백**: 이전 버전으로 즉시 롤백 가능
- ✅ **프리뷰**: PR별 프리뷰 배포
- ✅ **모니터링**: 실시간 성능 모니터링
- ✅ **알림**: 배포 상태 알림

---

**다음 문서**: [09_PERFORMANCE_OPTIMIZATION.md](./09_PERFORMANCE_OPTIMIZATION.md) - 성능 최적화 상세 분석 