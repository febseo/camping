-- 예약 테이블
create table reservations (
  id uuid default gen_random_uuid() primary key,
  site_id integer not null,
  original_site_id integer,
  check_in_date date not null,
  customer_name text not null,
  customer_phone text not null,
  car_number text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'changed')),
  total_price integer not null,
  discount_amount integer not null default 0,
  event_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- 이벤트/할인 테이블
create table events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value integer not null,
  applies_to text not null default 'all' check (applies_to in ('single', 'family', 'all')),
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- RLS 비활성화 (관리자 서비스 롤로 접근)
alter table reservations enable row level security;
alter table events enable row level security;

-- anon 읽기 허용 (예약 조회, 이벤트 조회)
create policy "Public read reservations" on reservations for select using (true);
create policy "Public insert reservations" on reservations for insert with check (true);
create policy "Public read events" on events for select using (true);

-- 서비스 롤은 모든 작업 가능 (RLS 우회)
