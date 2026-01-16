# N8N Consultant

An AI-powered consultant to help you create n8n workflows. This consultant provides guidance, templates, and utilities for building automation workflows in n8n.

## Features

- Workflow creation guidance
- Template workflows for common use cases
- Workflow validation and optimization suggestions
- Node configuration assistance
- Best practices and patterns

## Usage

Simply ask questions about creating n8n workflows, and the consultant will help you:

- Design workflow structures
- Configure nodes properly
- Connect different services
- Handle errors and edge cases
- Optimize workflow performance

## Prerequisites

- n8n installed (version 2.3.5+)
- n8n server running (local or remote)
- API key configured (stored in `credentials/n8n-api-key.txt`)

## Workflow Creation

The consultant can help you create workflows by:

1. Understanding your automation needs
2. Suggesting appropriate nodes and connections
3. Providing workflow JSON that can be imported into n8n
4. Explaining node configurations and parameters

## API Integration

Your n8n API key is stored securely in `credentials/n8n-api-key.txt`. Use the API client utilities to programmatically interact with your n8n instance:

- `utilities/n8n-api-client.js` - Full-featured API client
- `utilities/api-client-example.js` - Usage examples

## Examples

Ask questions like:
- "How do I create a workflow that sends an email when a new file is uploaded?"
- "Help me set up a workflow to sync data between two APIs"
- "Create a workflow template for webhook processing"
- "Use the API to list all my workflows"