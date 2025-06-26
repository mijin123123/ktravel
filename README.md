# TRIP STORE - 해외여행 여행사 웹사이트

해외여행 전문 여행사 TRIP STORE의 공식 웹사이트입니다. 
다양한 해외여행 패키지 상품을 검색하고 예약할 수 있습니다.

## 주요 기능

- 다양한 해외여행 패키지 검색 및 필터링
- 여행 패키지 상세 정보 및 일정 확인
- 온라인 예약 및 결제 시스템
- 회원 가입 및 로그인
- 후기 작성 및 조회

## 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS
- **상태 관리**: React Context API
- **라우팅**: React Router
- **스타일링**: Tailwind CSS
- **API 통신**: Axios

## 개발 환경 설정

### 필수 요구사항

- Node.js (v14.0.0 이상)
- npm 또는 yarn

### 설치 방법

1. 저장소 클론
   ```
   git clone https://github.com/your-username/trip-store.git
   cd trip-store
   ```

2. 의존성 설치
   ```
   npm install
   ```

3. 개발 서버 실행
   ```
   npm run dev
   ```

4. 브라우저에서 `http://localhost:3000`으로 접속

### 빌드

```
npm run build
```

## 프로젝트 구조

```
trip-store/
├── public/             # 정적 파일
├── src/                # 소스 코드
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   └── layout/     # 레이아웃 관련 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── utils/          # 유틸리티 함수
│   ├── types/          # TypeScript 타입 정의
│   ├── App.tsx         # 앱의 메인 컴포넌트
│   └── main.tsx        # 앱의 진입점
├── index.html          # HTML 템플릿
├── vite.config.ts      # Vite 설정
└── package.json        # 프로젝트 메타데이터와 의존성
```

## 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션용 빌드
- `npm run lint`: 린트 실행
- `npm run preview`: 빌드된 앱 미리보기

## 라이선스

MIT
