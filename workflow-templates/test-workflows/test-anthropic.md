# Test: Anthropic Connection

This workflow verifies your connection to Anthropic's API (Claude).

## Prerequisites

1.  **Anthropic Account**: Active account at console.anthropic.com.
2.  **API Key**: Generate a key from the console.
3.  **Credits**: Ensure you have available credits.

## Setup Instructions

1.  **Credentials**:
    *   Create an **Anthropic** credential in n8n.
    *   Paste your API Key.

2.  **Node Configuration**:
    *   **Model**: Defaults to `claude-3-5-sonnet-20241022`.
    *   **Prompt**: A simple "Hello" message is configured.

## Expected Result

*   The node outputs a text response from Claude (e.g., "Anthropic Connection Successful").
