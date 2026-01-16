/**
 * Test All Node Workflows
 * 
 * Imports and optionally executes all test workflows to verify node integrations
 */

const N8NApiClient = require('./n8n-api-client');
const fs = require('fs');
const path = require('path');

const TEST_WORKFLOWS_DIR = path.join(__dirname, '..', 'workflow-templates', 'test-workflows');

async function testAllNodes(executeTests = false) {
  const client = new N8NApiClient();

  // Get all test workflow JSON files
  const testFiles = fs.readdirSync(TEST_WORKFLOWS_DIR)
    .filter(file => file.endsWith('.json') && file.startsWith('test-'))
    .map(file => ({
      name: file,
      path: path.join(TEST_WORKFLOWS_DIR, file)
    }));

  console.log(`\n📋 Found ${testFiles.length} test workflows:\n`);

  const results = [];

  for (const testFile of testFiles) {
    try {
      console.log(`📥 Importing: ${testFile.name}...`);

      // Read workflow JSON
      const workflowJson = JSON.parse(fs.readFileSync(testFile.path, 'utf8'));

      // Create clean payload for API
      const cleanWorkflow = {
        name: workflowJson.name,
        nodes: workflowJson.nodes || [],
        connections: workflowJson.connections || {},
        settings: workflowJson.settings || { executionOrder: 'v1' },
        staticData: workflowJson.staticData || null
      };

      // Check if workflow already exists
      const workflowsList = await client.listWorkflows();
      const existingWorkflows = workflowsList.data || workflowsList || [];
      const existing = existingWorkflows.find(w => w.name === cleanWorkflow.name);

      let created;
      if (existing) {
        console.log(`   🔄 Updating existing workflow: ${existing.name} (ID: ${existing.id})`);
        created = await client.updateWorkflow(existing.id, cleanWorkflow);
        console.log(`   ✅ Updated successfully`);
      } else {
        // Create workflow in n8n
        created = await client.createWorkflow(cleanWorkflow);
        console.log(`   ✅ Created: ${created.name} (ID: ${created.id})`);
      }

      console.log(`   🔗 View: http://localhost:5678/workflow/${created.id}`);

      results.push({
        file: testFile.name,
        workflow: created,
        status: 'imported',
        error: null
      });

      // Optionally execute the workflow
      if (executeTests) {
        console.log(`   🧪 Executing workflow...`);
        try {
          // Note: Manual workflows need to be executed via UI or webhook
          // For now, we'll just note that execution should be done manually
          console.log(`   ⚠️  Note: Execute manually in n8n UI to test`);
        } catch (execError) {
          console.log(`   ⚠️  Execution skipped (manual trigger required)`);
        }
      }

      console.log('');

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({
        file: testFile.name,
        workflow: null,
        status: 'error',
        error: error.message
      });
      console.log('');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.status === 'imported').length;
  const failed = results.filter(r => r.status === 'error').length;

  console.log(`✅ Successfully imported: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (successful > 0) {
    console.log('\n📝 Next Steps:');
    console.log('1. Open each workflow in n8n');
    console.log('2. Configure credentials and required parameters');
    console.log('3. Execute each workflow to test');
    console.log('4. Verify all tests pass');
    console.log('\n📚 See workflow-templates/test-workflows/README.md for setup instructions');
  }

  if (failed > 0) {
    console.log('\n⚠️  Failed workflows:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => {
        console.log(`   - ${r.file}: ${r.error}`);
      });
  }

  console.log('\n');

  return results;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const executeTests = args.includes('--execute') || args.includes('-e');

  testAllNodes(executeTests)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { testAllNodes };
