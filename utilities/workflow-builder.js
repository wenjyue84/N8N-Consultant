/**
 * N8N Workflow Builder Utility
 * Helper functions to programmatically create n8n workflows
 */

class N8NWorkflowBuilder {
  constructor(name, description = '') {
    this.workflow = {
      name: name,
      nodes: [],
      connections: {},
      settings: {
        executionOrder: 'v1'
      },
      staticData: null,
      tags: [],
      triggerCount: 0,
      updatedAt: new Date().toISOString(),
      versionId: this.generateId()
    };
    this.nodeMap = new Map();
    this.lastNodeId = null;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Add a node to the workflow
   * @param {string} type - Node type (e.g., 'n8n-nodes-base.webhook', 'n8n-nodes-base.httpRequest')
   * @param {string} name - Display name for the node
   * @param {object} parameters - Node-specific parameters
   * @param {object} position - Position coordinates {x, y}
   * @returns {string} Node ID
   */
  addNode(type, name, parameters = {}, position = null) {
    const nodeId = this.generateId();
    const node = {
      id: nodeId,
      name: name,
      type: type,
      typeVersion: 1,
      position: position || this.getNextPosition(),
      parameters: parameters,
      webhookId: type.includes('webhook') ? this.generateId() : undefined
    };

    this.workflow.nodes.push(node);
    this.nodeMap.set(name, nodeId);
    this.lastNodeId = nodeId;
    return nodeId;
  }

  /**
   * Connect two nodes
   * @param {string} fromNodeName - Source node name
   * @param {string} toNodeName - Target node name
   * @param {number} outputIndex - Output index (default: 0)
   * @param {number} inputIndex - Input index (default: 0)
   */
  connectNodes(fromNodeName, toNodeName, outputIndex = 0, inputIndex = 0) {
    const fromNodeId = this.nodeMap.get(fromNodeName);
    const toNodeId = this.nodeMap.get(toNodeName);

    if (!fromNodeId || !toNodeId) {
      throw new Error(`Node not found: ${fromNodeName} or ${toNodeName}`);
    }

    if (!this.workflow.connections[fromNodeId]) {
      this.workflow.connections[fromNodeId] = {};
    }

    if (!this.workflow.connections[fromNodeId].main) {
      this.workflow.connections[fromNodeId].main = [];
    }

    if (!this.workflow.connections[fromNodeId].main[outputIndex]) {
      this.workflow.connections[fromNodeId].main[outputIndex] = [];
    }

    this.workflow.connections[fromNodeId].main[outputIndex].push({
      node: toNodeId,
      type: 'main',
      index: inputIndex
    });
  }

  /**
   * Get next position for a node (simple grid layout)
   */
  getNextPosition() {
    const nodeCount = this.workflow.nodes.length;
    const x = 250 + (nodeCount % 3) * 300;
    const y = 100 + Math.floor(nodeCount / 3) * 200;
    return { x, y };
  }

  /**
   * Add a tag to the workflow
   */
  addTag(tag) {
    if (!this.workflow.tags.includes(tag)) {
      this.workflow.tags.push(tag);
    }
  }

  /**
   * Get the complete workflow JSON
   */
  toJSON() {
    return JSON.stringify(this.workflow, null, 2);
  }

  /**
   * Get the workflow object
   */
  getWorkflow() {
    return this.workflow;
  }

  /**
   * Helper: Create a webhook trigger node
   */
  addWebhookTrigger(name = 'Webhook', path = 'webhook', httpMethod = 'POST') {
    return this.addNode(
      'n8n-nodes-base.webhook',
      name,
      {
        path: path,
        httpMethod: httpMethod,
        responseMode: 'responseNode'
      }
    );
  }

  /**
   * Helper: Create an HTTP Request node
   */
  addHttpRequest(name = 'HTTP Request', method = 'GET', url = '') {
    return this.addNode(
      'n8n-nodes-base.httpRequest',
      name,
      {
        method: method,
        url: url,
        options: {}
      }
    );
  }

  /**
   * Helper: Create a Set node (for data transformation)
   */
  addSetNode(name = 'Set', values = {}) {
    return this.addNode(
      'n8n-nodes-base.set',
      name,
      {
        values: {
          string: Object.entries(values).map(([key, value]) => ({
            name: key,
            value: value
          }))
        },
        options: {}
      }
    );
  }

  /**
   * Helper: Create an IF condition node
   */
  addIfNode(name = 'IF', conditions = {}) {
    return this.addNode(
      'n8n-nodes-base.if',
      name,
      {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: '',
            typeValidation: 'strict'
          },
          conditions: [conditions]
        }
      }
    );
  }
}

module.exports = N8NWorkflowBuilder;
