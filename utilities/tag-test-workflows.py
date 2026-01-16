import requests
import json

API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGE2NjM4NC01YTc4LTRiY2YtYTFkOS05NzRmMDU5YjdhYWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY4NTI3OTA4fQ.ZfDHvAG6hcjZqDxr4yXCIqZRGDinpnUowSkf32N6KZc"
BASE_URL = "http://localhost:5678/api/v1"
HEADERS = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

def get_all_workflows():
    response = requests.get(f"{BASE_URL}/workflows", headers=HEADERS)
    response.raise_for_status()
    return response.json().get("data", [])

def get_all_tags():
    response = requests.get(f"{BASE_URL}/tags", headers=HEADERS)
    response.raise_for_status()
    # The API documentation for tags usually returns a list or a wrapper. 
    # Usually it's valid to check if it's a list or dict.
    data = response.json()
    if isinstance(data, list):
        return data
    return data.get("data", [])

def create_tag(name):
    response = requests.post(f"{BASE_URL}/tags", headers=HEADERS, json={"name": name})
    response.raise_for_status()
    return response.json()

def update_workflow_tags(workflow_id, tag_ids):
    # It seems we must use the specific endpoint /workflows/:id/tags
    # Payload is typically specific. Based on n8n patterns, it's often a list of objects or IDs.
    
    # First, let's get current tags to append to them (we don't want to overwrite existing tags unless desired)
    # The requirement is "give a 'Test' tag", enabling filter. So we append.
    wf_resp = requests.get(f"{BASE_URL}/workflows/{workflow_id}", headers=HEADERS)
    wf_resp.raise_for_status()
    workflow = wf_resp.json()
    
    current_tags = workflow.get("tags", [])
    current_tag_ids = [t["id"] for t in current_tags if isinstance(t, dict) and "id" in t]
    
    new_tag_ids = list(set(current_tag_ids + tag_ids))
    
    # Try payload as list of objects with ID
    # Endpoint: /workflows/{id}/tags (Not standard in official docs usually? Official is usually PATCH/PUT workflow)
    # BUT if PUT workflow failed with tags read-only, we try this.
    # Alternatively, use PATCH /workflows/{id} if supported? requests.patch ?
    # Let's try the specialized endpoint first.
    
    payload = [{"id": tid} for tid in new_tag_ids]
    
    # Note: If /workflows/{id}/tags doesn't exist, this will 404.
    # If 404, we might retry with standard PUT but different body (maybe keys are strictly checked).
    # But let's assume the search result is correct about the endpoint.
    
    url = f"{BASE_URL}/workflows/{workflow_id}/tags"
    # Actually, verify if we should put just IDs or objects.
    # If the endpoint expects names, we'd send strings.
    # Let's go with objects first.
    
    # Note: Some versions might use PATCH /workflows/{id} { tags: [...] }
    # Let's try to just run this update. If it 404s, we will see.
    
    response = requests.put(url, headers=HEADERS, json=payload)
    
    if response.status_code == 404:
        print(f"Endpoint {url} not found. Trying POST /workflows/{workflow_id}/tags or similar?")
        # Fallback: maybe it's just that I need to use correct property in PUT /workflows/{id}?
        # But 'tags is read-only' is strong hint.
    elif response.status_code != 200:
        print(f"Failed to update workflow {workflow_id}: {response.text}")
    else:
        print(f"Updated workflow {workflow_id} tags to {new_tag_ids}")

def main():
    print("Fetching workflows...")
    workflows = get_all_workflows()
    
    test_keywords = ["test", "Test", "TEST"]
    workflows_to_tag = []
    
    for wf in workflows:
        name = wf.get("name", "")
        # Check if 'test' is in the name (case insensitive)
        if "test" in name.lower():
            workflows_to_tag.append(wf)
            print(f"Found match: {name} ({wf['id']})")
            
    if not workflows_to_tag:
        print("No workflows found with keyword 'Test'.")
        return

    print("Fetching tags...")
    tags = get_all_tags()
    test_tag = next((t for t in tags if t["name"] == "Test"), None)
    
    if not test_tag:
        print("Tag 'Test' not found. Creating it...")
        test_tag = create_tag("Test")
        # Handle case where return might be wrapped
        if "data" in test_tag: 
             test_tag = test_tag["data"]
         # Or it might return the object directly
        print(f"Created tag 'Test' with ID: {test_tag['id']}")
    else:
        print(f"Found existing tag 'Test' with ID: {test_tag['id']}")
        
    test_tag_id = test_tag["id"]
    
    print(f"Applying tag to {len(workflows_to_tag)} workflows...")
    for wf in workflows_to_tag:
        update_workflow_tags(wf["id"], [test_tag_id])

if __name__ == "__main__":
    main()
