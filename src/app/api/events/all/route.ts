import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')?.value
  if (auth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([])
  return NextResponse.json(data)
}
