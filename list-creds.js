const N8NApiClient = require('./utilities/n8n-api-client');

async function listCredentials() {
    const client = new N8NApiClient();
    try {
        // Endpoint for credentials might be /api/v1/credentials
        const response = await client.request('GET', '/api/v1/credentials');
        const creds = response.data || response || [];
        console.log('Found Credentials:');
        creds.forEach(c => console.log(`- ${c.name} (ID: ${c.id}, Type: ${c.type})`));
    } catch (e) {
        console.log('Could not list credentials via API:', e.message);
    }
}

listCredentials();
