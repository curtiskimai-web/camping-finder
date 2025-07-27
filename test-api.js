// API 테스트 파일
import axios from 'axios';

// 공공데이터 포털 캠핑장 API 테스트
async function testCampingAPI() {
  console.log('=== 캠핑장 API 테스트 시작 ===');
  
  try {
    // 1. 기본 캠핑장 목록 조회 테스트
    console.log('\n1. 기본 캠핑장 목록 조회 테스트');
    const baseUrl = 'http://apis.data.go.kr/B551011/GoCamping';
    const params = new URLSearchParams({
      serviceKey: 'YOUR_API_KEY_HERE', // 실제 API 키로 교체 필요
      numOfRows: '10',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'CampingFinder',
      _type: 'json'
    });

    const response = await axios.get(`${baseUrl}/basedList?${params}`);
    console.log('응답 상태:', response.status);
    console.log('응답 데이터 구조:', Object.keys(response.data));
    
    if (response.data.response?.header?.resultCode === '00') {
      console.log('✅ API 호출 성공');
      const items = response.data.response.body.items.item;
      console.log(`캠핑장 개수: ${Array.isArray(items) ? items.length : 1}`);
      
      if (Array.isArray(items) && items.length > 0) {
        console.log('첫 번째 캠핑장 정보:');
        console.log('- 이름:', items[0].facltNm);
        console.log('- 주소:', items[0].addr1);
        console.log('- 전화번호:', items[0].tel);
      }
    } else {
      console.log('❌ API 호출 실패');
      console.log('에러 코드:', response.data.response?.header?.resultCode);
      console.log('에러 메시지:', response.data.response?.header?.resultMsg);
    }
    
  } catch (error) {
    console.log('❌ API 테스트 중 오류 발생:');
    if (error.response) {
      console.log('응답 상태:', error.response.status);
      console.log('응답 데이터:', error.response.data);
    } else {
      console.log('네트워크 오류:', error.message);
    }
  }
}

// 2. 지역별 검색 테스트
async function testRegionalSearch() {
  console.log('\n2. 지역별 검색 테스트');
  
  try {
    const baseUrl = 'http://apis.data.go.kr/B551011/GoCamping';
    const params = new URLSearchParams({
      serviceKey: 'YOUR_API_KEY_HERE', // 실제 API 키로 교체 필요
      numOfRows: '5',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'CampingFinder',
      doNm: '강원도', // 강원도 검색
      _type: 'json'
    });

    const response = await axios.get(`${baseUrl}/basedList?${params}`);
    
    if (response.data.response?.header?.resultCode === '00') {
      console.log('✅ 강원도 캠핑장 검색 성공');
      const items = response.data.response.body.items.item;
      console.log(`검색된 캠핑장 개수: ${Array.isArray(items) ? items.length : 1}`);
    } else {
      console.log('❌ 지역별 검색 실패');
    }
    
  } catch (error) {
    console.log('❌ 지역별 검색 테스트 중 오류:', error.message);
  }
}

// 3. 상세 정보 조회 테스트
async function testDetailAPI() {
  console.log('\n3. 상세 정보 조회 테스트');
  
  try {
    const baseUrl = 'http://apis.data.go.kr/B551011/GoCamping';
    const params = new URLSearchParams({
      serviceKey: 'YOUR_API_KEY_HERE', // 실제 API 키로 교체 필요
      contentId: '123456', // 예시 contentId
      MobileOS: 'ETC',
      MobileApp: 'CampingFinder',
      _type: 'json'
    });

    const response = await axios.get(`${baseUrl}/detailList?${params}`);
    
    if (response.data.response?.header?.resultCode === '00') {
      console.log('✅ 상세 정보 조회 성공');
    } else {
      console.log('❌ 상세 정보 조회 실패');
      console.log('에러 메시지:', response.data.response?.header?.resultMsg);
    }
    
  } catch (error) {
    console.log('❌ 상세 정보 조회 테스트 중 오류:', error.message);
  }
}

// 테스트 실행
async function runAllTests() {
  await testCampingAPI();
  await testRegionalSearch();
  await testDetailAPI();
  
  console.log('\n=== API 테스트 완료 ===');
  console.log('\n💡 참고사항:');
  console.log('- 실제 API 키가 필요합니다.');
  console.log('- 공공데이터 포털에서 API 키를 발급받아야 합니다.');
  console.log('- .env 파일에 VITE_CAMPING_API_KEY를 설정하세요.');
}

runAllTests(); 