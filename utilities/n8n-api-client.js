/**
 * N8N API Client Utility
 * Helper functions to interact with n8n API using your stored API key
 */

const fs = require('fs');
const path = require('path');

class N8NApiClient {
  constructor(apiKey = null, baseUrl = 'http://localhost:5678') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || this.loadApiKey();
  }

  /**
   * Load API key from credentials file
   */
  loadApiKey() {
    try {
      const credPath = path.join(__dirname, '..', 'credentials', 'n8n-api-key.txt');
      const content = fs.readFileSync(credPath, 'utf8');
      const match = content.match(/API_KEY=(.+)/);
      if (match) {
        return match[1].trim();
      }
    } catch (error) {
      console.warn('Could not load API key from file. Please provide it manually.');
    }
    return null;
  }

  /**
   * Get default headers with API key
   */
  getHeaders() {
    return {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make API request
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.getHeaders()
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * List all workflows
   */
  async listWorkflows() {
    return this.request('GET', '/api/v1/workflows');
  }

  /**
   * Get a specific workflow
   */
  async getWorkflow(id) {
    return this.request('GET', `/api/v1/workflows/${id}`);
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow) {
    return this.request('POST', '/api/v1/workflows', workflow);
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(id, workflow) {
    return this.request('PUT', `/api/v1/workflows/${id}`, workflow);
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id) {
    return this.request('DELETE', `/api/v1/workflows/${id}`);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(id, inputData = {}) {
    return this.request('POST', `/api/v1/workflows/${id}/execute`, inputData);
  }

  /**
   * List executions
   */
  async listExecutions(workflowId = null) {
    const endpoint = workflowId 
      ? `/api/v1/executions?workflowId=${workflowId}`
      : '/api/v1/executions';
    return this.request('GET', endpoint);
  }

  /**
   * Get execution details
   */
  async getExecution(id) {
    return this.request('GET', `/api/v1/executions/${id}`);
  }
}

module.exports = N8NApiClient;

// Example usage:
// const N8NApiClient = require('./n8n-api-client');
// const client = new N8NApiClient();
// const workflows = await client.listWorkflows();
// console.log(workflows);
