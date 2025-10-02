import { NextResponse } from 'next/server'
import { sendSchedulingEmailViaGmail } from '@/lib/emailjs-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, scheduledCall, additionalCCs } = body

    if (!to || !scheduledCall) {
      return NextResponse.json(
        { error: 'Missing required fields: to, scheduledCall' },
        { status: 400 }
      )
    }

    // Always CC edc@provivienda.mx
    const defaultCC = 'edc@provivienda.mx'
    const allCCs = additionalCCs 
      ? [...new Set([defaultCC, ...additionalCCs])]
      : [defaultCC]

    const result = await sendSchedulingEmailViaGmail(to, scheduledCall, allCCs)

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: `Email sent to ${to} via Gmail`,
        ccs: allCCs
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

