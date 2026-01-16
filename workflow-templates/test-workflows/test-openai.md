# Test: OpenAI Connection

This workflow verifies your connection to OpenAI's API (GPT-4/3.5).

## Prerequisites

1.  **OpenAI Account**: You need an active account at platform.openai.com.
2.  **API Key**: Generate a key at https://platform.openai.com/api-keys.
3.  **Credits**: Ensure you have billing set up and available credits/budget.

## Setup Instructions

1.  **Credentials**:
    *   Create an **OpenAI** credential in n8n.
    *   Paste your API Key.

2.  **Node Configuration**:
    *   **Model**: Defaults to `gpt-4o`. Change to `gpt-3.5-turbo` if needed.
    *   **Prompt**: A simple "Hello" message is configured.

## Expected Result

*   The node outputs a text response from the AI (e.g., "OpenAI Connection Successful").
