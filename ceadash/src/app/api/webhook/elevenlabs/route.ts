import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

// ElevenLabs webhook payload types
interface ElevenLabsWebhookPayload {
  event_type: 'call_started' | 'call_ended' | 'transcription_ready';
  call_id: string;
  timestamp: string;
  data: {
    duration?: number;
    transcription?: string;
    metadata?: Record<string, unknown>;
    status?: 'completed' | 'failed' | 'cancelled';
  };
}

// Verify webhook signature (if ElevenLabs provides one)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    
    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = headersList.get('x-elevenlabs-signature') || '';
      if (!verifyWebhookSignature(body, signature, webhookSecret)) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const payload: ElevenLabsWebhookPayload = JSON.parse(body);
    const supabase = await createClient();

    console.log('ElevenLabs webhook received:', payload.event_type, payload.call_id);

    switch (payload.event_type) {
      case 'call_started':
        await handleCallStarted(supabase, payload);
        break;
      
      case 'call_ended':
        await handleCallEnded(supabase, payload);
        break;
      
      case 'transcription_ready':
        await handleTranscriptionReady(supabase, payload);
        break;
      
      default:
        console.log('Unknown event type:', payload.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCallStarted(supabase: Awaited<ReturnType<typeof createClient>>, payload: ElevenLabsWebhookPayload) {
  // Find the scheduled call by bot connection URL or call ID
  const { data: scheduledCall, error } = await supabase
    .from('scheduled_calls')
    .select('*')
    .or(`bot_connection_url.ilike.%${payload.call_id}%,id.eq.${payload.call_id}`)
    .single();

  if (error || !scheduledCall) {
    console.error('Scheduled call not found for call_id:', payload.call_id);
    return;
  }

  // Update call status to in_progress
  await supabase
    .from('scheduled_calls')
    .update({ 
      status: 'in_progress',
      updated_at: new Date().toISOString()
    })
    .eq('id', scheduledCall.id);

  console.log('Call started for scheduled call:', scheduledCall.id);
}

async function handleCallEnded(supabase: Awaited<ReturnType<typeof createClient>>, payload: ElevenLabsWebhookPayload) {
  // Find the scheduled call
  const { data: scheduledCall, error } = await supabase
    .from('scheduled_calls')
    .select('*')
    .or(`bot_connection_url.ilike.%${payload.call_id}%,id.eq.${payload.call_id}`)
    .single();

  if (error || !scheduledCall) {
    console.error('Scheduled call not found for call_id:', payload.call_id);
    return;
  }

  // Update call status and duration
  const updates: Record<string, unknown> = {
    status: payload.data.status === 'completed' ? 'completed' : 'cancelled',
    updated_at: new Date().toISOString()
  };

  if (payload.data.duration) {
    updates.duration_minutes = Math.round(payload.data.duration / 60);
  }

  await supabase
    .from('scheduled_calls')
    .update(updates)
    .eq('id', scheduledCall.id);

  console.log('Call ended for scheduled call:', scheduledCall.id, 'Status:', updates.status);
}

async function handleTranscriptionReady(supabase: Awaited<ReturnType<typeof createClient>>, payload: ElevenLabsWebhookPayload) {
  // Find the scheduled call
  const { data: scheduledCall, error } = await supabase
    .from('scheduled_calls')
    .select('*')
    .or(`bot_connection_url.ilike.%${payload.call_id}%,id.eq.${payload.call_id}`)
    .single();

  if (error || !scheduledCall) {
    console.error('Scheduled call not found for call_id:', payload.call_id);
    return;
  }

  // Create transcription record
  const { data: transcription, error: transcriptionError } = await supabase
    .from('transcriptions')
    .insert({
      organization_id: scheduledCall.organization_id,
      call_id: payload.call_id,
      content: payload.data.transcription || '',
      metadata: payload.data.metadata || {},
      processed: false
    })
    .select()
    .single();

  if (transcriptionError) {
    console.error('Error creating transcription:', transcriptionError);
    return;
  }

  // Update scheduled call with transcription data
  await supabase
    .from('scheduled_calls')
    .update({
      transcription_data: {
        transcription_id: transcription.id,
        content: payload.data.transcription,
        processed_at: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', scheduledCall.id);

  console.log('Transcription ready for call:', scheduledCall.id, 'Transcription ID:', transcription.id);

  // TODO: Trigger AI process mapping here
  // This is where you would call your AI service to analyze the transcription
  // and create process diagrams and improvements
  await triggerProcessMapping(supabase, scheduledCall, transcription);
}

async function triggerProcessMapping(supabase: Awaited<ReturnType<typeof createClient>>, scheduledCall: Record<string, unknown>, transcription: string) {
  try {
    // This is a placeholder for AI process mapping
    // In a real implementation, you would:
    // 1. Send the transcription to your AI service (OpenAI, Claude, etc.)
    // 2. Generate process diagrams
    // 3. Create improvement suggestions
    // 4. Store the results in the processes table

    console.log('Triggering process mapping for transcription');

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a process record with mock data
    const processName = `Proceso mapeado - ${new Date().toLocaleDateString('es-ES')}`;
    const mockDiagramData = {
      nodes: [
        { id: '1', label: 'Inicio', type: 'start' },
        { id: '2', label: 'Proceso identificado', type: 'process' },
        { id: '3', label: 'Fin', type: 'end' }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3' }
      ]
    };

    const mockImprovements = {
      suggestions: [
        'Automatizar el paso 2 para reducir tiempo de procesamiento',
        'Implementar validaciones adicionales en el proceso',
        'Considerar paralelización de tareas'
      ],
      efficiency_gain: 25,
      time_saved: '15 minutos por ejecución'
    };

    const { data: process, error: processError } = await supabase
      .from('processes')
      .insert({
        organization_id: scheduledCall.organization_id,
        name: processName,
        description: `Proceso mapeado automáticamente desde la llamada del ${new Date().toLocaleDateString('es-ES')}`,
        status: 'active',
        efficiency_score: 75,
        diagram_data: mockDiagramData,
        improvements_data: mockImprovements,
        transcription_text: transcription,
        created_by: scheduledCall.created_by
      })
      .select()
      .single();

    if (processError) {
      console.error('Error creating process:', processError);
      return;
    }

    // Link the process to the scheduled call
    await supabase
      .from('scheduled_calls')
      .update({
        process_id: process.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', scheduledCall.id);

    // Mark transcription as processed
    console.log('Process mapping completed. Process ID:', process?.id);
  } catch (error) {
    console.error('Error in process mapping:', error);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ElevenLabs Webhook Handler'
  });
}

