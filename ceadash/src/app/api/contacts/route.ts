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

    console.log('API: Loading contacts for org:', organizationId)

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('API: Error loading contacts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Loaded', data?.length || 0, 'contacts')
    return NextResponse.json(data)
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('API: Creating contact:', { name: body.name, email: body.email })
    
    const { error } = await supabase
      .from('contacts')
      .insert([body])

    if (error) {
      console.error('API: Error creating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create activity entry
    try {
      await supabase
        .from('activities')
        .insert({
          organization_id: body.organization_id,
          user_id: body.created_by,
          activity_type: 'contact_added',
          title: `Contacto agregado: ${body.name}`,
          description: body.email,
          metadata: { contact_name: body.name, contact_email: body.email }
        })
    } catch (activityError) {
      console.error('API: Failed to create activity (non-fatal):', activityError)
      // Don't fail the request if activity creation fails
    }

    console.log('API: Contact created successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const { error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Contact ID required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}

