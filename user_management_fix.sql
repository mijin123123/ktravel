-- profiles 테이블이 없다면 생성 (사용자 메타데이터를 저장하는 테이블)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- profiles 테이블에 RLS(Row Level Security) 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 프로필을 조회할 수 있는 정책
CREATE POLICY select_own_profile ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

-- 관리자(admin)가 모든 프로필을 조회할 수 있는 정책
CREATE POLICY admin_select_all_profiles ON public.profiles 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- 관리자(admin)가 모든 프로필을 업데이트할 수 있는 정책
CREATE POLICY admin_update_all_profiles ON public.profiles 
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- 자동으로 신규 사용자 등록 시 profiles 테이블에도 추가하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS push
BEGIN
  INSERT INTO public.profiles (id, email, role, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'role', new.created_at);
  RETURN new;
END;
push LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거가 이미 존재하면 삭제하고 다시 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 기존 사용자들도 profiles 테이블에 추가 (이미 있는 경우 무시)
INSERT INTO public.profiles (id, email, role, created_at)
SELECT id, email, raw_user_meta_data->>'role', created_at 
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 모든 사용자 조회 함수 (profiles 테이블 사용)
CREATE OR REPLACE FUNCTION public.get_all_profiles() 
RETURNS TABLE (user_id uuid, email text, role text, created_at timestamptz)
LANGUAGE sql
SECURITY INVOKER
AS push
  SELECT id as user_id, email, role, created_at 
  FROM public.profiles 
  ORDER BY created_at DESC;
push;

-- 사용자 삭제 함수 (Supabase Auth API 사용)
CREATE OR REPLACE FUNCTION public.mark_user_for_deletion(user_id uuid) 
RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER
AS push
DECLARE
  result json;
BEGIN
  -- 실제 삭제가 아니라 삭제 마킹만 함 (auth.users는 직접 삭제 어려움)
  UPDATE public.profiles 
  SET role = 'deleted' 
  WHERE id = user_id;
  
  result := json_build_object(
    'success', true, 
    'message', 'User marked for deletion. Please use Supabase dashboard to complete deletion.'
  );
  
  RETURN result;
END;
push;

-- profiles 테이블에 realtime 활성화
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

-- 실시간 업데이트를 위한 profiles 테이블 추가
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
