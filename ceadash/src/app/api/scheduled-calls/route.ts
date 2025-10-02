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

    console.log('API: Loading scheduled calls for org:', organizationId)

    const { data, error } = await supabase
      .from('scheduled_calls')
      .select(`
        *,
        contacts (
          name,
          email,
          phone
        )
      `)
      .eq('organization_id', organizationId)
      .order('scheduled_date', { ascending: false })

    if (error) {
      console.error('API: Error loading scheduled calls:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the data
    const formattedCalls = (data || []).map((call: any) => ({
      ...call,
      contact_name: call.contacts?.name,
      contact_email: call.contacts?.email,
      contact_phone: call.contacts?.phone,
    }))

    console.log('API: Loaded', formattedCalls.length, 'scheduled calls')
    return NextResponse.json(formattedCalls)
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to load scheduled calls' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('API: Creating scheduled call:', { 
      contact_id: body.contact_id, 
      scheduled_date: body.scheduled_date 
    })
    
    const { error } = await supabase
      .from('scheduled_calls')
      .insert([body])

    if (error) {
      console.error('API: Error creating scheduled call:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Scheduled call created successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to create scheduled call' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const { error } = await supabase
      .from('scheduled_calls')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to update scheduled call' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Scheduled call ID required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('scheduled_calls')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to delete scheduled call' }, { status: 500 })
  }
}

