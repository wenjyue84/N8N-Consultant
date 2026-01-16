const N8NApiClient = require('./n8n-api-client');

async function runTests() {
    const client = new N8NApiClient();

    console.log('🔍 Fetching all workflows...');
    const response = await client.listWorkflows();
    const workflows = response.data || response || [];

    const testWorkflows = workflows.filter(w => w.name.startsWith('TEST:') || w.name.startsWith('Test:'));

    console.log(`📋 Found ${testWorkflows.length} test workflows to execute.\n`);

    const results = [];

    for (const wf of testWorkflows) {
        console.log(`▶️  Executing: ${wf.name} (ID: ${wf.id})...`);

        try {
            // Infer slug from name
            // "TEST: Gmail" -> "test-gmail"
            // "Test: Anthropic Connection" -> "test-anthropic-connection" - Wait, my slug logic in enable-api-testing.js was simple file replace.
            // File: test-gmail.json -> slug: test-gmail
            // Workflow Name: TEST: Gmail
            // Let's assume standard slug format: lowercase, replace ': ' with '-', replace spaces with '-'
            // Actually, simpler: just use the slug we know we generated: test- + lowercase words
            // Better yet, let's fetch the workflow and check the webhook node path!

            const detailedWf = await client.getWorkflow(wf.id);
            const webhookNode = (detailedWf.nodes || []).find(n => n.type === 'n8n-nodes-base.webhook');

            if (!webhookNode) {
                console.log(`   ⚠️  No Webhook node found. Skipping.`);
                results.push({ name: wf.name, status: 'skipped', error: 'No webhook node' });
                continue;
            }

            const slug = webhookNode.parameters.path;
            const url = `http://localhost:5678/webhook/${slug}`;

            console.log(`   🔗 Webhook: ${url}`);

            const response = await fetch(url);

            if (response.ok) {
                const text = await response.text();
                console.log(`   ✅ Success! Response: ${text.substring(0, 100)}...`);
                results.push({ name: wf.name, status: 'success' });
            } else {
                console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
                results.push({ name: wf.name, status: 'failed', error: `${response.status} ${response.statusText}` });
            }

        } catch (error) {
            console.log(`   ❌ Error starting execution: ${error.message}`);
            results.push({ name: wf.name, status: 'error', error: error.message });
        }
        console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    results.forEach(r => {
        const icon = r.status === 'success' ? '✅' : '❌';
        console.log(`${icon} ${r.name}: ${r.status.toUpperCase()} ${r.error ? `(${r.error})` : ''}`);
    });
}

runTests();
