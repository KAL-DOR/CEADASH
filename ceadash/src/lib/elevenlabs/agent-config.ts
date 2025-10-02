/**
 * ElevenLabs Agent Configuration Service
 * Dynamically updates agent instructions and behavior based on call setup
 */

export interface AgentConfiguration {
  agent_id?: string;
  name: string;
  conversation_config: {
    agent: {
      prompt: {
        prompt: string;
        llm: string;
        temperature: number;
        max_tokens: number;
        tool_ids: string[];
      };
      language: string;
      first_message: string;
    };
    tts: {
      voice_id: string;
      model_id: string;
      stability: number;
      similarity_boost: number;
      speed: number;
    };
    conversation: {
      max_duration_seconds: number;
    };
    turn: {
      turn_timeout: number;
      mode: string;
    };
  };
  platform_settings?: {
    widget_config?: {
      tts_enabled: boolean;
      stt_enabled: boolean;
      conversation_config_override: Record<string, unknown>;
    };
  };
  tags?: string[];
}

export interface CallSetupData {
  contactName: string;
  contactEmail: string;
  contactCompany: string;
  processType: string;
  objectives: string[];
  duration: number;
  language: string;
  industry: string;
  specificQuestions?: string[];
}

export class ElevenLabsAgentService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate dynamic agent configuration based on call setup
   */
  generateAgentConfig(callData: CallSetupData): Partial<AgentConfiguration> {
    const dynamicPrompt = this.generateDynamicPrompt(callData);
    const firstMessage = this.generateFirstMessage(callData);
    
    return {
      name: `Agente CEA - ${callData.processType}`,
      conversation_config: {
        agent: {
          prompt: {
            prompt: dynamicPrompt,
            llm: "gpt-4o-mini",
            temperature: 0.3,
            max_tokens: 500,
            tool_ids: [],
          },
          language: callData.language || 'es',
          first_message: firstMessage,
        },
        tts: {
          voice_id: "cjVigY5qzO86Huf0OWal", // Default Spanish voice
          model_id: "eleven_turbo_v2_5",
          stability: 0.5,
          similarity_boost: 0.8,
          speed: 1.0,
        },
        conversation: {
          max_duration_seconds: (callData.duration || 30) * 60,
        },
        turn: {
          turn_timeout: 7,
          mode: "silence",
        },
      },
    };
  }

  /**
   * Generate first message for the agent
   */
  private generateFirstMessage(callData: CallSetupData): string {
    return `¡Hola ${callData.contactName}! Soy el asistente de CEA especializado en mapeo de procesos. Estoy aquí para ayudarte a documentar y optimizar tu proceso de ${callData.processType}. ¿Estás listo para comenzar?`;
  }

  /**
   * Generate dynamic prompt based on call objectives and context
   */
  private generateDynamicPrompt(callData: CallSetupData): string {
    const basePrompt = `Eres un asistente especializado de CEA (Centro de Excelencia en Automatización) diseñado para mapear y optimizar procesos empresariales.`;
    
    const contextPrompt = `
CONTEXTO DE LA LLAMADA:
- Contacto: ${callData.contactName} de ${callData.contactCompany}
- Tipo de proceso: ${callData.processType}
- Industria: ${callData.industry}
- Duración estimada: ${callData.duration} minutos

OBJETIVOS PRINCIPALES:
${callData.objectives.map(obj => `- ${obj}`).join('\n')}

INSTRUCCIONES ESPECÍFICAS:
1. Saluda cordialmente al contacto por su nombre
2. Explica brevemente el propósito de la llamada
3. Guía la conversación para mapear el proceso "${callData.processType}"
4. Haz preguntas específicas sobre:
   - Pasos actuales del proceso
   - Personas involucradas y roles
   - Herramientas y sistemas utilizados
   - Puntos de dolor y ineficiencias
   - Tiempo promedio del proceso
   - Frecuencia de ejecución

5. Mantén un tono profesional pero amigable
6. Toma notas detalladas de cada paso mencionado
7. Al final, resume los puntos clave identificados
8. Pregunta si hay algo más que agregar

PREGUNTAS ESPECÍFICAS A INCLUIR:
${callData.specificQuestions?.map(q => `- ${q}`).join('\n') || '- ¿Cuáles son los principales desafíos en este proceso?\n- ¿Qué herramientas utilizan actualmente?\n- ¿Cuánto tiempo toma completar este proceso?'}

IMPORTANTE: 
- Mantén la conversación enfocada en el mapeo del proceso
- Si el contacto se desvía del tema, redirige amablemente
- Asegúrate de capturar todos los detalles técnicos mencionados
- Al finalizar, confirma que tienes toda la información necesaria
`;

    return basePrompt + contextPrompt;
  }

  /**
   * Create a new agent with specific configuration
   */
  async createAgent(config: Partial<AgentConfiguration>): Promise<string | null> {
    try {
      console.log('🚀 Creating agent with config:', JSON.stringify(config, null, 2));
      
      const response = await fetch(`${this.baseUrl}/convai/agents/create`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create agent:', errorData);
        return null;
      }

      const newAgent = await response.json();
      console.log('Agent created successfully:', newAgent);
      return newAgent.agent_id;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  }

  /**
   * Update agent configuration via ElevenLabs API
   */
  async updateAgentConfiguration(agentId: string, config: Partial<AgentConfiguration>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/convai/agents/${agentId}`, {
        method: 'PATCH',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update agent configuration:', errorData);
        return false;
      }

      const updatedAgent = await response.json();
      console.log('Agent configuration updated successfully:', updatedAgent);
      return true;
    } catch (error) {
      console.error('Error updating agent configuration:', error);
      return false;
    }
  }

  /**
   * Get current agent configuration
   */
  async getAgentConfiguration(agentId: string): Promise<AgentConfiguration | null> {
    try {
      const response = await fetch(`${this.baseUrl}/convai/agents/${agentId}`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to get agent configuration');
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting agent configuration:', error);
      return null;
    }
  }

  /**
   * Get agent conversation link
   * According to ElevenLabs docs, we need to get the signed URL from the agent
   */
  async getAgentLink(agentId: string): Promise<string | null> {
    try {
      // First, get the agent details to access the signed URL
      const agentResponse = await fetch(`${this.baseUrl}/convai/agents/${agentId}`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!agentResponse.ok) {
        console.error('Failed to get agent details for link');
        return null;
      }

      const agentData = await agentResponse.json();
      
      // Try to get the signed URL endpoint
      const signedUrlResponse = await fetch(`${this.baseUrl}/convai/agents/${agentId}/url/signed`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (signedUrlResponse.ok) {
        const urlData = await signedUrlResponse.json();
        if (urlData.url) {
          console.log('✅ Got signed URL:', urlData.url);
          return urlData.url;
        }
      }
      
      // If signed URL doesn't work, construct the widget embed URL
      // This is the public-facing URL for the agent
      const widgetUrl = `https://elevenlabs.io/app/conversational-ai/${agentId}`;
      console.log('📎 Using widget URL:', widgetUrl);
      return widgetUrl;
    } catch (error) {
      console.error('Error getting agent link:', error);
      // Fallback to agent dashboard URL
      return `https://elevenlabs.io/app/conversational-ai/${agentId}`;
    }
  }

  /**
   * Test agent configuration with sample data
   */
  async testAgentConfiguration(agentId: string): Promise<boolean> {
    try {
      // Note: There's no specific test endpoint in the docs, so we'll just try to get the agent
      const agent = await this.getAgentConfiguration(agentId);
      return agent !== null;
    } catch (error) {
      console.error('Error testing agent configuration:', error);
      return false;
    }
  }
}

