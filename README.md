# Event Manager API
```bash
 cd permah_react
 npm install
 npm run dev or npm run
```
## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "User Name"
    },
    "token": "jwt_token_here"
}

Note: A secure HTTP-only cookie (BEARER) will also be set containing the JWT token
```
#### Update Profile
```
http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json
{
"name": "Updated Name", // Optional
"email": "new@example.com", // Optional
"current_password": "old_password", // Required only when changing password
"new_password": "new_password" // Required only when changing password
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

#### Edit Profile
```http
PUT /api/auth/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
{
"name": "Updated Name", // Optional
"email": "new@example.com", // Optional
"current_password": "old123", // Required only when changing password
"new_password": "new123" // Required only when changing password
}
```

### Event Endpoints

All event endpoints require JWT authentication header:
```http
Authorization: Bearer <your_jwt_token>
```

#### List Events
```http
GET /api/events
```

#### Get Single Event
```http
GET /api/events/{id}
```

#### Create Event
```http
POST /api/events
Content-Type: application/json

{
    "title": "New Event",
    "description": "Event description",
    "date": "2024-12-31T00:00:00Z",
    "location": "Event Location",
    "available_places": 100,
    "price": 0,
    "image_url": "https://example.com/image.jpg"
}
```

#### Update Event
```http
PUT /api/events/{id}
Content-Type: application/json

{
    "title": "Updated Title",
    "description": "Updated description"
}
```

#### Delete Event
```http
DELETE /api/events/{id}
```

#### Join Event
```http
POST /api/events/{id}/join
```

#### Leave Event
```http
DELETE /api/events/{id}/leave
```
## Error Handling

The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Contributing

1. Create a new branch for your feature
2. Write tests for new functionality
3. Run the test suite
4. Submit a pull request

## License

MIT License
