import { NextRequest, NextResponse } from 'next/server';
import { createAgentService, CallSetupData, PROCESS_TEMPLATES } from '@/lib/elevenlabs/agent-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callData, agentId, action } = body as {
      callData: CallSetupData;
      agentId?: string;
      action: 'update' | 'create' | 'test';
    };

    console.log('📝 Received request:', { callData, agentId, action });

    // Validate required fields
    if (!callData || !callData.contactName || !callData.processType) {
      console.error('❌ Missing required fields:', { callData });
      return NextResponse.json(
        { error: 'Missing required call data fields', success: false },
        { status: 400 }
      );
    }

    const agentService = createAgentService();
    if (!agentService) {
      console.error('❌ ElevenLabs API key not found in environment variables');
      console.log('🧪 Running in demo mode without actual ElevenLabs API calls');
      
      // Return mock response for testing
      const mockAgentId = `mock_agent_${Date.now()}`;
      const mockAgentLink = `https://elevenlabs.io/convai/conversation?agent_id=${mockAgentId}`;
      
      return NextResponse.json({
        success: true,
        agentId: mockAgentId,
        agentLink: mockAgentLink,
        message: 'Agent configuration created successfully (DEMO MODE - no actual API call made)',
        demo: true
      });
    }

    // Enhance call data with template if available
    const processTemplate = PROCESS_TEMPLATES[callData.processType as keyof typeof PROCESS_TEMPLATES];
    if (processTemplate) {
      callData.objectives = callData.objectives || processTemplate.objectives;
      callData.specificQuestions = callData.specificQuestions || processTemplate.specificQuestions;
    }

    // Generate dynamic configuration
    const agentConfig = agentService.generateAgentConfig(callData);

    let result;
    switch (action) {
      case 'create':
        result = await agentService.createAgent(agentConfig);
        if (result) {
          // Get the agent link after creation
          const agentLink = await agentService.getAgentLink(result);
          return NextResponse.json({
            success: true,
            agentId: result,
            agentLink: agentLink,
            message: 'Agent created successfully with dynamic configuration'
          });
        }
        break;

      case 'update':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for update action' },
            { status: 400 }
          );
        }
        result = await agentService.updateAgentConfiguration(agentId, agentConfig);
        if (result) {
          // Get the updated agent link
          const agentLink = await agentService.getAgentLink(agentId);
          return NextResponse.json({
            success: true,
            agentId,
            agentLink: agentLink,
            message: 'Agent configuration updated successfully'
          });
        }
        break;

      case 'test':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for test action' },
            { status: 400 }
          );
        }
        result = await agentService.testAgentConfiguration(agentId);
        if (result) {
          return NextResponse.json({
            success: true,
            agentId,
            message: 'Agent configuration test successful'
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create, update, or test' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { error: 'Failed to execute agent configuration action' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error in agent configuration API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID required' },
        { status: 400 }
      );
    }

    const agentService = createAgentService();
    if (!agentService) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const agentConfig = await agentService.getAgentConfiguration(agentId);
    if (!agentConfig) {
      return NextResponse.json(
        { error: 'Failed to retrieve agent configuration' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agentConfig,
      message: 'Agent configuration retrieved successfully'
    });

  } catch (error) {
    console.error('Error retrieving agent configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
