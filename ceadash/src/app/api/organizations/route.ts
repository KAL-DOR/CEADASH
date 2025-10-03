import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('API: Error loading organization:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to load organization' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, cc_email } = body

    console.log('API: Updating organization:', { id, cc_email })

    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Prepare the email array - only include if cc_email has a value
    const emailArray = cc_email && cc_email.trim() ? [cc_email.trim()] : []
    
    console.log('API: Setting notification_cc_emails to:', emailArray)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .update({ notification_cc_emails: emailArray })
      .eq('id', id)
      .select()

    if (error) {
      console.error('API: Error updating organization:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Organization updated successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
  }
}

