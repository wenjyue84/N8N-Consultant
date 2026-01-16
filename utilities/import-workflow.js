/**
 * Import Workflow Utility
 * Imports a workflow JSON file into n8n using API, with CLI fallback
 * 
 * Usage:
 *   node utilities/import-workflow.js <workflow-file>
 *   node utilities/import-workflow.js workflow-templates/notion-inbox-reminder.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const N8NApiClient = require('./n8n-api-client');

async function importWorkflow(workflowPath) {
  const fullPath = path.resolve(workflowPath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Error: Workflow file not found: ${fullPath}`);
    process.exit(1);
  }

  // Read workflow JSON
  let workflow;
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    workflow = JSON.parse(content);
    console.log(`📄 Loaded workflow: ${workflow.name}`);
  } catch (error) {
    console.error(`❌ Error reading workflow file: ${error.message}`);
    process.exit(1);
  }

  // Clean workflow for API (remove fields that API doesn't accept)
  function cleanWorkflowForAPI(wf) {
    const cleaned = {
      name: wf.name,
      nodes: wf.nodes || [],
      connections: wf.connections || {},
      settings: wf.settings || { executionOrder: 'v1' },
      staticData: wf.staticData || null
      // tags: Array.isArray(wf.tags) 
      //   ? wf.tags.map(t => typeof t === 'string' ? t : t.name).filter(Boolean)
      //   : []
    };
    return cleaned;
  }

  // Try API first
  console.log('\n🔄 Attempting to import via API...');
  try {
    const client = new N8NApiClient();

    if (!client.apiKey) {
      throw new Error('API key not found. Check credentials/n8n-api-key.txt');
    }

    // Test connection by listing workflows
    const existingWorkflows = await client.listWorkflows();
    const workflows = existingWorkflows.data || existingWorkflows || [];
    const existing = workflows.find(w => w.name === workflow.name);

    if (existing) {
      console.log(`⚠️  Workflow "${workflow.name}" already exists (ID: ${existing.id})`);
      console.log('   Updating existing workflow...');
      const cleaned = cleanWorkflowForAPI(workflow);
      const updated = await client.updateWorkflow(existing.id, cleaned);
      console.log(`✅ Successfully updated workflow via API!`);
      console.log(`   Workflow ID: ${updated.id}`);
      return;
    }

    // Create new workflow
    const cleaned = cleanWorkflowForAPI(workflow);
    const created = await client.createWorkflow(cleaned);
    console.log(`✅ Successfully imported workflow via API!`);
    console.log(`   Workflow ID: ${created.id}`);
    console.log(`   Name: ${created.name}`);
    return;

  } catch (error) {
    const errorMsg = error.message || error.toString();
    if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('fetch failed')) {
      console.log(`⚠️  Cannot connect to n8n API (is n8n running?)`);
      console.log(`   Error: ${errorMsg}`);
    } else {
      console.log(`⚠️  API import failed: ${errorMsg}`);
    }
    console.log('🔄 Falling back to CLI import...\n');
  }

  // Fallback to CLI
  try {
    console.log('📦 Importing via n8n CLI...');
    const command = `npx n8n import:workflow --input="${fullPath}" --replaceExisting`;

    console.log(`   Running: ${command}`);
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('\n✅ Successfully imported workflow via CLI!');
    console.log('   Note: Refresh n8n UI to see the imported workflow');

  } catch (error) {
    console.error(`\n❌ CLI import also failed: ${error.message}`);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure n8n is installed: npm install -g n8n');
    console.error('   2. Check that the workflow JSON is valid');
    console.error('   3. Try importing manually via n8n UI');
    process.exit(1);
  }
}

// Main execution
const workflowPath = process.argv[2];

if (!workflowPath) {
  console.error('❌ Error: Workflow file path required');
  console.error('\nUsage:');
  console.error('  node utilities/import-workflow.js <workflow-file>');
  console.error('\nExample:');
  console.error('  node utilities/import-workflow.js workflow-templates/notion-inbox-reminder.json');
  process.exit(1);
}

importWorkflow(workflowPath).catch(error => {
  console.error(`\n❌ Unexpected error: ${error.message}`);
  process.exit(1);
});
