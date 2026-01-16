/**
 * Create the simplest possible workflow using n8n API
 * 
 * This creates a minimal workflow with:
 * - Start node (triggers manually)
 * - Set node (outputs a simple message)
 */

const N8NApiClient = require('./n8n-api-client');

async function createSimpleWorkflow() {
  const client = new N8NApiClient();

  // Define the simplest workflow structure
  const simpleWorkflow = {
    name: 'Simple Hello World Workflow',
    nodes: [
      {
        parameters: {},
        id: 'start-node',
        name: 'Start',
        type: 'n8n-nodes-base.start',
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          values: {
            string: [
              {
                name: 'message',
                value: 'Hello from n8n!'
              }
            ]
          },
          options: {}
        },
        id: 'set-node',
        name: 'Set Message',
        type: 'n8n-nodes-base.set',
        typeVersion: 1,
        position: [450, 300]
      }
    ],
    connections: {
      'start-node': {
        main: [
          [
            {
              node: 'set-node',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  };

  try {
    console.log('Creating simple workflow...');
    const result = await client.createWorkflow(simpleWorkflow);
    
    console.log('\n✅ Workflow created successfully!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Name: ${result.name}`);
    console.log(`\nYou can now view and execute this workflow in n8n at:`);
    console.log(`   http://localhost:5678/workflow/${result.id}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error creating workflow:', error.message);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  createSimpleWorkflow()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createSimpleWorkflow };
