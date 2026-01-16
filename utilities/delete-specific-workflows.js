/**
 * Delete Specific Workflows by ID
 * 
 * Usage:
 *   node utilities/delete-specific-workflows.js
 */

const N8NApiClient = require('./n8n-api-client');

async function deleteSpecificWorkflows() {
  const client = new N8NApiClient();

  if (!client.apiKey) {
    console.error('❌ Error: API key not found. Check credentials/n8n-api-key.txt');
    process.exit(1);
  }

  try {
    // Workflows to delete
    const workflowsToDelete = [
      {
        id: 'Vx25zi6sPKGSmHLN',
        name: 'Response to Webhook'
      },
      {
        id: 'afCebDoOMbQ5tyN9',
        name: '2.1 Inbox Processing Reminder (duplicate)'
      }
    ];

    console.log('🗑️  Deleting specific workflows...\n');

    for (const workflow of workflowsToDelete) {
      try {
        // Verify workflow exists first
        const existing = await client.getWorkflow(workflow.id);
        console.log(`   📋 Found: ${existing.name} (${workflow.id})`);
        
        // Delete it
        await client.deleteWorkflow(workflow.id);
        console.log(`   ✅ Deleted: ${existing.name}\n`);
      } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log(`   ⚠️  Workflow ${workflow.name} (${workflow.id}) not found - may already be deleted\n`);
        } else {
          console.error(`   ❌ Failed to delete ${workflow.name}: ${error.message}\n`);
        }
      }
    }

    console.log('✨ Done!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

deleteSpecificWorkflows();
