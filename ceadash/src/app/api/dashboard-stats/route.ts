import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id') || '00000000-0000-0000-0000-000000000001'

    console.log('API: Loading dashboard stats for org:', organizationId)

    // Load all stats in parallel
    const [processesResult, callsResult, contactsResult] = await Promise.all([
      supabase
        .from('processes')
        .select('efficiency_score')
        .eq('organization_id', organizationId),
      supabase
        .from('scheduled_calls')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .in('status', ['scheduled', 'in_progress']),
      supabase
        .from('contacts')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'active'),
    ])

    const processes = processesResult.data || []
    const avgEfficiency = processes.length > 0
      // @ts-expect-error - Supabase generated types issue
      ? Math.round(processes.reduce((sum, p) => sum + (p.efficiency_score || 0), 0) / processes.length)
      : 0

    const stats = {
      totalProcesses: processes.length,
      scheduledCalls: callsResult.count || 0,
      totalContacts: contactsResult.count || 0,
      avgEfficiency,
    }

    console.log('API: Loaded stats:', stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}

