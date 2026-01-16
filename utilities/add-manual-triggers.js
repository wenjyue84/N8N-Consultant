const fs = require('fs');
const path = require('path');
const N8NApiClient = require('./n8n-api-client');

const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflow-templates', 'test-workflows');

async function addManualTriggers() {
    const client = new N8NApiClient();
    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.json'));

    console.log(`🔌 Adding Manual Triggers to ${files.length} workflows...`);

    for (const file of files) {
        // Read local file (though we should strictly edit the remote one to be safe, 
        // but we are the source of truth if we updated them recently. 
        // Actually, best to fetch from API to ensure we have the Webhook ID and correct state)
        // But our previous script updated the files? No, it only read them and updated API. 
        // It didn't save back to file.
        // So the local files still have the old "Manual Trigger" OR "Start" depending on which version.

        // Let's fetch the LIVE workflow from n8n to modify it.
        // We can match by name.

        const rawContent = fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8');
        const localJson = JSON.parse(rawContent);
        const workflowName = localJson.name; // Use name from local file to find it

        console.log(`   Processing ${workflowName}...`);

        const workflowsList = await client.listWorkflows();
        const existing = (workflowsList.data || workflowsList || []).find(w => w.name === workflowName);

        if (!existing) {
            console.log(`      ⚠️  Workflow not found in n8n, skipping.`);
            continue;
        }

        // Get full workflow data
        const workflow = await client.getWorkflow(existing.id);

        // Check if Manual Trigger already exists
        const hasManual = workflow.nodes.find(n => n.type === 'n8n-nodes-base.manualTrigger');
        if (hasManual) {
            console.log(`      ⚪ Manual trigger already exists.`);
            // We might want to ensure it's connected, but let's assume if it exists it's fine 
            // OR we are adding it back if missing.
            continue;
        }

        // Find the Webhook node to see what it connects to
        const webhookNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
        if (!webhookNode) {
            console.log(`      ⚠️  No Webhook node found. Cannot determine connection target easily.`);
            continue;
        }

        // Get the connections from the Webhook
        const outgoingConnections = workflow.connections[webhookNode.name];
        if (!outgoingConnections || !outgoingConnections.main || !outgoingConnections.main.length) {
            console.log(`      ⚠️  Webhook has no outgoing connections.`);
            continue;
        }

        // Create Manual Trigger Node
        const manualNode = {
            parameters: {},
            id: 'manual-trigger-' + Math.random().toString(36).substring(7),
            name: 'When clicking "Execute Workflow"',
            type: 'n8n-nodes-base.manualTrigger',
            typeVersion: 1,
            position: [webhookNode.position[0], webhookNode.position[1] - 200] // 200 pixels above
        };

        // Add node
        workflow.nodes.push(manualNode);

        // Add connection
        // We copy the connections from the Webhook
        workflow.connections[manualNode.name] = outgoingConnections;

        // Clean for update
        const cleanWorkflow = {
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            settings: workflow.settings || { executionOrder: 'v1' },
            staticData: null
        };

        try {
            await client.updateWorkflow(existing.id, cleanWorkflow);
            console.log(`      ✅ Added Manual Trigger`);

            // Save back to local file so our templates are up to date!
            localJson.nodes = cleanWorkflow.nodes;
            localJson.connections = cleanWorkflow.connections;
            fs.writeFileSync(path.join(WORKFLOWS_DIR, file), JSON.stringify(localJson, null, 2));
            console.log(`      💾 Saved to local file`);

        } catch (e) {
            console.log(`      ❌ Update failed: ${e.message}`);
        }
    }
}

addManualTriggers();
