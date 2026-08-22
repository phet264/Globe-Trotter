# GlobeTrotter Backend API

## API Response Contract

All backend APIs return a standardized JSON structure.

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "requestId": "request-id"
  }
}
```

---

## Endpoints

### Health Check
Check the health status of the application and its dependencies (e.g., database).

- **Endpoint**: `/api/health`
- **Method**: `GET`
- **Purpose**: Verifies that the backend is running and attempts a lightweight connection to the database.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "globetrotter-backend",
    "timestamp": "2026-08-22T10:32:00.000Z",
    "database": "connected",
    "requestId": "a0f2b6e1-92f5-4d0f-8c3b-240a5b28d6c7"
  }
}
```
*Note: `database` can be `connected`, `unavailable`, or `unknown`.*