/**
 * Utility function to create agent service instance
 */
export function createAgentService(): ElevenLabsAgentService | null {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.error('ElevenLabs API key not found in environment variables');
    return null;
  }

  return new ElevenLabsAgentService(apiKey);
}

/**
 * Predefined process templates for common business processes
 */
export const PROCESS_TEMPLATES = {
  "onboarding": {
    objectives: [
      "Mapear el proceso de incorporación de nuevos empleados",
      "Identificar documentos y sistemas necesarios",
      "Optimizar tiempos de integración"
    ],
    specificQuestions: [
      "¿Cuáles son los primeros pasos cuando llega un nuevo empleado?",
      "¿Qué documentos deben completar?",
      "¿Cuánto tiempo toma el proceso completo?",
      "¿Qué sistemas necesitan acceso?"
    ]
  },
  "ventas": {
    objectives: [
      "Documentar el proceso de ventas desde lead hasta cierre",
      "Identificar puntos de fricción en el embudo",
      "Optimizar conversión y tiempo de ciclo"
    ],
    specificQuestions: [
      "¿Cómo califican los leads?",
      "¿Cuáles son las etapas del proceso de ventas?",
      "¿Qué herramientas utilizan para seguimiento?",
      "¿Cuál es el tiempo promedio de cierre?"
    ]
  },
  "soporte": {
    objectives: [
      "Mapear el proceso de atención al cliente",
      "Identificar tipos de tickets y escalaciones",
      "Mejorar tiempos de respuesta"
    ],
    specificQuestions: [
      "¿Cómo reciben las solicitudes de soporte?",
      "¿Cuáles son los niveles de escalación?",
      "¿Qué métricas de SLA manejan?",
      "¿Cómo priorizan los tickets?"
    ]
  }
};