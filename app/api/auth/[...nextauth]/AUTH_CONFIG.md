# NextAuth Configuration Documentation

## Overview

This document explains the authentication configuration for Dr. Reach using NextAuth.js with Google OAuth provider.

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Provider Configuration](#provider-configuration)
3. [Custom Pages](#custom-pages)
4. [Callbacks](#callbacks)
5. [Session Configuration](#session-configuration)

## Type Definitions

### ExtendedSessionUser Interface

```typescript
interface ExtendedSessionUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: EUserRole;
  isVerified?: boolean;
  providerRole?: string;
  address?: any[];
  profileImage?: string;
  authProvider?: "google";
}
```

This interface extends the default session user with additional properties needed for Dr. Reach.

### ExtendedUser Interface

```typescript
interface ExtendedUser extends User {
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: EUserRole;
  isVerified?: boolean;
  providerType?: string;
  address?: any[];
  profileImage?: string;
  authProvider?: "google";
}
```

Extends the NextAuth User type with custom properties.

## Provider Configuration

### Google OAuth Provider

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
  profile(profile) {
    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      image: profile.picture,
      role: EUserRole.PATIENT,
      isVerified: true,
      phone: "",
      authProvider: "google"
    };
  },
})
```

### Configuration Details

- **Required Environment Variables**:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `SERVER_URL`

- **Authorization Parameters**:
  - `prompt: "consent"` - Forces consent screen display
  - `access_type: "offline"` - Enables refresh token
  - `response_type: "code"` - Authorization code flow

## Custom Pages

```typescript
pages: {
  signIn: "/auth/login",
  error: "/auth/error",
  newUser: "/auth/complete-profile",
}
```

- **signIn**: Custom login page route
- **error**: Custom error page route
- **newUser**: Profile completion page for new users

## Callbacks

### JWT Callback

```typescript
async jwt({ token, user, account }) {
  if (user) {
    // Maps user data to token
    // Performs signup API call
    // Handles errors
  }
  return token;
}
```

- Extends JWT token with user information
- Performs user signup via API
- Handles authentication errors

### Session Callback

```typescript
async session({ session, token }) {
  if (session.user) {
    // Maps token data to session user
  }
  return session;
}
```

- Maps JWT token data to session user
- Ensures type safety with ExtendedSessionUser

## Session Configuration

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

- Uses JWT strategy for session management
- Session expires after 30 days

## Security Considerations

1. Environment variables must be properly set
2. API endpoints must be secured
3. Error handling implemented for authentication failures
4. Token expiration handled appropriately
5. User data validated during signup

## API Integration

The configuration includes integration with backend API:

```typescript
await fetch(`${process.env.SERVER_URL}/user/signup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: extendedUser.email,
    firstName: extendedUser.firstName,
    lastName: extendedUser.lastName,
    image: extendedUser.image,
  }),
});
```

## Usage Example

```typescript
// In your component/page
import { signIn, signOut, useSession } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  
  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>
  }
  return <button onClick={() => signIn('google')}>Sign in</button>
}
```

## Error Handling

- Validates required environment variables
- Handles Google authentication failures
- Logs authentication errors
- Provides user-friendly error messages

## Type Safety

The configuration ensures type safety through:

- Custom interfaces for extended user data
- Type assertions in callbacks
- Proper type checking for token and session data
