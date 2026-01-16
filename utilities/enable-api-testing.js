const fs = require('fs');
const path = require('path');
const N8NApiClient = require('./n8n-api-client');

const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflow-templates', 'test-workflows');

async function enableApiTesting() {
    const client = new N8NApiClient();
    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.json'));

    console.log(`🔌 Enabling API Testing for ${files.length} workflows...`);

    for (const file of files) {
        const rawContent = fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8');
        const workflow = JSON.parse(rawContent);

        // Generate slug
        const slug = file.replace('.json', '').toLowerCase();

        console.log(`   Processing ${workflow.name} -> webhook/${slug}`);

        // 1. Remove existing Trigger/Start nodes
        // workflow.nodes = workflow.nodes.filter(n => 
        //   !['n8n-nodes-base.start', 'n8n-nodes-base.manualTrigger'].includes(n.type)
        // );

        // Actually, let's just LOOK for the manual trigger and REPLACE it, or ADD webhook if missing
        let triggerNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.manualTrigger');

        // New Webhook Node
        const webhookNode = {
            parameters: {
                httpMethod: 'GET',
                path: slug,
                options: {}
            },
            id: 'webhook-trigger',
            name: 'Webhook',
            type: 'n8n-nodes-base.webhook',
            typeVersion: 1,
            position: [180, 300],
            webhookId: 'wh-' + Math.random().toString(36).substring(7)
        };

        if (triggerNode) {
            // Replace connections from old trigger to new webhook
            if (workflow.connections[triggerNode.name]) {
                workflow.connections['Webhook'] = workflow.connections[triggerNode.name];
                delete workflow.connections[triggerNode.name];
            }
            // Replace node
            const idx = workflow.nodes.indexOf(triggerNode);
            workflow.nodes[idx] = webhookNode;
        } else {
            // Add to beginning
            workflow.nodes.unshift(webhookNode);
            // We might need to connect it to the first node manually if valid connections don't exist
            // But our templates usually have a start node, so the replace logic above captures 99% cases.
        }

        // 2. Ensure Active
        workflow.active = true;

        // 3. Update in n8n
        // Find existing ID
        const workflowsList = await client.listWorkflows();
        const existing = (workflowsList.data || workflowsList || []).find(w => w.name === workflow.name);

        if (existing) {
            // We must preserve ID to update
            // API client updateWorkflow takes (id, workflow)
            // Clean workflow for API
            // Clean workflow for API
            const cleanWorkflow = {
                name: workflow.name,
                nodes: workflow.nodes,
                connections: workflow.connections,
                settings: workflow.settings || { executionOrder: 'v1' },
                staticData: null
            };

            try {
                await client.updateWorkflow(existing.id, cleanWorkflow);
                console.log(`      ✅ Updated (ID: ${existing.id})`);

                // Activate workflow separately
                try {
                    await client.request('POST', `/api/v1/workflows/${existing.id}/activate`);
                    console.log(`      🚀 Activated`);
                } catch (actErr) {
                    console.log(`      ⚠️ Activation warning: ${actErr.message}`);
                }

            } catch (e) {
                console.log(`      ❌ Update failed: ${e.message}`);
            }
        } else {
            console.log(`      ⚠️  Workflow not found in n8n, skipping update.`);
        }
    }
}

enableApiTesting();
