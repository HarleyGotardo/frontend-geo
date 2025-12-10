# Laravel Backend API Documentation

## Overview

This Laravel API provides authentication and IP geolocation functionality for the technical assessment challenge.

**Base URL**: `http://localhost:8000`
**Authentication**: Bearer Tokens (Laravel Sanctum)

---

## Authentication

All endpoints except `/api/login` require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Endpoints

### 🔐 Authentication

#### POST /api/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "admin@jlabs.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Jlabs Candidate",
    "email": "admin@jlabs.com",
    "created_at": "2025-12-10T06:23:54.000000Z",
    "updated_at": "2025-12-10T06:23:54.000000Z"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### POST /api/logout
Logout user and invalidate current token.

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET /api/user
Get current authenticated user information.

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response (200):**
```json
{
  "id": 1,
  "name": "Jlabs Candidate",
  "email": "admin@jlabs.com",
  "created_at": "2025-12-10T06:23:54.000000Z",
  "updated_at": "2025-12-10T06:23:54.000000Z"
}
```

---

### 🌍 Geolocation

#### GET /api/geo
Get IP geolocation information from ipinfo.io.

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Parameters (Optional):**
- `ip` (string): Specific IP address to lookup

**Without IP (returns current user's location):**
```
GET /api/geo
```

**With specific IP:**
```
GET /api/geo?ip=8.8.8.8
```

**Response (200):**
```json
{
  "ip": "8.8.8.8",
  "city": "Mountain View",
  "region": "California",
  "country": "US",
  "loc": "37.4056,-122.0775",
  "org": "AS15169 Google LLC",
  "postal": "94043",
  "timezone": "America/Los_Angeles",
  "readme": "https://ipinfo.io/missingauth"
}
```

**Error (422) - Invalid IP format:**
```json
{
  "message": "Invalid IP address format",
  "errors": {
    "ip": ["The ip field must be a valid IP address."]
  }
}
```

**Error (500) - External API failure:**
```json
{
  "message": "External API error",
  "error": "Connection timeout"
}
```

**Note:** When searching with a specific IP, the search is automatically saved to the user's history.

---

### 📝 Search History

#### GET /api/history
Get user's search history (chronological, newest first).

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Response (200):**
```json
[
  {
    "id": 3,
    "user_id": 1,
    "search_term": "8.8.8.8",
    "geo_data": {
      "ip": "8.8.8.8",
      "city": "Mountain View",
      "region": "California",
      "country": "US",
      "loc": "37.4056,-122.0775",
      "org": "AS15169 Google LLC",
      "postal": "94043",
      "timezone": "America/Los_Angeles"
    },
    "created_at": "2025-12-10T07:15:23.000000Z",
    "updated_at": "2025-12-10T07:15:23.000000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "search_term": "1.1.1.1",
    "geo_data": {
      "ip": "1.1.1.1",
      "city": "San Francisco",
      "region": "California",
      "country": "US",
      "loc": "37.7621,-122.4393",
      "org": "AS13335 Cloudflare, Inc.",
      "postal": "94107",
      "timezone": "America/Los_Angeles"
    },
    "created_at": "2025-12-10T07:10:15.000000Z",
    "updated_at": "2025-12-10T07:10:15.000000Z"
  }
]
```

---

#### POST /api/history/delete
Delete multiple search history entries.

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "ids": [2, 3]
}
```

**Response (200):**
```json
{
  "message": "Deleted successfully"
}
```

**Error (422) - Invalid IDs:**
```json
{
  "message": "The ids field is required.",
  "errors": {
    "ids": ["The ids field is required."]
  }
}
```

---

## Test Credentials

For testing purposes, use these credentials:

- **Email**: `admin@jlabs.com`
- **Password**: `password123`

---

## Usage Examples

### Login and Get Token
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@jlabs.com", "password": "password123"}'
```

### Get Current IP Geolocation
```bash
curl -X GET http://localhost:8000/api/geo \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Specific IP Geolocation
```bash
curl -X GET "http://localhost:8000/api/geo?ip=8.8.8.8" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Search History
```bash
curl -X GET http://localhost:8000/api/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete History Entries
```bash
curl -X POST http://localhost:8000/api/history/delete \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"ids": [2, 3]}'
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `401` - Unauthorized (invalid/missing token)
- `422` - Validation Error (invalid input)
- `500` - Server Error (external API failures)

Error responses follow this format:
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Specific error message"]
  }
}
```

---

## Notes

- CORS is configured for frontend integration
- All tokens expire when user logs out
- IP geolocation searches are automatically saved to history
- External API calls include 10-second timeout
- Users can only delete their own search history entries
