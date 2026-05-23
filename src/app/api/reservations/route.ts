import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { site_id, check_in_date, customer_name, customer_phone, car_number, total_price, discount_amount, event_id } = body

    if (!site_id || !check_in_date || !customer_name || !customer_phone || !car_number) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 중복 예약 확인
    const { data: existing } = await supabase
      .from('reservations')
      .select('id')
      .eq('site_id', site_id)
      .eq('check_in_date', check_in_date)
      .eq('status', 'confirmed')
      .single()

    if (existing) {
      return NextResponse.json({ error: '해당 날짜에 이미 예약된 사이트입니다.' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        site_id,
        check_in_date,
        customer_name,
        customer_phone,
        car_number,
        total_price,
        discount_amount: discount_amount ?? 0,
        event_id: event_id || null,
        status: 'confirmed',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: '예약 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createAdminClient()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    let query = supabase
      .from('reservations')
      .select('*')
      .order('check_in_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (date) query = query.eq('check_in_date', date)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
