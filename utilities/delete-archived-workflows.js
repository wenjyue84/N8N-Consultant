/**
 * Delete Archived/Test Workflows
 * Identifies and deletes test workflows and duplicates
 * 
 * Usage:
 *   node utilities/delete-archived-workflows.js
 *   node utilities/delete-archived-workflows.js --dry-run  (preview only)
 */

const N8NApiClient = require('./n8n-api-client');

// Patterns to identify test/archived workflows
const TEST_PATTERNS = [
  /^Hello World/i,
  /^Simple Hello World/i,
  /^joke$/i,
  /^Test/i,
];

// Workflows to keep (by name pattern or ID)
const KEEP_WORKFLOWS = [
  /^\d+\.\d+\s/,  // Keep numbered workflows (e.g., "1.3 Daily Briefing")
  /Inbox Processing/i,
  /Context Switcher/i,
  /Daily Briefing/i,
  /Response to Webhook/i,  // Might be important
];

function isTestWorkflow(workflow) {
  // Check if it matches test patterns
  for (const pattern of TEST_PATTERNS) {
    if (pattern.test(workflow.name)) {
      return true;
    }
  }
  return false;
}

function shouldKeepWorkflow(workflow) {
  // Check if it matches keep patterns
  for (const pattern of KEEP_WORKFLOWS) {
    if (pattern.test(workflow.name)) {
      return true;
    }
  }
  return false;
}

function findDuplicates(workflows) {
  const nameMap = new Map();
  const duplicates = [];

  workflows.forEach(wf => {
    if (!nameMap.has(wf.name)) {
      nameMap.set(wf.name, []);
    }
    nameMap.get(wf.name).push(wf);
  });

  nameMap.forEach((wfList, name) => {
    if (wfList.length > 1) {
      // Keep the most recently updated one, mark others as duplicates
      wfList.sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0);
        const bTime = new Date(b.updatedAt || b.createdAt || 0);
        return bTime - aTime;
      });
      // All except the first (most recent) are duplicates
      duplicates.push(...wfList.slice(1));
    }
  });

  return duplicates;
}

async function deleteArchivedWorkflows(dryRun = false) {
  const client = new N8NApiClient();

  if (!client.apiKey) {
    console.error('❌ Error: API key not found. Check credentials/n8n-api-key.txt');
    process.exit(1);
  }

  try {
    console.log('🔄 Fetching workflows from n8n...\n');
    
    const response = await client.listWorkflows();
    const workflows = response.data || response || [];
    
    if (workflows.length === 0) {
      console.log('⚠️  No workflows found in n8n.');
      return;
    }

    console.log(`📋 Found ${workflows.length} total workflow(s)\n`);

    // Identify workflows to delete
    const toDelete = [];
    const toKeep = [];

    workflows.forEach(workflow => {
      if (shouldKeepWorkflow(workflow)) {
        toKeep.push(workflow);
      } else if (isTestWorkflow(workflow)) {
        toDelete.push({ workflow, reason: 'Test workflow' });
      } else {
        // Check if it's a duplicate
        const duplicates = findDuplicates(workflows);
        if (duplicates.some(d => d.id === workflow.id)) {
          toDelete.push({ workflow, reason: 'Duplicate workflow' });
        } else {
          toKeep.push(workflow);
        }
      }
    });

    // Also check for duplicates separately
    const duplicates = findDuplicates(workflows);
    duplicates.forEach(dup => {
      if (!toDelete.some(item => item.workflow.id === dup.id) && 
          !shouldKeepWorkflow(dup)) {
        toDelete.push({ workflow: dup, reason: 'Duplicate workflow' });
      }
    });

    // Display results
    console.log('📊 Analysis:\n');
    console.log(`   ✅ To Keep: ${toKeep.length} workflow(s)`);
    console.log(`   🗑️  To Delete: ${toDelete.length} workflow(s)\n`);

    if (toDelete.length === 0) {
      console.log('✨ No archived workflows found to delete!');
      return;
    }

    console.log('🗑️  Workflows to be deleted:\n');
    toDelete.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.workflow.name}`);
      console.log(`      ID: ${item.workflow.id}`);
      console.log(`      Reason: ${item.reason}`);
      console.log(`      Created: ${new Date(item.workflow.createdAt).toLocaleString()}`);
      console.log('');
    });

    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No workflows were actually deleted.');
      console.log('   Run without --dry-run to delete these workflows.');
      return;
    }

    // Confirm deletion
    console.log('⚠️  WARNING: This will permanently delete the workflows listed above.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete workflows
    console.log('🗑️  Deleting workflows...\n');
    let deletedCount = 0;
    let errorCount = 0;

    for (const item of toDelete) {
      try {
        await client.deleteWorkflow(item.workflow.id);
        console.log(`   ✅ Deleted: ${item.workflow.name} (${item.workflow.id})`);
        deletedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to delete ${item.workflow.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n✨ Done! Deleted ${deletedCount} workflow(s), ${errorCount} error(s)`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-d');

// Run
deleteArchivedWorkflows(dryRun);
