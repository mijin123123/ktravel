<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# K-Travel 프로젝트 가이드라인

이 프로젝트는 해외여행 전문 여행사 사이트입니다. 주로 React와 TypeScript, Tailwind CSS를 사용합니다.

## 코딩 스타일

- 함수형 컴포넌트와 React Hooks를 사용합니다.
- 상태 관리는 주로 Context API를 통해 처리합니다.
- Tailwind CSS의 클래스를 활용하여 스타일링합니다.
- 재사용 가능한 컴포넌트를 만들고 적극적으로 활용합니다.

## 네이밍 컨벤션

- 컴포넌트 파일: PascalCase.tsx
- 유틸리티 함수 파일: camelCase.ts
- CSS 클래스: kebab-case 또는 Tailwind 클래스
- TypeScript 인터페이스: PascalCase (예: TravelPackage)

## 프로젝트 구조

- `components/`: 재사용 가능한 컴포넌트
- `pages/`: 페이지 컴포넌트
- `hooks/`: 커스텀 훅
- `utils/`: 유틸리티 함수
- `types/`: TypeScript 타입 정의

## 데이터 처리

- API 통신은 Axios를 사용합니다.
- 여행 패키지, 사용자, 예약 관련 데이터는 `types/index.ts` 파일에 정의된 인터페이스를 참조합니다.

## 추가 고려사항

- 다국어 지원을 위한 i18n 구현을 계획 중입니다.
- 접근성(a11y)을 고려한 마크업을 사용합니다.
- 반응형 디자인으로 모바일 환경도 잘 지원해야 합니다.
