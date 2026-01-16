const N8NApiClient = require('./n8n-api-client');

async function verifyExecutions() {
    const client = new N8NApiClient();

    console.log('🔍 Fetching recent executions...');

    // Fetch last 20 executions
    const executions = await client.listExecutions();
    const list = executions.data || executions || [];

    if (list.length === 0) {
        console.log('No recent executions found.');
        return;
    }

    console.log(`📋 Analyzing ${list.length} recent executions...\n`);

    if (list.length > 0) {
        console.log('Sample Execution Keys:', Object.keys(list[0]));
    }

    for (const exec of list) {
        // n8n version variation: workflowName vs workflowData
        const name = exec.workflowName || (exec.workflowData && exec.workflowData.name);
        const id = exec.workflowId || (exec.workflowData && exec.workflowData.id);

        if (!name) continue;

        // Only care about test workflows
        if (!name.startsWith('TEST:') && !name.startsWith('Test:')) continue;

        // We only want the LATEST execution for each workflow
        if (!distinctWorkflows[name]) {
            distinctWorkflows[name] = exec;
        }
    }

    const results = Object.values(distinctWorkflows).sort((a, b) => a.workflowData.name.localeCompare(b.workflowData.name));

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 EXECUTION STATUS REPORT');
    console.log('═══════════════════════════════════════════════════════════');

    for (const exec of results) {
        const status = exec.finished ? (exec.data && exec.data.resultData && exec.data.resultData.error ? 'FAILED' : 'SUCCESS') : 'RUNNING/UNKNOWN';
        // Note: listExecutions might not return full details, usually need getExecution for error details if not present.
        // But 'finished' is reliable. If finished=true and no success info...
        // Actually let's assume if it finished and has no error, it is success.

        // n8n API Structure:
        // - finished: true/false
        // - mode: 'webhook', 'manual', etc.
        // - startedAt, stoppedAt

        let icon = '❓';
        let errorMsg = '';

        if (exec.finished) {
            // We might need to fetch full details if error is not in list view
            // List view usually has `data.resultData.error` if failed?
            // Let's check `stoppedAt`.

            // Fetch details to be sure
            const details = await client.getExecution(exec.id);
            if (details.data && details.data.resultData && details.data.resultData.error) {
                icon = '❌';
                errorMsg = details.data.resultData.error.message;
            } else {
                icon = '✅';
            }
        } else {
            icon = '⏳';
        }

        console.log(`${icon} ${exec.workflowData.name}`);
        if (errorMsg) {
            console.log(`   🔴 Error: ${errorMsg}`);
        }
        console.log(`   🕒 Time: ${exec.startedAt}`);
        console.log('');
    }
}

verifyExecutions();
