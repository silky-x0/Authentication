# What the Heck is OAuth? - Complete Reference Guide

## Table of Contents
1. [Introduction](#introduction)
2. [What Is OAuth?](#what-is-oauth)
3. [Why OAuth?](#why-oauth)
4. [OAuth Central Components](#oauth-central-components)
5. [OAuth Flows](#oauth-flows)
6. [Security and Enterprise](#security-and-enterprise)
7. [OAuth vs Authentication](#oauth-vs-authentication)
8. [OpenID Connect](#openid-connect-oidc)
9. [Summary](#summary)

## Introduction

OAuth is often misunderstood. Some think it's a login flow (like Google Login), others see it as just a "security thing." This guide clarifies what OAuth actually is, how it works, and where it benefits applications.

## What Is OAuth?

OAuth is NOT an API or service - it's an **open standard for authorization** that anyone can implement.

**Key Points:**
- OAuth provides "secure delegated access" for client applications
- Works over HTTPS
- Uses access tokens instead of credentials
- Two versions exist: OAuth 1.0a and OAuth 2.0 (completely different, no backward compatibility)
- **OAuth 2.0** is the widely used version today

## Why OAuth?

### The Problem: Direct Authentication Pattern
Before OAuth, applications used HTTP Basic Authentication:
- Users entered username/password directly into third-party forms
- Apps logged in as the user to access their data (Gmail, etc.)
- Known as the "password anti-pattern"

### The Evolution

```mermaid
graph TD
    A[HTTP Basic Auth] --> B[Federated Identity/SAML 2.0]
    B --> C[OAuth 2.0]
    
    A1[Username/Password directly to app] --> B1[Identity Provider generates signed token]
    B1 --> C1[Delegated authorization with scopes]
```

**SAML 2.0 Limitations:**
- Released in 2005, designed for web browsers
- Limited device profile support
- Not suitable for modern SPAs, mobile apps, APIs, IoT devices

### The Delegated Authorization Problem
**Core Question:** "How can I allow an app to access my data without giving it my password?"

OAuth solves this by:
- Decoupling authentication from authorization
- Supporting multiple device capabilities
- Enabling limited access through scopes

**Hotel Key Card Analogy:**
- Hotel key card = OAuth token
- Front desk authentication = OAuth authorization process  
- Room access = API resource access
- Limited permissions = Scopes

## OAuth Central Components

### 1. OAuth Scopes
**What they are:**
- Bundles of permissions requested by the client
- Visible on authorization screens
- Decouple authorization policy from enforcement

**Characteristics:**
- Defined by application developers
- Listed in API documentation
- Require user consent ("trusting on first use")
- Can be time-sensitive
- Enable per-application permissions

### 2. OAuth Actors

```mermaid
graph LR
    A[Resource Owner] --> B[Authorization Server]
    C[Client] --> B
    B --> D[Resource Server]
    
    A1[Owns the data] 
    C1[Application wanting access]
    B1[OAuth engine]
    D1[API with protected data]
```

**Actors Defined:**
- **Resource Owner:** Owns data in resource server (e.g., Facebook profile owner)
- **Resource Server:** API storing data the application wants to access
- **Client:** Application wanting to access data
- **Authorization Server:** Main OAuth engine

**Client Types:**
- **Confidential Clients:** Can store secrets securely (server-side apps)
- **Public Clients:** Cannot store secrets (browsers, mobile apps, IoT devices)

**Client Registration:**
- Required for OAuth ("DMV of OAuth")
- Provides client ID and logo for authorization dialogs

### 3. OAuth Tokens

#### Access Tokens
- Used by client to access Resource Server (API)
- **Short-lived** (hours/minutes, not days/months)
- Available to both public and confidential clients
- Cannot be revoked (must expire naturally)
- Optimized for internet scale

#### Refresh Tokens
- **Long-lived** (days/months/years)
- Used to obtain new access tokens
- Require confidential clients with authentication
- **Can be revoked**
- Enable key rotation

**Token Format:**
- OAuth spec doesn't define format
- Usually JSON Web Tokens (JWTs)
- JWTs are secure, trustworthy, digitally signed

### 4. Authorization Server Endpoints

```mermaid
graph TD
    A[Authorization Endpoint] --> B[User Consent]
    B --> C[Authorization Grant]
    C --> D[Token Endpoint]
    D --> E[Access & Refresh Tokens]
    
    A1[Get user authorization] --> B1[User approves/denies]
    B1 --> C1[Authorization code returned]
    C1 --> D1[Exchange code for tokens]
    D1 --> E1[Use tokens for API access]
```

**Two Main Endpoints:**
1. **Authorize Endpoint:** Gets user consent and authorization
2. **Token Endpoint:** Exchanges authorization grant for tokens

### 5. Channels

**Front Channel:**
- Goes through browser
- User redirected to authorization server
- User gives consent
- Authorization grant returned to application

**Back Channel:**
- Direct HTTP call from client to server
- Exchanges authorization grant for tokens
- More secure channel

## OAuth Flows

### 1. Authorization Code Flow (3-Legged OAuth) ⭐
**The Gold Standard**

```mermaid
sequenceDiagram
    participant RO as Resource Owner
    participant C as Client
    participant AS as Authorization Server
    participant RS as Resource Server
    
    RO->>C: 1. Initiate access request
    C->>AS: 2. Authorization request (front channel)
    AS->>RO: 3. Show consent dialog
    RO->>AS: 4. User authorizes
    AS->>C: 5. Authorization code (front channel)
    C->>AS: 6. Exchange code for tokens (back channel)
    AS->>C: 7. Access & refresh tokens
    C->>RS: 8. Access protected resource
    RS->>C: 9. Return requested data
```

**Characteristics:**
- Uses both front and back channels
- Most secure flow
- Supports refresh tokens
- Resource Owner and Client are on separate devices
- Tokens never pass through user-agent

**Example Request:**
```http
GET https://accounts.google.com/o/oauth2/auth?
    scope=gmail.insert gmail.send&
    redirect_uri=https://app.example.com/oauth2/callback&
    response_type=code&
    client_id=812741506391&
    state=af0ifjsldkj
```

**Example Response:**
```http
HTTP/1.1 302 Found
Location: https://app.example.com/oauth2/callback?
    code=MsCeLvIaQm6bTrgtp7&state=af0ifjsldkj
```

**Token Exchange Request:**
```http
POST /oauth2/v3/token HTTP/1.1
Host: www.googleapis.com
Content-Type: application/x-www-form-urlencoded

code=MsCeLvIaQm6bTrgtp7&
client_id=812741506391&
client_secret={client_secret}&
redirect_uri=https://app.example.com/oauth2/callback&
grant_type=authorization_code
```

**Token Response:**
```json
{
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA"
}
```

### 2. Implicit Flow (2-Legged OAuth)

```mermaid
sequenceDiagram
    participant RO as Resource Owner
    participant C as Client (SPA)
    participant AS as Authorization Server
    participant RS as Resource Server
    
    RO->>C: 1. Initiate access request
    C->>AS: 2. Authorization request (front channel)
    AS->>RO: 3. Show consent dialog
    RO->>AS: 4. User authorizes
    AS->>C: 5. Access token directly (front channel)
    C->>RS: 6. Access protected resource
    RS->>C: 7. Return requested data
```

**Characteristics:**
- Front channel only (all through browser)
- Optimized for browser-only public clients (SPAs)
- Access token returned directly
- Typically no refresh tokens
- Most vulnerable to security threats
- Resource Owner and Client on same device

### 3. Client Credentials Flow

```mermaid
sequenceDiagram
    participant C as Client (Server)
    participant AS as Authorization Server
    participant RS as Resource Server
    
    C->>AS: 1. Client credentials
    AS->>C: 2. Access token
    C->>RS: 3. Access protected resource
    RS->>C: 4. Return requested data
```

**Characteristics:**
- Server-to-server scenarios
- Client acts on its own behalf (not user's)
- Service account type scenario
- Back channel only
- Uses client credentials only
- Supports shared secrets or signed assertions

### 4. Resource Owner Password Flow (Legacy)

```mermaid
sequenceDiagram
    participant RO as Resource Owner
    participant C as Client
    participant AS as Authorization Server
    participant RS as Resource Server
    
    RO->>C: 1. Username & Password
    C->>AS: 2. Username, Password, Client credentials
    AS->>C: 3. Access token
    C->>RS: 4. Access protected resource
    RS->>C: 5. Return requested data
```

**Characteristics:**
- **Not recommended** (legacy)
- Similar to direct authentication
- For native username/password apps
- Typically no refresh tokens
- Resource Owner and Client on same device

### 5. Assertion Flow

**Characteristics:**
- Similar to Client Credentials Flow
- Enables federation with third parties (SAML IdP)
- Authorization Server trusts Identity Provider
- Great for SAML-invested companies
- No refresh tokens (assertions are short-lived)

### 6. Device Flow (Not in OAuth spec)

```mermaid
sequenceDiagram
    participant D as Device (TV)
    participant AS as Authorization Server
    participant U as User (Phone/Computer)
    participant RS as Resource Server
    
    D->>AS: 1. Request device code
    AS->>D: 2. Device code & user code
    D->>U: 3. Display user code & URL
    U->>AS: 4. Visit URL, enter user code
    AS->>U: 5. Show consent dialog
    U->>AS: 6. User authorizes
    D->>AS: 7. Poll for authorization
    AS->>D: 8. Access token
    D->>RS: 9. Access protected resource
```

**Characteristics:**
- For devices without web browsers (TVs, CLI clients)
- User code must be entered on separate device
- Back channel polling for authorization approval

## Security and Enterprise

### Security Considerations

**Common Vulnerabilities:**
- Large attack surface area
- Many redirects create room for errors
- Bearer tokens can be passed like session cookies

**Security Best Practices:**
- Always use CSRF token with `state` parameter
- Always whitelist redirect URIs
- Bind same client to authorization grants and token requests
- Keep client secrets secure (never in distributed apps)
- Use HTTPS for all communication

**JWT Benefits:**
- Cannot be tampered with
- Cryptographically signed
- Still copyable as strings

### Enterprise OAuth 2.0 Use Cases

**Benefits:**
- Decouples authorization policy from authentication
- Fine and coarse-grained authorization
- Replaces traditional Web Access Management (WAM)
- Restricts and revokes API permissions
- Ensures only managed/compliant devices access APIs
- Integrates with identity deprovisioning workflows
- Supports identity provider federation

## OAuth vs Authentication

### Key Misconceptions
- OAuth 2.0 is **NOT** an authentication protocol
- Not backward compatible with OAuth 1.0
- Replaces signatures with HTTPS
- Authorization framework, not a protocol
- May have interoperability issues between implementations

### Pseudo-Authentication Problem

**The Issue:**
- OAuth 2.0 says nothing about the user
- Access tokens are meant to be opaque
- Invented `/me` endpoint pattern (non-standard)
- Cannot answer: Who is the user? When did they authenticate? How did they authenticate?

**Example Pseudo-Authentication:**
```http
GET /me HTTP/1.1
Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA
Host: api.example.com
```

## OpenID Connect (OIDC)

### The Solution
OpenID Connect extends OAuth 2.0 to solve the pseudo-authentication problem by combining the best of:
- OAuth 2.0
- Facebook Connect  
- SAML 2.0

### OIDC Features

**New Components:**
- **ID Token:** Signed JWT for the client
- **UserInfo Endpoint:** Fetch user attributes
- **Standard Scopes:** `profile`, `email`, `address`, `phone`
- **Standard Claims:** Consistent identity information

**OIDC Benefits:**
- Internet scalable
- Dynamic discovery and registration
- No metadata downloading like SAML
- Built-in BYOI (Bring Your Own Identity)
- High assurance levels
- JWT tokens (smaller than SAML assertions)

### OIDC Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AS as Authorization Server (OIDC)
    participant RS as Resource Server
    
    C->>AS: 1. Authorization request (with openid scope)
    AS->>C: 2. Authorization code
    C->>AS: 3. Exchange code for tokens
    AS->>C: 4. Access token + ID token + Refresh token
    C->>AS: 5. Get user info (optional)
    AS->>C: 6. User attributes
    C->>RS: 7. Access protected resource
    RS->>C: 8. Return requested data
```

**OIDC Request Example:**
```http
GET https://accounts.google.com/o/oauth2/auth?
    scope=openid email&
    redirect_uri=https://app.example.com/oauth2/callback&
    response_type=code&
    client_id=812741506391&
    state=af0ifjsldkj
```

**OIDC Token Response:**
```json
{
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "token_type": "Bearer", 
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ..."
}
```

### JWT ID Token Structure

```mermaid
graph LR
    A[Header] --> B[Body/Claims] --> C[Signature]
    
    A1[Algorithm info] --> B1[User claims] --> C1[Digital signature]
```

**ID Token Claims Example:**
```json
{
  "iss": "https://accounts.google.com",
  "aud": "812741506391",
  "sub": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### OIDC Flow Steps
1. Discover OIDC metadata
2. Perform OAuth flow to obtain ID token and access token  
3. Get JWT signature keys and optionally register client
4. Validate JWT ID token locally (dates and signature)
5. Get additional user attributes with access token

## Flow Comparison Table

| Flow | Channels | Use Case | Tokens | Security Level |
|------|----------|----------|---------|----------------|
| Authorization Code | Front + Back | Web apps, Mobile apps | Access + Refresh | High |
| Implicit | Front only | SPAs | Access only | Medium |
| Client Credentials | Back only | Server-to-server | Access only | High |
| Resource Owner Password | Back only | Legacy apps | Access + Refresh | Low |
| Assertion | Back only | Federation | Access only | High |
| Device | Back only | TVs, CLI tools | Access + Refresh | Medium |

## Key Takeaways

### OAuth 2.0 Summary
- **Authorization framework** for delegated API access
- Clients request **scopes** that Resource Owners authorize
- **Authorization grants** exchanged for tokens
- **Multiple flows** for different scenarios
- **JWTs** enable structured tokens
- **Large security surface area** - use secure toolkits
- **Not an authentication protocol**

### When to Use What

**Use OAuth 2.0 when:**
- You need delegated authorization
- Building APIs that need controlled access
- Working with third-party integrations
- Managing permissions and scopes

**Use OpenID Connect when:**
- You need authentication AND authorization
- Building SSO solutions  
- Need user profile information
- Want standardized identity claims

### Best Practices
1. Always use Authorization Code flow when possible
2. Implement proper security measures (HTTPS, state parameter, URI validation)
3. Use short-lived access tokens
4. Implement proper token refresh logic
5. Choose OIDC for authentication scenarios
6. Use established libraries and toolkits
7. Validate all inputs and follow security guidelines

### Developer Considerations
- **Token Management:** Biggest pain point for developers
- **State Management:** Pushed to client developers
- **Refresh Logic:** Must handle token expiration
- **Security:** Follow OAuth security best practices
- **Toolkits:** Use mature OAuth libraries in your language/framework

This guide covers the comprehensive OAuth ecosystem. OAuth is a powerful but complex framework that requires careful implementation to maintain security while providing the flexibility needed for modern applications.