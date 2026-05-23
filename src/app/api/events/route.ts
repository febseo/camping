import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([])
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('events')
    .insert({
      name: body.name,
      description: body.description ?? '',
      start_date: body.start_date,
      end_date: body.end_date,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      applies_to: body.applies_to ?? 'all',
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
