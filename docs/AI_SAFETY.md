# 🛡️ AI Safety & Governance

This document outlines the security measures implemented to ensure the safe operation of AI agents within Jay's n8n ecosystem.

## 1. The Safety Policy

We strictly enforce a "System Prompt" injection for all AI nodes. This prompt is stored securely in:
`credentials/safety_policy.txt`

### Key Directives
*   **Zero-Trust for Secrets**: AI agents are strictly forbidden from outputting raw API keys or tokens.
*   **Human-in-the-Loop**: Destructive actions (DELETE, DROP, REMOVE) require explicit confirmation.
*   **No Hallucinations**: Agents must report failures honestly rather than fabricating success.

## 2. Implementation Guide

When creating a new AI Workflow (e.g., using OpenAI or Anthropic nodes):

1.  **Add a "Read File" Node**:
    *   Path: `/home/node/.n8n/credentials/safety_policy.txt` (or your local path `.../credentials/safety_policy.txt`)
    *   Property Name: `safety_prompt`

2.  **Configure the AI Agent**:
    *   In the "System Message" or "Prompt" field, strictly prepend the safety policy.
    *   Example: `{{ $json.safety_prompt }} \n\n Now process the user request: ...`

## 3. Storage Security

*   The `credentials/` folder is **git-ignored**, ensuring the policy and keys never leak to public repositories.
*   Access is restricted to the local file system.

## 4. Audit & Monitoring

*   Regularly review `Execution History` in n8n to ensure agents are adhering to the protocol.
*   If an agent violates a rule, immediately **Stop** the instance and refine the `safety_policy.txt`.
