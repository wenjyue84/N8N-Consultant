/**
 * List all workflows from n8n instance
 */

const N8NApiClient = require('./n8n-api-client');

async function listAllWorkflows() {
  const client = new N8NApiClient();

  try {
    console.log('Connecting to n8n API...');
    console.log(`Base URL: ${client.baseUrl}`);
    
    const response = await client.listWorkflows();
    
    if (response && response.data) {
      const workflows = response.data;
      console.log(`\n✅ Found ${workflows.length} workflow(s):\n`);
      
      if (workflows.length === 0) {
        console.log('No workflows found in your n8n instance.');
        return;
      }

      // Display workflows in a formatted table
      workflows.forEach((workflow, index) => {
        console.log(`${index + 1}. ${workflow.name}`);
        console.log(`   ID: ${workflow.id}`);
        console.log(`   Active: ${workflow.active ? 'Yes' : 'No'}`);
        console.log(`   Created: ${workflow.createdAt ? new Date(workflow.createdAt).toLocaleString() : 'N/A'}`);
        console.log(`   Updated: ${workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleString() : 'N/A'}`);
        if (workflow.tags && workflow.tags.length > 0) {
          console.log(`   Tags: ${workflow.tags.map(t => t.name).join(', ')}`);
        }
        console.log('');
      });

      // Summary
      const activeCount = workflows.filter(w => w.active).length;
      console.log(`\nSummary: ${activeCount} active, ${workflows.length - activeCount} inactive`);
      
    } else {
      console.log('Unexpected response format:', response);
    }

  } catch (error) {
    console.error('\n❌ Error connecting to n8n API:');
    console.error(error.message);
    
    if (error.message.includes('fetch')) {
      console.error('\n💡 Tip: Make sure:');
      console.error('   1. n8n is running (try: n8n start)');
      console.error('   2. The API key is correct');
      console.error('   3. You have Node.js 18+ (for native fetch) or install node-fetch');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  listAllWorkflows();
}

module.exports = { listAllWorkflows };
