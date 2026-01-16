# Test: WhatsApp (via Periskope)

This workflow tests the connection to WhatsApp using the Periskope API integration. It uses an HTTP Request node to send messages rather than the direct Meta Business API.

## Prerequisites

1.  **Periskope Account**: You need an active Periskope account.
2.  **API Key**: A Periskope API key/token.

## Setup Instructions

### 1. Credentials
The workflow uses **Header Auth** (`httpHeaderAuth`) for authentication.
*   **Header Name**: `Authorization` (or as required by Periskope, typically `Bearer <token>` or `x-api-key`)
*   **Value**: Your Periskope API Key

### 2. Node Configuration
The workflow uses a standard **HTTP Request** node configured as follows:
*   **Method**: `POST`
*   **URL**: `https://api.periskope.app/v1/message/send`
*   **Headers**:
    *   `x-phone`: The sender phone number (e.g., `60127088789`)
*   **Body (JSON)**:
    ```json
    {
      "chat_id": "60127088789@c.us",
      "message": "Testing from n8n"
    }
    ```

### 3. Usage
*   Update the `chat_id` in the JSON Body to the recipient's phone number followed by `@c.us`.
*   Update the `x-phone` header if sending from a different connected number.

## Expected Result

*   The recipient receives the message "Testing from n8n".
*   n8n output shows the success response from the Periskope API.
