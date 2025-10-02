/**
 * Test script for ElevenLabs Agent Configuration API
 * Run with: node test-agent-config.js
 */

const testCallData = {
  contactName: "María García",
  contactEmail: "maria@empresa.com",
  contactCompany: "TechCorp",
  processType: "ventas",
  objectives: [
    "Mapear el proceso de ventas desde lead hasta cierre",
    "Identificar puntos de fricción en el embudo",
    "Optimizar conversión y tiempo de ciclo"
  ],
  duration: 45,
  language: "es",
  industry: "tecnologia",
  specificQuestions: [
    "¿Cómo califican los leads?",
    "¿Cuáles son las etapas del proceso de ventas?",
    "¿Qué herramientas utilizan para seguimiento?"
  ]
};

async function testAgentConfiguration() {
  console.log('🧪 Testing ElevenLabs Agent Configuration API...\n');
  
  try {
    // Test the agent configuration endpoint
    const response = await fetch('http://localhost:3010/api/elevenlabs/configure-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callData: testCallData,
        action: 'create'
      }),
    });

    const result = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📋 API Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCCESS: Agent configuration created successfully!');
      console.log('🤖 Agent ID:', result.agentId);
      console.log('🔗 Agent Link:', result.agentLink);
      console.log('💬 Message:', result.message);
    } else {
      console.log('\n❌ FAILED: Agent configuration failed');
      console.log('🚨 Error:', result.error);
    }
    
  } catch (error) {
    console.error('\n💥 ERROR: Failed to test agent configuration');
    console.error('Details:', error.message);
  }
}

// Test the configuration generation locally
function testConfigGeneration() {
  console.log('\n🔧 Testing local configuration generation...\n');
  
  // Import our agent service (this would work in a proper Node.js environment)
  console.log('📝 Test Call Data:');
  console.log(JSON.stringify(testCallData, null, 2));
  
  console.log('\n🎯 Expected Agent Configuration:');
  console.log('- Name: Agente CEA - ventas');
  console.log('- Language: es');
  console.log('- Process Type: ventas');
  console.log('- Industry: tecnologia');
  console.log('- Duration: 45 minutes');
  console.log('- First Message: ¡Hola María García! Soy el asistente de CEA...');
  console.log('- Specialized for sales process mapping');
}

// Run tests
console.log('🚀 Starting Agent Configuration Tests\n');
console.log('=' .repeat(50));

testConfigGeneration();
testAgentConfiguration();
