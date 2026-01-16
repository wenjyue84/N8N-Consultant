/**
 * Example usage of N8N API Client
 * 
 * This demonstrates how to use the N8NApiClient to interact with your n8n instance
 */

const N8NApiClient = require('./n8n-api-client');

async function examples() {
  // Initialize client (automatically loads API key from credentials file)
  const client = new N8NApiClient();

  try {
    // Example 1: List all workflows
    console.log('Fetching all workflows...');
    const workflows = await client.listWorkflows();
    console.log(`Found ${workflows.data.length} workflows`);
    
    // Example 2: Get a specific workflow (if you have a workflow ID)
    if (workflows.data.length > 0) {
      const workflowId = workflows.data[0].id;
      console.log(`\nFetching workflow ${workflowId}...`);
      const workflow = await client.getWorkflow(workflowId);
      console.log(`Workflow: ${workflow.name}`);
    }

    // Example 3: Create a new workflow
    console.log('\nCreating a new workflow...');
    const newWorkflow = {
      name: 'Test Workflow from API',
      nodes: [
        {
          parameters: {},
          id: 'start-node',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [250, 300]
        }
      ],
      connections: {},
      settings: {
        executionOrder: 'v1'
      }
    };
    
    // Uncomment to actually create:
    // const created = await client.createWorkflow(newWorkflow);
    // console.log(`Created workflow: ${created.id}`);

    // Example 4: List recent executions
    console.log('\nFetching recent executions...');
    const executions = await client.listExecutions();
    console.log(`Found ${executions.data.length} executions`);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  examples();
}

module.exports = { examples };
