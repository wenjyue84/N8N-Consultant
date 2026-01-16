# N8N Consultant Utilities

Utility functions and helpers for creating n8n workflows programmatically.

## Workflow Builder

The `workflow-builder.js` provides a JavaScript class to programmatically create n8n workflows.

### Example Usage

```javascript
const N8NWorkflowBuilder = require('./workflow-builder');

// Create a new workflow
const builder = new N8NWorkflowBuilder('My Workflow', 'Description');

// Add a webhook trigger
builder.addWebhookTrigger('Webhook', 'my-webhook');

// Add an HTTP request node
builder.addHttpRequest('Call API', 'GET', 'https://api.example.com/data');

// Connect nodes
builder.connectNodes('Webhook', 'Call API');

// Get the workflow JSON
const workflowJSON = builder.toJSON();
console.log(workflowJSON);
```

## Future Utilities

Additional utilities will be added for:
- Workflow validation
- Node configuration helpers
- Workflow optimization
- Import/export utilities
