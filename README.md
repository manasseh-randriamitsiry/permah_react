# Permah - Event Management Platform

A modern event management platform built with React, TypeScript, and Docker. Supporting multiple languages (English, French, and Malagasy), this application helps you create, manage, and participate in events easily.

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

## 🔒 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
}
```

See API documentation section for more endpoints.

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `NODE_ENV` - Environment (development/production)

## 📚 API Documentation

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
    "startDate": "2024-12-31T18:00:00Z",
    "endDate": "2024-12-31T22:00:00Z",
    "location": "Event Location",
    "available_places": 100,
    "price": 0,
    "image_url": "https://example.com/image.jpg"

}
```

#### Update Event
```http
UT /api/events/{id}
Content-Type: application/json
{
     "title": "Updated Title", // Optional
    "description": "Updated desc", // Optional
    "startDate": "2024-12-31T18:00:00Z", // Optional
    "endDate": "2024-12-31T22:00:00Z", // Optional
    "location": "New Location", // Optional
    "available_places": 150, // Optional
    "price": 25.99, // Optional
    "image_url": "https://..." // Optional
}
```
Response (200 OK): Updated event object
```http
"message": "Event updated successfully",
"event": {
    "id": "number",
    "title": "Updated Title",
    "description": "Updated desc",
    "startDate": "2024-12-31T18:00:00Z",
    "endDate": "2024-12-31T22:00:00Z",
    "location": "New Location",
    "available_places": 150,
    "price": 25.99,
    "image_url": "https://...",
    "creator": {
    "id": 1,
    "name": "Creator Name"
    },
    "created_at": "2024-02-13T00:00:00Z",
    "updated_at": "2024-02-13T00:00:00Z"
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
