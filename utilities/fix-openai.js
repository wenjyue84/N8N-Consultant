const N8NApiClient = require('./n8n-api-client');
const fs = require('fs');
const path = require('path');

async function fixOpenAI() {
    const client = new N8NApiClient();

    // 1. Find all OpenAI workflows
    const workflows = await client.listWorkflows();
    const list = workflows.data || workflows || [];

    const openaiWorkflows = list.filter(w => w.name === 'Test: OpenAI Connection');

    console.log(`Found ${openaiWorkflows.length} OpenAI workflows.`);

    // 2. Delete ALL of them to be safe
    for (const wf of openaiWorkflows) {
        console.log(`Deleting ${wf.name} (${wf.id})...`);
        await client.deleteWorkflow(wf.id);
    }

    // 3. Create fresh from template
    const file = path.join(__dirname, '..', 'workflow-templates', 'test-workflows', 'test-openai.json');
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));

    const cleanWorkflow = {
        name: content.name,
        nodes: content.nodes,
        connections: content.connections,
        settings: content.settings || {},
        staticData: null
    };

    const created = await client.createWorkflow(cleanWorkflow);
    console.log(`✅ Created fresh OpenAI workflow: ${created.name} (${created.id})`);

    // 4. Activate
    try {
        await client.request('POST', `/api/v1/workflows/${created.id}/activate`);
        console.log(`🚀 Activated`);
    } catch (e) {
        console.log(`⚠️ Activation failed (check credentials): ${e.message}`);
    }
}

fixOpenAI();
