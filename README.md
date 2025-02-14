# Permah - Event Management Platform

A modern event management platform built with React TypeScript frontend and Symfony backend. Supporting multiple languages (English, French, and Malagasy), this application helps you create, manage, and participate in events easily.

## 🌟 Features

- 🌍 Multilingual support (English, French, Malagasy)
- 📱 Responsive design
- 🔐 User authentication and authorization
- 📅 Event creation and management
- 👥 Event participation
- 🎨 Modern UI with Material-UI
- 🚀 Fast development with Vite
- 🐳 Docker support for both development and production

## 🚀 Quick Start

### Backend link
```bash
https://github.com/manasseh-randriamitsiry/event_symfony
```

### Prerequisites

- Node.js >= 18
- PHP >= 8.1
- Composer
- Docker (optional)
- Symfony CLI (optional)

### Using Docker (Recommended)

1. Pull the Docker image:
```bash
docker pull manassehrandriamitsiry/permah:latest
```

2. Run the container:
```bash
docker run -d -p 8080:80 manassehrandriamitsiry/permah:latest
```

3. Access the application at `http://localhost:8080`

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd permah_react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the development server at `http://localhost:5173`

## 🐳 Docker Development Setup

The project includes a Docker Compose configuration for development with hot-reload support:

1. Start all services:
```bash
docker compose up -d
```

2. Access the environments:
- Development: `http://localhost:8000`
- Production: `http://localhost:8000/prod`

### Docker Compose Services

- `dev`: Development server with hot-reload
- `prod`: Production build
- `proxy`: Nginx reverse proxy for routing

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
permah_react/
├── src/
│   ├── components/     # React components
│   ├── locales/       # Translation files
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── styles/        # Global styles
├── public/            # Static assets
├── docker/            # Docker configuration
└── nginx/            # Nginx configuration
```

## 🌍 Internationalization

The application supports three languages:
- English (en)
- French (fr)
- Malagasy (mg)

Translation files are located in `src/locales/`.

## 📚 API Documentation

The API is built with Symfony 6+ and follows REST conventions.

### Base URL
```
http://localhost:8000/api
```

### Authentication

Authentication is handled via JWT tokens. After login, the token should be included in all subsequent requests in the Authorization header.

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "user@example.com",  # Symfony security expects 'username'
    "password": "password123"
}

Response:
{
    "token": "eyJ0eXAiOiJKV1QiLC...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "roles": ["ROLE_USER"],
        "name": "User Name"
    }
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

Response:
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "roles": ["ROLE_USER"],
        "name": "John Doe"
    }
}
```

#### Update Profile
```http
PUT /api/users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Updated Name",
    "email": "new@example.com",
    "currentPassword": "old_password",  # Required for password change
    "newPassword": "new_password"      # Optional
}

Response:
{
    "message": "Profile updated successfully",
    "user": {
        "id": 1,
        "email": "new@example.com",
        "roles": ["ROLE_USER"],
        "name": "Updated Name"
    }
}
```

### Event Endpoints

All event endpoints require authentication:
```http
Authorization: Bearer <token>
```

#### List Events
```http
GET /api/events

Query Parameters:
- page (int, default: 1)
- limit (int, default: 10)
- sort (string, e.g., "startDate:desc")
- search (string)

Response:
{
    "items": [
        {
            "id": 1,
            "title": "Event Title",
            "description": "Event description",
            "startDate": "2024-12-31T18:00:00+00:00",
            "endDate": "2024-12-31T22:00:00+00:00",
            "location": "Event Location",
            "availablePlaces": 100,
            "price": 0,
            "imageUrl": "https://example.com/image.jpg",
            "creator": {
                "id": 1,
                "name": "Creator Name"
            },
            "createdAt": "2024-02-13T00:00:00+00:00",
            "updatedAt": "2024-02-13T00:00:00+00:00"
        }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
}
```

#### Get Single Event
```http
GET /api/events/{id}

Response:
{
    "id": 1,
    "title": "Event Title",
    "description": "Event description",
    "startDate": "2024-12-31T18:00:00+00:00",
    "endDate": "2024-12-31T22:00:00+00:00",
    "location": "Event Location",
    "availablePlaces": 100,
    "price": 0,
    "imageUrl": "https://example.com/image.jpg",
    "creator": {
        "id": 1,
        "name": "Creator Name"
    },
    "participants": [
        {
            "id": 2,
            "name": "Participant Name"
        }
    ],
    "createdAt": "2024-02-13T00:00:00+00:00",
    "updatedAt": "2024-02-13T00:00:00+00:00"
}
```

#### Create Event
```http
POST /api/events
Content-Type: application/json

{
    "title": "New Event",
    "description": "Event description",
    "startDate": "2024-12-31T18:00:00+00:00",
    "endDate": "2024-12-31T22:00:00+00:00",
    "location": "Event Location",
    "availablePlaces": 100,
    "price": 0,
    "imageUrl": "https://example.com/image.jpg"
}

Response:
{
    "message": "Event created successfully",
    "event": {
        "id": 1,
        ...
    }
}
```

#### Update Event
```http
PUT /api/events/{id}
Content-Type: application/json

{
    "title": "Updated Title",
    "description": "Updated description",
    "startDate": "2024-12-31T18:00:00+00:00",
    "endDate": "2024-12-31T22:00:00+00:00",
    "location": "New Location",
    "availablePlaces": 150,
    "price": 25.99,
    "imageUrl": "https://..."
}

Response:
{
    "message": "Event updated successfully",
    "event": {
        "id": 1,
        ...
    }
}
```

#### Delete Event
```http
DELETE /api/events/{id}

Response:
{
    "message": "Event deleted successfully"
}
```

#### Join Event
```http
POST /api/events/{id}/join

Response:
{
    "message": "Successfully joined the event"
}
```

#### Leave Event
```http
DELETE /api/events/{id}/leave

Response:
{
    "message": "Successfully left the event"
}
```

### Error Responses

The API uses standard HTTP status codes and returns error messages in a consistent format:

```json
{
    "status": 400,
    "message": "Validation failed",
    "errors": {
        "title": ["This value should not be blank."],
        "startDate": ["This value should be a valid datetime."]
    }
}
```

Common status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- React Team
- Vite
- Material-UI
- i18next
- All contributors

## 📞 Contact

- GitHub: [@manassehrandriamitsiry](https://github.com/manassehrandriamitsiry)
