import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) return NextResponse.json({ bookedSiteIds: [] })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('site_id')
    .eq('check_in_date', date)
    .eq('status', 'confirmed')

  if (error) return NextResponse.json({ bookedSiteIds: [] })
  return NextResponse.json({ bookedSiteIds: data.map(r => r.site_id) })
}
