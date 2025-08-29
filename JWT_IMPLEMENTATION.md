# JWT Authentication Implementation

This document describes the JWT (JSON Web Token) authentication implementation that has been added to the application.

## Overview

The application now uses JWT tokens for stateless authentication, providing secure session management without server-side session storage.

## Features Implemented

### 1. JWT Utilities (`src/lib/jwt.ts`)

- **`generateAccessToken(user)`**: Generates short-lived access tokens (7 days default)
- **`generateRefreshToken(user)`**: Generates long-lived refresh tokens (30 days default)
- **`generateTokenPair(user)`**: Generates both access and refresh tokens
- **`verifyToken(token)`**: Verifies and decodes JWT tokens
- **`extractTokenFromHeader(authHeader)`**: Extracts token from Authorization header
- **`refreshAccessToken(refreshToken, user)`**: Refreshes access token using refresh token

### 2. Authentication Middleware (`src/lib/auth-middleware.ts`)

- **`authenticateToken(request)`**: Middleware to authenticate JWT tokens
- **`requireAdmin(request)`**: Middleware to check admin privileges
- **`requireAuth(request)`**: Middleware to check authentication
- **`getUserFromRequest(request)`**: Get full user data from request
- **`createAuthResponse()`**: Helper for creating authentication responses

### 3. Updated API Endpoints

- **Login API** (`/api/auth/login`): Returns JWT tokens on successful login
- **Register API** (`/api/auth/register`): Returns JWT tokens on successful registration
- **Refresh API** (`/api/auth/refresh`): Refreshes access tokens
- **Logout API** (`/api/auth/logout`): Handles logout (client-side token removal)
- **User Profile API** (`/api/auth/me`): Protected endpoint to get user profile

### 4. Updated Components

- **AuthContext**: Now handles JWT tokens with automatic refresh
- **LoginModal**: Updated to handle JWT token responses
- **RegisterModal**: Updated to handle JWT token responses
- **Hero**: Updated to pass tokens to AuthContext
- **ProtectedRoute**: New component for protecting routes
- **API Client**: New utility for making authenticated requests

## Security Features

### Token Structure

- **Access Token**: Short-lived (7 days), used for API requests
- **Refresh Token**: Long-lived (30 days), used to refresh access tokens
- **JWT Secret**: Configurable secret key for signing tokens
- **Token Validation**: Includes issuer and audience validation

### Security Measures

1. **Token Expiration**: Automatic token expiration
2. **Token Refresh**: Seamless token refresh without user intervention
3. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
4. **Authorization Headers**: Bearer token authentication
5. **Token Verification**: Server-side token verification for all protected routes

## Configuration

### Environment Variables

Add these to your `.env.local` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### JWT Secret

**IMPORTANT**: Change the JWT secret in production! Use a strong, random secret key.

## Usage Examples

### Making Authenticated API Requests

```typescript
import { useApiClient } from "@/lib/api-client";

function MyComponent() {
  const apiClient = useApiClient();

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get("/api/auth/me");
      const userData = await response.json();
      console.log(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return <button onClick={fetchUserData}>Get User Data</button>;
}
```

### Protecting Routes

```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Admin only content</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Context

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.nama}!</h1>
      {isAdmin && <div>Admin features</div>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Request/Response Examples

#### Login Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "nama": "John Doe",
    "email": "user@example.com",
    "status": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token Request

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Token Lifecycle

1. **Login/Register**: User receives access and refresh tokens
2. **API Requests**: Access token sent in Authorization header
3. **Token Expiry**: Access token expires after configured time
4. **Auto Refresh**: Client automatically refreshes access token using refresh token
5. **Logout**: Tokens removed from client storage

## Security Considerations

### Production Recommendations

1. **JWT Secret**: Use a strong, random secret key
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Consider using httpOnly cookies instead of localStorage
4. **Token Blacklist**: Implement token blacklist for immediate logout
5. **Rate Limiting**: Implement rate limiting on authentication endpoints
6. **CORS**: Configure CORS properly for your domain

### Token Security

- Tokens are signed with HMAC SHA256
- Include issuer and audience validation
- Automatic expiration handling
- Secure token refresh mechanism

## Error Handling

The implementation includes comprehensive error handling:

- **Token Expired**: Automatic refresh attempt
- **Invalid Token**: User logged out and redirected
- **Network Errors**: Graceful error handling
- **Refresh Failed**: User logged out and redirected to login

## Testing

The JWT implementation has been tested for:

- Token generation and verification
- Token refresh functionality
- Authentication middleware
- Protected route access
- Error handling scenarios

## Migration from Previous Authentication

The JWT implementation is backward compatible with the existing password hashing system. Users can continue using their existing passwords, and the system will automatically generate JWT tokens upon login.

## Future Enhancements

- Implement token blacklist for immediate logout
- Add two-factor authentication support
- Implement role-based access control (RBAC)
- Add session management dashboard
- Implement device-specific tokens
- Add token analytics and monitoring
