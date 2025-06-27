// 여행 패키지 타입
export interface TravelPackage {
  id: string;
  category: string; // 카테고리 정보 추가
  name: string;
  destination: string;
  region: string;
  image: string;
  price: number;
  discountRate: number; // 할인율 (예: 0.1은 10% 할인)
  days: number;
  description: string;
  rating: number;
  type: string;
  created_at: string; // Supabase에서 자동 생성되는 필드
}

// 상세 여행 패키지 타입
export interface TravelPackageDetail extends TravelPackage {
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  reviews: Review[];
}

// 여행 일정 타입
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

// 리뷰 타입
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string; // Supabase에서 자동 생성되는 필드
}

// 예약 상태 타입 (canceled 오타 수정)
export type BookingStatus = 'pending' | 'confirmed' | 'canceled' | 'completed';

// 예약 타입 (Supabase 스키마에 맞게 재정의)
export interface Booking {
  id: string;
  package_id: string;
  user_id: string;
  departure_date: string;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  // 테이블 조인을 통해 가져올 데이터 타입
  products?: {
    name: string;
  };
  users?: {
    name: string;
    email: string;
  };
}

// 계좌 타입 (Supabase 스키마에 맞게 재정의)
export interface Account {
  id: string; // uuid
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_default: boolean;
  created_at?: string;
}

// 푸터 컨텐츠 타입
export interface FooterLink {
  text: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface CustomerCenter {
  title: string;
  info: string[];
}

// 소셜 링크 타입
export interface SocialLink {
  name: string;
  url: string;
}

// 전체 푸터 컨텐츠 타입 (Supabase 'content' JSON 필드 구조)
export interface FooterContent {
  description: string;
  packages: FooterSection;
  company: FooterSection;
  customerCenter: CustomerCenter;
  social: SocialLink[];
}

export interface SubCategory {
  name: string;
  order: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  url: string;
  order: number;
  parent_id: number | null;
  sub?: MenuCategory[]; // 가공 후 서브메뉴를 담을 속성
}
