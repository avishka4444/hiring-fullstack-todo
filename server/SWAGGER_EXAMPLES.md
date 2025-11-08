# Swagger API Test Examples

This document provides example requests for testing all TODO endpoints in Swagger.

## Base URL
```
http://localhost:3000/api/todos
```

---

## 1. Create a TODO Item
**POST** `/api/todos`

### Request Body Example 1: With description
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API including endpoints, authentication, and examples"
}
```

### Request Body Example 2: Without description (optional)
```json
{
  "title": "Review code changes"
}
```

### Request Body Example 3: Short title
```json
{
  "title": "Fix bug",
  "description": "Fix the authentication issue in login endpoint"
}
```

### Expected Response (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API including endpoints, authentication, and examples",
  "done": false,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T10:00:00.000Z"
}
```

---

## 2. Get All TODO Items (Paginated)
**GET** `/api/todos`

### Query Parameters Example 1: Paginated (default)
```
?page=1&pageSize=10
```

### Query Parameters Example 2: Get all items
```
?all=true
```

### Query Parameters Example 3: Second page with custom size
```
?page=2&pageSize=25
```

### Expected Response (200 OK)
```json
{
  "count": 50,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "done": false,
      "createdAt": "2025-11-08T10:00:00.000Z",
      "updatedAt": "2025-11-08T10:00:00.000Z"
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "title": "Review code changes",
      "description": null,
      "done": true,
      "createdAt": "2025-11-08T09:00:00.000Z",
      "updatedAt": "2025-11-08T11:00:00.000Z"
    }
  ]
}
```

---

## 3. Get a TODO Item by ID
**GET** `/api/todos/:id`

### Example Request
```
GET /api/todos/123e4567-e89b-12d3-a456-426614174000
```

### Expected Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "done": false,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T10:00:00.000Z"
}
```

### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Todo with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

---

## 4. Update a TODO Item (Title/Description)
**PUT** `/api/todos/:id`

### Request Body Example 1: Update title and description
```json
{
  "title": "Updated project documentation",
  "description": "Updated comprehensive documentation for the API"
}
```

### Request Body Example 2: Update only title
```json
{
  "title": "New title for the task"
}
```

### Request Body Example 3: Update only description
```json
{
  "description": "Updated description only"
}
```

### Request Body Example 4: Update all fields including done status
```json
{
  "title": "Completed task",
  "description": "This task is now done",
  "done": true
}
```

### Example Request
```
PUT /api/todos/123e4567-e89b-12d3-a456-426614174000
```

### Expected Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated project documentation",
  "description": "Updated comprehensive documentation for the API",
  "done": true,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T11:30:00.000Z"
}
```

---

## 5. Toggle TODO Item Done Status
**PATCH** `/api/todos/:id/done`

### Example Request
```
PATCH /api/todos/123e4567-e89b-12d3-a456-426614174000/done
```

**Note:** No request body required. This endpoint toggles the `done` status (false → true, or true → false).

### Expected Response (200 OK) - When toggling from false to true
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "done": true,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T11:35:00.000Z"
}
```

### Expected Response (200 OK) - When toggling from true to false
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "done": false,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T11:40:00.000Z"
}
```

---

## 6. Delete a TODO Item
**DELETE** `/api/todos/:id`

### Example Request
```
DELETE /api/todos/123e4567-e89b-12d3-a456-426614174000
```

### Expected Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "done": false,
  "createdAt": "2025-11-08T10:00:00.000Z",
  "updatedAt": "2025-11-08T10:00:00.000Z"
}
```

### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Todo with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

---

## Complete Test Flow Example

### Step 1: Create a TODO
```bash
POST /api/todos
{
  "title": "Test TODO",
  "description": "This is a test TODO item"
}
```
**Save the `id` from the response**

### Step 2: Get the TODO by ID
```bash
GET /api/todos/{id_from_step_1}
```

### Step 3: Update the TODO
```bash
PUT /api/todos/{id_from_step_1}
{
  "title": "Updated Test TODO",
  "description": "This is an updated test TODO item"
}
```

### Step 4: Toggle the done status
```bash
PATCH /api/todos/{id_from_step_1}/done
```

### Step 5: Get all TODOs to verify
```bash
GET /api/todos?page=1&pageSize=10
```

### Step 6: Delete the TODO
```bash
DELETE /api/todos/{id_from_step_1}
```

### Step 7: Verify deletion (should return 404)
```bash
GET /api/todos/{id_from_step_1}
```

---

## Validation Error Examples

### Example 1: Title too long (max 255 characters)
```json
{
  "title": "This is a very long title that exceeds the maximum allowed length of 255 characters and should trigger a validation error when submitted to the API endpoint for creating or updating TODO items. The validation should reject this request and return an appropriate error message indicating that the title field exceeds the maximum length requirement."
}
```
**Expected Response (400 Bad Request)**
```json
{
  "statusCode": 400,
  "message": ["title must be shorter than or equal to 255 characters"],
  "error": "Bad Request"
}
```

### Example 2: Missing required title
```json
{
  "description": "This should fail because title is required"
}
```
**Expected Response (400 Bad Request)**
```json
{
  "statusCode": 400,
  "message": ["title should not be empty", "title must be a string"],
  "error": "Bad Request"
}
```

### Example 3: Description too long (max 1000 characters)
```json
{
  "title": "Valid title",
  "description": "This is a very long description that exceeds 1000 characters..." // (1000+ chars)
}
```

---

## Tips for Testing in Swagger

1. **Start with creating a TODO** - Use the POST endpoint to create a few test items
2. **Use the returned IDs** - Copy the `id` from create/update responses to test GET, PUT, PATCH, and DELETE
3. **Test pagination** - Create multiple TODOs and test different page sizes
4. **Test validation** - Try submitting invalid data to see error responses
5. **Test toggle** - Create a TODO, toggle it multiple times to see the status change
6. **Test error cases** - Try accessing non-existent IDs to see 404 responses

