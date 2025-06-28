// 여행 패키지 타입
export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  region?: string;
  image: string;
  price: number;
  days?: number;
  description: string;
  rating: number;
  type?: string;
  category?: string;
  discount_rate?: number;
  discountRate?: number; // UI 호환성을 위한 필드
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
  id: string;
  packageId: string;
  userId: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  paymentStatus: 'pending' | 'partial' | 'complete';
}
