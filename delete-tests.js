const N8NApiClient = require('./utilities/n8n-api-client');

async function cleanSlate() {
    const client = new N8NApiClient();

    console.log('🔍 Listing all workflows...');
    const response = await client.listWorkflows();
    const workflows = response.data || response || [];

    const testWorkflows = workflows.filter(w => w.name && w.name.startsWith('TEST:'));

    console.log(`🗑️  Found ${testWorkflows.length} test workflows to remove/refresh.`);

    for (const wf of testWorkflows) {
        console.log(`   Deleting: ${wf.name} (ID: ${wf.id})`);
        try {
            await client.deleteWorkflow(wf.id);
            console.log('   ✅ Deleted');
        } catch (e) {
            console.log(`   ❌ Failed to delete: ${e.message}`);
        }
    }
}

cleanSlate();
