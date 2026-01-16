/**
 * N8N Troubleshooting Utility
 * Comprehensive diagnostics for n8n instance
 * 
 * Usage:
 *   node utilities/troubleshoot-n8n.js
 */

const N8NApiClient = require('./n8n-api-client');
const fs = require('fs');
const path = require('path');

async function checkN8nStatus() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  N8N TROUBLESHOOTING DIAGNOSTICS');
  console.log('═══════════════════════════════════════════════════════════\n');

  const issues = [];
  const warnings = [];
  const successes = [];

  // 1. Check if n8n is running
  console.log('1️⃣  Checking n8n Server Status...');
  try {
    const client = new N8NApiClient();
    
    if (!client.apiKey) {
      issues.push('❌ API key not found in credentials/n8n-api-key.txt');
      console.log('   ❌ API key not found');
    } else {
      console.log('   ✅ API key found');
      successes.push('✅ API key configured');
    }

    // Try to connect
    try {
      const workflows = await client.listWorkflows();
      const workflowList = workflows.data || workflows || [];
      
      console.log(`   ✅ n8n is running and accessible`);
      console.log(`   📊 Found ${workflowList.length} workflow(s)`);
      successes.push(`✅ n8n server is running (${workflowList.length} workflows)`);

      // List workflows
      if (workflowList.length > 0) {
        console.log('\n   📋 Workflows:');
        workflowList.forEach((wf, index) => {
          const status = wf.active ? '🟢 Active' : '⚪ Inactive';
          console.log(`      ${index + 1}. ${status} - ${wf.name} (ID: ${wf.id})`);
        });
      }

      // Check for numbered workflows
      const numberedWorkflows = workflowList.filter(wf => /^\d+\.\d+\s/.test(wf.name));
      if (numberedWorkflows.length > 0) {
        console.log(`\n   ✅ ${numberedWorkflows.length} workflow(s) have proper numbering`);
        successes.push(`✅ ${numberedWorkflows.length} workflow(s) properly numbered`);
      }

    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('fetch failed')) {
        issues.push('❌ Cannot connect to n8n - server may not be running');
        console.log('   ❌ Cannot connect to n8n');
        console.log('   💡 Solution: Run "n8n start" to start the server');
      } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        issues.push('❌ API key is invalid or expired');
        console.log('   ❌ API authentication failed');
        console.log('   💡 Solution: Regenerate API key in n8n UI → Settings → API');
      } else {
        issues.push(`❌ API Error: ${errorMsg}`);
        console.log(`   ❌ Error: ${errorMsg}`);
      }
    }

  } catch (error) {
    issues.push(`❌ Unexpected error: ${error.message}`);
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('');

  // 2. Check credentials file
  console.log('2️⃣  Checking Credentials...');
  const credPath = path.join(__dirname, '..', 'credentials', 'n8n-api-key.txt');
  if (fs.existsSync(credPath)) {
    const content = fs.readFileSync(credPath, 'utf8');
    if (content.includes('API_KEY=')) {
      console.log('   ✅ Credentials file exists and has API_KEY');
      successes.push('✅ Credentials file configured');
    } else {
      warnings.push('⚠️  Credentials file exists but API_KEY format may be incorrect');
      console.log('   ⚠️  Credentials file exists but format may be incorrect');
    }
  } else {
    warnings.push('⚠️  Credentials file not found');
    console.log('   ⚠️  Credentials file not found at: ' + credPath);
  }
  console.log('');

  // 3. Check workflow templates
  console.log('3️⃣  Checking Workflow Templates...');
  const templatesDir = path.join(__dirname, '..', 'workflow-templates');
  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`   📄 Found ${jsonFiles.length} JSON template(s)`);
    console.log(`   📄 Found ${mdFiles.length} documentation file(s)`);
    
    if (jsonFiles.length > 0) {
      successes.push(`✅ ${jsonFiles.length} workflow template(s) available`);
      
      // Check for numbered workflows
      const numberedTemplates = jsonFiles.filter(f => /^\d+\.\d+/.test(f) || f.includes('inbox-reminder') || f.includes('daily-briefing') || f.includes('context'));
      if (numberedTemplates.length > 0) {
        console.log(`   ✅ ${numberedTemplates.length} template(s) match master plan numbering`);
      }
    }
  } else {
    warnings.push('⚠️  Workflow templates directory not found');
    console.log('   ⚠️  Templates directory not found');
  }
  console.log('');

  // 4. Check utilities
  console.log('4️⃣  Checking Utilities...');
  const utilitiesDir = path.join(__dirname);
  const utilityFiles = [
    'n8n-api-client.js',
    'import-workflow.js',
    'update-workflow-names.js'
  ];
  
  utilityFiles.forEach(file => {
    const filePath = path.join(utilitiesDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file} exists`);
      successes.push(`✅ Utility: ${file}`);
    } else {
      warnings.push(`⚠️  Utility missing: ${file}`);
      console.log(`   ⚠️  ${file} not found`);
    }
  });
  console.log('');

  // 5. Check port availability
  console.log('5️⃣  Checking Network...');
  try {
    const { execSync } = require('child_process');
    const testResult = execSync('powershell -Command "Test-NetConnection -ComputerName localhost -Port 5678 -InformationLevel Quiet"', { encoding: 'utf8' });
    if (testResult.trim() === 'True') {
      console.log('   ✅ Port 5678 is open');
      successes.push('✅ Port 5678 accessible');
    } else {
      warnings.push('⚠️  Port 5678 may not be accessible');
      console.log('   ⚠️  Port 5678 test inconclusive');
    }
  } catch (error) {
    // Port test failed - might mean port is closed
    warnings.push('⚠️  Could not verify port 5678 status');
    console.log('   ⚠️  Could not verify port status');
  }
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (successes.length > 0) {
    console.log('✅ Successes:');
    successes.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(msg => console.log(`   ${msg}`));
    console.log('');
  }

  if (issues.length > 0) {
    console.log('❌ Issues Found:');
    issues.forEach(msg => console.log(`   ${msg}`));
    console.log('');
    console.log('💡 Recommended Actions:');
    
    if (issues.some(i => i.includes('Cannot connect'))) {
      console.log('   1. Start n8n: n8n start');
    }
    if (issues.some(i => i.includes('API key'))) {
      console.log('   2. Check/regenerate API key in n8n UI → Settings → API');
    }
    console.log('');
  } else {
    console.log('🎉 All checks passed! n8n appears to be working correctly.\n');
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run if executed directly
if (require.main === module) {
  checkN8nStatus().catch(error => {
    console.error(`\n❌ Unexpected error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { checkN8nStatus };
