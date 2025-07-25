# 🔑 API 키 발급 및 설정 가이드

## 📋 개요

Camping Finder 프로젝트에서 사용하는 두 개의 API 키 발급 방법을 안내합니다.

---

## 🏕️ 1. 공공데이터 포털 캠핑장 API

### 1.1 API 키 발급 방법

1. **공공데이터 포털 접속**
   - URL: https://www.data.go.kr/
   - 회원가입 또는 로그인

2. **캠핑장 API 검색**
   - 검색창에 "캠핑장" 입력
   - "국민여가활성화_캠핑장 정보" API 선택

3. **API 신청**
   - "활용신청" 버튼 클릭
   - 신청서 작성 및 제출
   - 승인 대기 (보통 1-2일 소요)

4. **API 키 확인**
   - 승인 후 "마이페이지 > 개발계정 > 일반 인증키"에서 확인
   - 인증키(일반) 복사

### 1.2 API 정보
- **서비스명**: 국민여가활성화_캠핑장 정보
- **제공기관**: 한국관광공사
- **일일 호출 제한**: 1,000회
- **데이터 형식**: JSON

### 1.3 API 엔드포인트
- **기본 정보**: `http://apis.data.go.kr/B551011/GoCamping/basedList`
- **상세 정보**: `http://apis.data.go.kr/B551011/GoCamping/detailList`

---

## 🗺️ 2. Kakao Map API

### 2.1 API 키 발급 방법

1. **Kakao Developers 접속**
   - URL: https://developers.kakao.com/
   - 카카오 계정으로 로그인

2. **애플리케이션 생성**
   - "내 애플리케이션" 클릭
   - "애플리케이션 추가하기" 클릭
   - 앱 이름: "Camping Finder" 입력
   - 사업자명: 개인 또는 회사명 입력

3. **플랫폼 설정**
   - "플랫폼" 메뉴 클릭
   - "Web" 플랫폼 추가
   - 사이트 도메인: `http://localhost:3000` 추가 (개발용)
   - 배포 시 실제 도메인 추가 필요

4. **JavaScript 키 확인**
   - "앱 키" 메뉴에서 "JavaScript 키" 복사

### 2.2 API 정보
- **서비스명**: Kakao Map JavaScript API
- **제공기관**: Kakao
- **일일 호출 제한**: 300,000회
- **무료 사용량**: 월 300,000회

---

## ⚙️ 3. 환경 변수 설정

### 3.1 .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
# 공공데이터 포털 캠핑장 API 키
VITE_CAMPING_API_KEY=your_public_data_api_key_here

# 카카오맵 API 키
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key_here
```

### 3.2 API 키 설정 예시

```env
# 실제 발급받은 API 키로 교체
VITE_CAMPING_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890
VITE_KAKAO_MAP_API_KEY=1234567890abcdef1234567890abcdef
```

### 3.3 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인
- API 키는 외부에 노출되지 않도록 주의

---

## 🧪 4. API 테스트

### 4.1 공공데이터 포털 API 테스트

브라우저에서 다음 URL로 테스트:

```
http://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=YOUR_API_KEY&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=CampingFinder&_type=json
```

### 4.2 Kakao Map API 테스트

개발 서버 실행 후 브라우저 콘솔에서:

```javascript
console.log(window.kakao); // undefined가 아니면 성공
```

---

## 🚨 5. 문제 해결

### 5.1 공공데이터 포털 API 오류

**문제**: "SERVICE_KEY_IS_NOT_REGISTERED_ERROR"
**해결**: API 키가 올바르게 등록되었는지 확인

**문제**: "NO_DATA" 
**해결**: 검색 조건이 너무 구체적일 수 있음, 조건 완화

### 5.2 Kakao Map API 오류

**문제**: "INVALID_APP_KEY"
**해결**: JavaScript 키가 올바른지 확인

**문제**: "DOMAIN_MISMATCH"
**해결**: 플랫폼 설정에서 도메인이 올바르게 등록되었는지 확인

### 5.3 CORS 오류

**문제**: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
**해결**: 
- 공공데이터 포털 API는 CORS 지원
- 프록시 서버 구축 고려

---

## 📞 6. 지원 및 문의

### 6.1 공공데이터 포털
- 고객센터: 02-2133-4274
- 이메일: help@data.go.kr

### 6.2 Kakao Developers
- 고객센터: 1544-2663
- 이메일: support@kakao.com

---

## 📝 7. 체크리스트

- [ ] 공공데이터 포털 회원가입
- [ ] 캠핑장 API 신청 및 승인
- [ ] Kakao Developers 계정 생성
- [ ] Kakao Map 애플리케이션 생성
- [ ] 플랫폼 설정 (Web 도메인 추가)
- [ ] .env 파일 생성
- [ ] API 키 설정
- [ ] API 테스트 실행
- [ ] 개발 서버에서 지도 표시 확인

---

*이 가이드를 따라 API 키를 설정한 후 개발을 진행하세요.* 