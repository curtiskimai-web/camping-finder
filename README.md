# 🏕️ Camping Finder

공공데이터 포털 API를 활용한 실시간 캠핑장 조회 웹사이트입니다.

## ✨ 주요 기능

- **실시간 캠핑장 조회**: 공공데이터 포털 API 연동
- **지역별 검색**: 시/도, 시/군/구별 필터링
- **시설 필터**: 전기, 온수, 샤워장, 화장실 등 시설별 검색
- **가격대 필터**: 무료/유료 캠핑장 구분
- **지도 연동**: 카카오맵을 통한 위치 확인
- **상세 정보**: 캠핑장별 상세 정보 및 예약 상태
- **반응형 디자인**: 모바일/데스크톱 최적화

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Map API**: Kakao Map API
- **Data API**: 공공데이터 포털 캠핑장 API

## 🚀 시작하기

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd camping-finder
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일을 편집하여 API 키를 설정하세요:
```env
VITE_CAMPING_API_KEY=your_public_data_api_key_here
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📋 API 키 발급 방법

### 공공데이터 포털 API 키
1. [공공데이터 포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "캠핑장 정보" API 검색
4. API 신청 및 승인 대기
5. 승인 후 발급받은 키를 `.env` 파일에 설정

### 카카오맵 API 키
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. JavaScript 키 발급
4. 발급받은 키를 `.env` 파일에 설정

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.tsx      # 헤더 컴포넌트
│   ├── SearchFilter.tsx # 검색 필터 컴포넌트
│   ├── CampingList.tsx # 캠핑장 리스트 컴포넌트
│   ├── CampingCard.tsx # 캠핑장 카드 컴포넌트
│   └── Map.tsx         # 지도 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈페이지
│   └── DetailPage.tsx  # 상세페이지
├── services/           # API 서비스
│   └── campingApi.ts   # 캠핑장 API 서비스
├── types/              # TypeScript 타입 정의
│   └── camping.ts      # 캠핑장 관련 타입
├── utils/              # 유틸리티 함수
├── styles/             # 스타일 파일
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 앱 진입점
```

## 🔧 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 결과 미리보기
```bash
npm run preview
```

## 📱 주요 화면

### 홈페이지
- 좌측: 검색 필터 + 캠핑장 리스트
- 우측: 카카오맵 (캠핑장 위치 표시)

### 상세페이지
- 캠핑장 기본 정보
- 시설 정보
- 이용 안내
- 예약 정보

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요. 