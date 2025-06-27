import { createClient } from '@supabase/supabase-js'

// 디버깅을 위한 환경 변수 체크
console.log('Supabase URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase ANON KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('환경 변수 오류: Supabase URL 또는 ANON KEY가 설정되지 않았습니다.');
  console.error('Netlify에 환경 변수를 설정했는지 확인하세요!');
  throw new Error('Supabase URL and anonymous key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
