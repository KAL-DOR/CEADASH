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

    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('organizations')
      .update({ notifications_cc_emails: cc_email })
      .eq('id', id)

    if (error) {
      console.error('API: Error updating organization:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: Organization updated successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API: Exception:', error)
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
  }
}

