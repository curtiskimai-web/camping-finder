# 🏕️ Camping Finder

한국의 캠핑장을 찾고 지도에서 확인할 수 있는 React 웹 애플리케이션입니다.

## ✨ 주요 기능

- **자동 데이터 로딩**: 페이지 로드 시 자동으로 캠핑장 데이터 로드
- **지역별 검색**: 도/시군구별 캠핑장 필터링
- **고정 헤더 테이블**: 스크롤 시 헤더가 고정된 테이블 뷰
- **정렬 기능**: 캠핑장명, 거리순 정렬
- **페이지네이션**: 100개씩 페이지 분할
- **지도 연동**: OpenStreetMap을 사용한 인터랙티브 지도
- **현재 위치**: 사용자의 현재 위치 표시 및 거리 계산
- **경로 표시**: 현재 위치에서 선택된 캠핑장까지의 경로

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **스타일링**: Styled Components
- **빌드 도구**: Vite
- **지도**: OpenStreetMap + Leaflet
- **API**: 공공데이터 포털 (한국관광공사 고캠핑 API)

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/camping-finder.git
cd camping-finder
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 API 키를 설정하세요:
```env
VITE_CAMPING_API_KEY=your_api_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📊 API 키 발급

1. [공공데이터 포털](https://www.data.go.kr/)에 가입
2. "한국관광공사 고캠핑 API" 검색
3. API 신청 및 승인 대기
4. 승인 후 서비스 키 발급
5. 디코딩된 키를 `.env` 파일에 설정

## 🎯 사용법

1. **페이지 접속**: 자동으로 캠핑장 데이터가 로드됩니다
2. **지역 선택**: 도/시군구 드롭다운에서 원하는 지역 선택
3. **캠핑장 선택**: 테이블에서 원하는 캠핑장 클릭
4. **지도 확인**: 우측 지도에서 캠핑장 위치와 경로 확인
5. **정렬**: 테이블 헤더 클릭으로 정렬 변경

## 📁 프로젝트 구조

```
camping-finder/
├── src/
│   ├── components/
│   │   ├── CampingList.tsx      # 캠핑장 목록 테이블
│   │   ├── Map.tsx              # 지도 컴포넌트
│   │   ├── SearchFilter.tsx     # 검색 필터
│   │   └── Header.tsx           # 헤더
│   ├── services/
│   │   └── campingApi.ts        # API 서비스
│   ├── types/
│   │   └── camping.ts           # 타입 정의
│   ├── utils/
│   │   └── distance.ts          # 거리 계산 유틸리티
│   ├── App.tsx                  # 메인 앱 컴포넌트
│   └── main.tsx                 # 앱 진입점
├── docs/
│   └── CHECKPOINT_2024_01_04.md # 프로젝트 상태 문서
├── .env                         # 환경 변수
└── README.md                    # 프로젝트 설명
```

## 🎨 주요 컴포넌트

### CampingList.tsx
- 고정 헤더 테이블
- 페이지네이션
- 정렬 기능
- 거리 표시

### Map.tsx
- OpenStreetMap 렌더링
- 현재 위치 감지
- 마커 관리
- 경로 그리기

### SearchFilter.tsx
- 도/시군구 선택
- 동적 필터 옵션
- 실시간 필터링

## 🔧 개발 환경

- **Node.js**: 16.x 이상
- **npm**: 8.x 이상
- **브라우저**: Chrome, Firefox, Safari, Edge

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Camping Finder** - 한국의 캠핑장을 쉽게 찾아보세요! 🏕️✨ 