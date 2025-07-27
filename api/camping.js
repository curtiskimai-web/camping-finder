export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { serviceKey, numOfRows, pageNo, MobileOS, MobileApp, _type, doNm, sigunguNm } = req.query;
    
    // 공공데이터 포털 API URL 구성
    const apiUrl = new URL('http://apis.data.go.kr/B551011/GoCamping/basedList');
    apiUrl.searchParams.set('serviceKey', serviceKey);
    apiUrl.searchParams.set('numOfRows', numOfRows || '10000');
    apiUrl.searchParams.set('pageNo', pageNo || '1');
    apiUrl.searchParams.set('MobileOS', MobileOS || 'ETC');
    apiUrl.searchParams.set('MobileApp', MobileApp || 'CampingFinder');
    apiUrl.searchParams.set('_type', _type || 'json');
    
    if (doNm) apiUrl.searchParams.set('doNm', doNm);
    if (sigunguNm) apiUrl.searchParams.set('sigunguNm', sigunguNm);

    console.log('프록시 API 호출:', apiUrl.toString());

    // 공공데이터 포털 API 호출
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 전송
    res.status(200).json(data);
    
  } catch (error) {
    console.error('프록시 API 오류:', error);
    res.status(500).json({ 
      error: 'API 호출 실패', 
      message: error.message 
    });
  }
} 