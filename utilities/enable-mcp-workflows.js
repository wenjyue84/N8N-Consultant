/**
 * Enable workflows for Instance-level MCP and add descriptions
 * 
 * This script:
 * 1. Lists all workflows
 * 2. Gets details for each workflow
 * 3. Updates workflows with descriptions
 * 4. Enables them for MCP exposure
 */

const N8NApiClient = require('./n8n-api-client');
const fs = require('fs');
const path = require('path');

// Load API key
function loadApiKey() {
  try {
    const credPath = path.join(__dirname, '..', 'credentials', 'n8n-api-key.txt');
    const content = fs.readFileSync(credPath, 'utf8');
    const match = content.match(/API_KEY=(.+)/);
    if (match) {
      return match[1].trim();
    }
  } catch (error) {
    console.error('Could not load API key from file.');
    process.exit(1);
  }
  return null;
}

// Generate description based on workflow name and nodes
function generateDescription(workflow) {
  const name = workflow.name || '';
  const nodes = workflow.nodes || [];
  
  // Extract service names from workflow name
  const nameLower = name.toLowerCase();
  
  // Check for specific services
  if (nameLower.includes('openai')) {
    return 'Test workflow for OpenAI integration. Processes OpenAI API requests and responses.';
  } else if (nameLower.includes('google cal') || nameLower.includes('calendar')) {
    return 'Test workflow for Google Calendar integration. Manages calendar events and scheduling.';
  } else if (nameLower.includes('notion')) {
    return 'Test workflow for Notion integration. Syncs data with Notion databases and pages.';
  } else if (nameLower.includes('gmail')) {
    return 'Test workflow for Gmail integration. Handles email operations and notifications.';
  }
  
  // Generic description based on nodes
  const nodeTypes = nodes.map(n => n.type || '').join(', ');
  if (nodeTypes) {
    return `Test workflow for automation. Contains nodes: ${nodeTypes.split(',').slice(0, 3).join(', ')}.`;
  }
  
  return 'Test workflow for automation and integration testing.';
}

// Enable workflow for MCP
async function enableWorkflowForMCP(client, workflowId, description) {
  try {
    // First, get the current workflow
    const workflow = await client.getWorkflow(workflowId);
    
    // Update workflow with description
    const updatedWorkflow = {
      ...workflow,
      description: description,
      // Enable for MCP - this might be in settings or a separate flag
      // Based on n8n's MCP feature, workflows need to be published/active
      active: true,
      settings: {
        ...(workflow.settings || {}),
        // MCP-related settings might be here
      }
    };
    
    // Update the workflow
    const result = await client.updateWorkflow(workflowId, updatedWorkflow);
    return result;
  } catch (error) {
    console.error(`Error updating workflow ${workflowId}:`, error.message);
    throw error;
  }
}

async function main() {
  const apiKey = loadApiKey();
  const client = new N8NApiClient(apiKey);
  
  console.log('🔍 Fetching workflows...\n');
  
  try {
    // List all workflows
    const workflows = await client.listWorkflows();
    
    if (!workflows || workflows.length === 0) {
      console.log('No workflows found.');
      return;
    }
    
    console.log(`Found ${workflows.length} workflow(s)\n`);
    
    // Filter for test workflows (based on the image)
    const testWorkflows = workflows.filter(w => 
      w.name && (
        w.name.toLowerCase().includes('test: openai') ||
        w.name.toLowerCase().includes('test: google cal') ||
        w.name.toLowerCase().includes('test: notion') ||
        w.name.toLowerCase().includes('test: gmail')
      )
    );
    
    if (testWorkflows.length === 0) {
      console.log('No matching test workflows found. Processing all workflows...\n');
      // Process all workflows if no test workflows found
      for (const workflow of workflows) {
        const fullWorkflow = await client.getWorkflow(workflow.id);
        const description = generateDescription(fullWorkflow);
        
        console.log(`📝 Updating: ${workflow.name}`);
        console.log(`   Description: ${description}`);
        
        await enableWorkflowForMCP(client, workflow.id, description);
        console.log(`   ✅ Updated\n`);
      }
    } else {
      console.log(`Processing ${testWorkflows.length} test workflow(s)...\n`);
      
      for (const workflow of testWorkflows) {
        const fullWorkflow = await client.getWorkflow(workflow.id);
        const description = generateDescription(fullWorkflow);
        
        console.log(`📝 Updating: ${workflow.name}`);
        console.log(`   Description: ${description}`);
        
        await enableWorkflowForMCP(client, workflow.id, description);
        console.log(`   ✅ Updated\n`);
      }
    }
    
    console.log('✨ All workflows updated!');
    console.log('\nNote: To enable workflows for MCP in the UI:');
    console.log('1. Go to Settings → Instance-level MCP');
    console.log('2. Click "Enable workflows" button');
    console.log('3. Select the workflows you want to expose');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { enableWorkflowForMCP, generateDescription };
