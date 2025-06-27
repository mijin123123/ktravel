// 여행 패키지 타입
export interface TravelPackage {
  id: string;
  category: string; // 카테고리 정보 추가
  name: string;
  destination: string;
  region: string;
  image: string;
  price: number;
  days: number;
  description: string;
  rating: number;
  type: string;
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
}

// 예약 상태 타입
export type BookingStatus = 'pending' | 'confirmed' | 'canceled' | 'completed';

// 예약 타입
export interface Booking {
  id: number;
  userName: string;
  packageName: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
}

// 계좌 타입
export interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
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

export interface SocialLink {
  name: string;
  url: string;
}

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
  name: string;
  url: string;
  order: string;
  sub?: SubCategory[];
}
