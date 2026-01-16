/**
 * Update Workflow Names via API
 * Updates workflow names in n8n to match the new numbering scheme
 * 
 * Usage:
 *   node utilities/update-workflow-names.js
 */

const N8NApiClient = require('./n8n-api-client');

// Mapping of old names to new numbered names
const workflowNameUpdates = {
  'Notion Inbox Processing Reminder': '2.1 Inbox Processing Reminder',
  'Daily Briefing - Tasks to Gmail': '1.3 Daily Briefing - Tasks to Gmail',
  'Notion Context Query to Telegram': '2.4 Context Switcher'
};

async function updateWorkflowNames() {
  const client = new N8NApiClient();
  
  if (!client.apiKey) {
    console.error('❌ Error: API key not found. Check credentials/n8n-api-key.txt');
    process.exit(1);
  }

  try {
    console.log('🔄 Fetching workflows from n8n...\n');
    
    // Get all workflows
    const response = await client.listWorkflows();
    const workflows = response.data || response || [];
    
    if (workflows.length === 0) {
      console.log('⚠️  No workflows found in n8n.');
      return;
    }

    console.log(`📋 Found ${workflows.length} workflow(s)\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const workflow of workflows) {
      const oldName = workflow.name;
      const newName = workflowNameUpdates[oldName];

      if (newName && oldName !== newName) {
        console.log(`🔄 Updating: "${oldName}" → "${newName}"`);
        
        try {
          // Get full workflow data
          const fullWorkflow = await client.getWorkflow(workflow.id);
          
          // Clean workflow data for API (remove fields API doesn't accept)
          // Note: tags is read-only and cannot be updated via API
          const updateData = {
            name: newName,
            nodes: fullWorkflow.nodes || [],
            connections: fullWorkflow.connections || {},
            settings: fullWorkflow.settings || { executionOrder: 'v1' },
            staticData: fullWorkflow.staticData || null
            // tags is read-only - cannot be updated via API
          };
          
          // Remove any undefined/null fields that might cause issues
          Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
              delete updateData[key];
            }
          });
          
          await client.updateWorkflow(workflow.id, updateData);
          
          console.log(`   ✅ Updated successfully (ID: ${workflow.id})\n`);
          updatedCount++;
          
        } catch (error) {
          console.error(`   ❌ Failed: ${error.message}\n`);
        }
        
      } else if (newName) {
        console.log(`⏭️  Skipping: "${oldName}" (already has correct name)\n`);
        skippedCount++;
      } else {
        // Workflow not in our update list
        console.log(`ℹ️  Keeping: "${oldName}" (not in update list)\n`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} workflow(s)`);
    console.log(`   ⏭️  Skipped: ${skippedCount} workflow(s)`);
    console.log(`   ℹ️  Other: ${workflows.length - updatedCount - skippedCount} workflow(s)`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    if (updatedCount > 0) {
      console.log('💡 Tip: Refresh your n8n UI to see the updated names.');
    }

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Make sure n8n is running: n8n start');
      console.error('   2. Check that n8n is accessible at http://localhost:5678');
      console.error('   3. Verify API key in credentials/n8n-api-key.txt');
    }
    
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  updateWorkflowNames().catch(error => {
    console.error(`\n❌ Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { updateWorkflowNames, workflowNameUpdates };
