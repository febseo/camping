import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const supabase = await createAdminClient()

  // 사이트 변경 처리
  if (body.new_site_id !== undefined) {
    // 변경할 사이트가 해당 날짜에 이미 예약됐는지 확인
    const { data: current } = await supabase
      .from('reservations')
      .select('check_in_date, site_id')
      .eq('id', id)
      .single()

    if (current) {
      const { data: conflict } = await supabase
        .from('reservations')
        .select('id')
        .eq('site_id', body.new_site_id)
        .eq('check_in_date', current.check_in_date)
        .eq('status', 'confirmed')
        .neq('id', id)
        .single()

      if (conflict) {
        return NextResponse.json({ error: '해당 사이트는 이미 예약되어 있습니다.' }, { status: 409 })
      }
    }

    const { data, error } = await supabase
      .from('reservations')
      .update({
        original_site_id: body.original_site_id ?? current?.site_id,
        site_id: body.new_site_id,
        status: 'changed',
        notes: body.notes ?? null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // 일반 업데이트 (취소 등)
  const allowed = ['status', 'notes']
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
  const { data, error } = await supabase
    .from('reservations')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
