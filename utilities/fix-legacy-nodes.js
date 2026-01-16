const fs = require('fs');
const path = require('path');

const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflow-templates', 'test-workflows');

function migrateStartNode(workflow) {
    let modified = false;
    let oldStartName = null;
    const newStartName = 'When clicking "Execute Workflow"';

    // 1. Find and update the Start node
    for (const node of workflow.nodes) {
        if (node.type === 'n8n-nodes-base.start') {
            console.log(`   Found legacy Start node: "${node.name}"`);
            oldStartName = node.name;

            node.type = 'n8n-nodes-base.manualTrigger';
            node.name = newStartName;
            node.parameters = {}; // manualTrigger usually has empty params

            modified = true;
        }
    }

    // 2. Update connections if needed
    if (modified && oldStartName && workflow.connections[oldStartName]) {
        console.log(`   Updating connections from "${oldStartName}" to "${newStartName}"`);
        workflow.connections[newStartName] = workflow.connections[oldStartName];
        delete workflow.connections[oldStartName];
    }

    return modified;
}

function fixWorkflows() {
    if (!fs.existsSync(WORKFLOWS_DIR)) {
        console.error(`Directory not found: ${WORKFLOWS_DIR}`);
        return;
    }

    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(WORKFLOWS_DIR, file);
        console.log(`Checking ${file}...`);

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const workflow = JSON.parse(content);

            if (migrateStartNode(workflow)) {
                fs.writeFileSync(filePath, JSON.stringify(workflow, null, 2));
                console.log(`   ✅ Fixed and saved ${file}`);
            } else {
                console.log(`   ⚪ No changes needed`);
            }
        } catch (error) {
            console.error(`   ❌ Error processing ${file}: ${error.message}`);
        }
    }
}

fixWorkflows();
