/**
 * N8N Workflow Builder Utility
 * Helper functions to construct n8n workflow JSON programmatically
 * Used by the n8n-workflow-builder Claude skill
 */

const fs = require('fs');
const path = require('path');
const N8NApiClient = require('./n8n-api-client');

/**
 * Workflow Builder Class
 * Provides a fluent API for building n8n workflows
 */
class WorkflowBuilder {
  constructor(name, description = '') {
    this.workflow = {
      name,
      description,
      active: false,
      nodes: [],
      connections: {},
      settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false
      }
    };
    this.nodePositions = {
      x: 180,
      y: 300,
      xSpacing: 220
    };
  }

  /**
   * Add a Manual Trigger node
   */
  addManualTrigger(options = {}) {
    const nodeId = options.id || 'manual-trigger';
    const node = {
      parameters: {},
      id: nodeId,
      name: options.name || 'When clicking "Execute Workflow"',
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: options.position || [this.nodePositions.x, 100]
    };
    this.workflow.nodes.push(node);
    return this;
  }

  /**
   * Add a Webhook Trigger node
   */
  addWebhookTrigger(path, options = {}) {
    const nodeId = options.id || 'webhook-trigger';
    const node = {
      parameters: {
        httpMethod: options.method || 'GET',
        path,
        options: options.webhookOptions || {}
      },
      id: nodeId,
      name: options.name || 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: options.position || [this.nodePositions.x, this.nodePositions.y]
    };

    if (options.webhookId) {
      node.webhookId = options.webhookId;
    }

    this.workflow.nodes.push(node);
    return this;
  }

  /**
   * Add a Schedule Trigger node
   */
  addScheduleTrigger(cronExpression, options = {}) {
    const nodeId = options.id || 'schedule-trigger';
    const node = {
      parameters: {
        rule: {
          interval: [{
            field: 'cronExpression',
            expression: cronExpression
          }]
        }
      },
      id: nodeId,
      name: options.name || 'Schedule Trigger',
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1.2,
      position: options.position || [this.nodePositions.x, this.nodePositions.y]
    };
    this.workflow.nodes.push(node);
    return this;
  }

  /**
   * Add an HTTP Request node
   */
  addHttpRequest(url, options = {}) {
    const nodeId = options.id || this.generateNodeId('http-request');
    const x = this.nodePositions.x + (this.workflow.nodes.length * this.nodePositions.xSpacing);

    const node = {
      parameters: {
        url,
        method: options.method || 'GET',
        ...options.parameters
      },
      id: nodeId,
      name: options.name || 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: options.typeVersion || 4.2,
      position: options.position || [x, this.nodePositions.y]
    };

    // Add authentication if provided
    if (options.authentication) {
      node.parameters.authentication = options.authentication;
    }

    // Add body parameters for POST/PUT
    if (options.bodyParameters) {
      node.parameters.sendBody = true;
      node.parameters.contentType = options.contentType || 'json';
      node.parameters.bodyParameters = options.bodyParameters;
    }

    // Add query parameters
    if (options.queryParameters) {
      node.parameters.options = node.parameters.options || {};
      node.parameters.options.queryParameters = options.queryParameters;
    }

    this.workflow.nodes.push(node);
    return this;
  }

  /**
   * Add a Code node (JavaScript)
   */
  addCode(jsCode, options = {}) {
    const nodeId = options.id || this.generateNodeId('code');
    const x = this.nodePositions.x + (this.workflow.nodes.length * this.nodePositions.xSpacing);

    const node = {
      parameters: {
        jsCode
      },
      id: nodeId,
      name: options.name || 'Code',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: options.position || [x, this.nodePositions.y]
    };
    this.workflow.nodes.push(node);
    return this;
  }

  /**
   * Generate a unique node ID
   */
  generateNodeId(prefix) {
    const existingIds = this.workflow.nodes.map(n => n.id);
    let counter = 1;
    let id = `${prefix}-${counter}`;
    while (existingIds.includes(id)) {
      counter++;
      id = `${prefix}-${counter}`;
    }
    return id;
  }

  /**
   * Connect two nodes
   */
  connect(fromNodeId, toNodeId, options = {}) {
    const outputType = options.outputType || 'main';
    const outputIndex = options.outputIndex || 0;
    const inputIndex = options.inputIndex || 0;

    if (!this.workflow.connections[fromNodeId]) {
      this.workflow.connections[fromNodeId] = {};
    }
    if (!this.workflow.connections[fromNodeId][outputType]) {
      this.workflow.connections[fromNodeId][outputType] = [];
    }
    if (!this.workflow.connections[fromNodeId][outputType][outputIndex]) {
      this.workflow.connections[fromNodeId][outputType][outputIndex] = [];
    }

    this.workflow.connections[fromNodeId][outputType][outputIndex].push({
      node: toNodeId,
      type: outputType,
      index: inputIndex
    });

    return this;
  }

  /**
   * Set workflow as active
   */
  setActive(active = true) {
    this.workflow.active = active;
    return this;
  }

  /**
   * Build and return the workflow JSON
   */
  build() {
    return this.workflow;
  }

  /**
   * Save workflow to file
   */
  save(filename, directory = null) {
    const dir = directory || path.join(__dirname, '..', 'workflow-templates');
    const filepath = path.join(dir, filename);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(filepath, JSON.stringify(this.workflow, null, 2));
    console.log(`✅ Workflow saved to: ${filepath}`);
    return filepath;
  }

  /**
   * Generate workflow documentation
   */
  generateDocs() {
    const docs = [];
    docs.push(`# ${this.workflow.name}\n`);

    if (this.workflow.description) {
      docs.push(`${this.workflow.description}\n`);
    }

    docs.push(`## Nodes\n`);
    this.workflow.nodes.forEach(node => {
      docs.push(`- **${node.name}** (${node.type})`);
    });

    docs.push(`\n## Connections\n`);
    Object.keys(this.workflow.connections).forEach(fromNode => {
      const connections = this.workflow.connections[fromNode].main || [];
      connections.forEach((targets, idx) => {
        targets.forEach(target => {
          docs.push(`- ${fromNode} → ${target.node}`);
        });
      });
    });

    return docs.join('\n');
  }
}

module.exports = { WorkflowBuilder };
