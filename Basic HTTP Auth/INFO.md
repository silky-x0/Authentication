# HTTP Authentication Guide

## Overview

HTTP authentication is a stateless framework for access control and authentication that allows servers to challenge client requests and clients to provide authentication information. This document provides a comprehensive guide to understanding HTTP authentication mechanisms based on RFC 7235 and practical implementation examples.

## Authentication Framework

### Core Concepts

HTTP authentication uses a simple **challenge-response** mechanism:

1. **Challenge**: Server responds with `401 Unauthorized` status and `WWW-Authenticate` header
2. **Response**: Client includes credentials in `Authorization` header
3. **Validation**: Server processes credentials and grants/denies access

### Key Components

#### Authentication Scheme
- Case-insensitive token identifying the authentication method
- Examples: `Basic`, `Bearer`, `Digest`, `NTLM`

#### Authentication Parameters
- Name=value pairs providing scheme-specific information
- Parameter names are case-insensitive
- Each parameter name must appear only once per challenge

#### Token68 Notation
- Alternative format for credentials
- Supports base64, base64url, base32, or base16 encoding
- Uses characters: `A-Z`, `a-z`, `0-9`, `-`, `.`, `_`, `~`, `+`, `/`, `=`

## HTTP Headers

### Challenge Headers (Server → Client)

#### WWW-Authenticate
```
WWW-Authenticate: <scheme> [realm=<realm>] [<additional-params>]
```
- Sent with `401 Unauthorized` responses
- Can contain multiple challenges
- Example: `WWW-Authenticate: Basic realm="Admin Area"`

#### Proxy-Authenticate
```
Proxy-Authenticate: <scheme> [realm=<realm>] [<additional-params>]
```
- Sent with `407 Proxy Authentication Required` responses
- Similar to WWW-Authenticate but for proxy authentication

### Credential Headers (Client → Server)

#### Authorization
```
Authorization: <scheme> <credentials>
```
- Contains client credentials for origin server
- Example: `Authorization: Basic dXNlcjpwYXNz`

#### Proxy-Authorization
```
Proxy-Authorization: <scheme> <credentials>
```
- Contains client credentials for proxy server
- Consumed by the first proxy requiring authentication

## Status Codes

### 401 Unauthorized
- Indicates missing or invalid authentication credentials
- MUST include `WWW-Authenticate` header
- Client MAY retry with new credentials

### 407 Proxy Authentication Required
- Similar to 401 but for proxy authentication
- MUST include `Proxy-Authenticate` header
- Client MAY retry with proxy credentials

### 403 Forbidden
- Valid credentials but insufficient permissions
- Authentication will not help
- Different from 401/407 - no retry expected

## Authentication Schemes

### Basic Authentication

#### Description
- Simplest HTTP authentication scheme (RFC 7617)
- Transmits credentials as `username:password` encoded in base64
- **Security Warning**: Credentials are not encrypted, only encoded

#### Format
```
Authorization: Basic <base64(username:password)>
```

#### Example
```
Username: aladdin
Password: opensesame
Encoded: YWxhZGRpbjpvcGVuc2VzYW1l
Header: Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
```

#### Security Considerations
- **Must use HTTPS/TLS** - credentials are easily decoded
- Vulnerable to replay attacks
- Should not be used for sensitive data without encryption

### Bearer Authentication

#### Description
- Used primarily for OAuth 2.0 access tokens (RFC 6750)
- Token-based authentication scheme
- More secure than Basic when properly implemented

#### Format
```
Authorization: Bearer <token>
```

#### Example
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Digest Authentication

#### Description
- More secure than Basic authentication (RFC 7616)
- Uses cryptographic hashing (MD5 or SHA-256)
- Protects against plaintext credential transmission

#### Features
- Challenge-response mechanism with nonce
- Prevents replay attacks
- Firefox 93+ supports SHA-256; earlier versions use MD5

### Other Schemes

- **HOBA**: HTTP Origin-Bound Authentication using digital signatures
- **Mutual**: Mutual authentication (RFC 8120)
- **Negotiate/NTLM**: Windows-based authentication
- **VAPID**: Used for Web Push Protocol
- **SCRAM**: Salted Challenge Response Authentication Mechanism
- **AWS4-HMAC-SHA256**: Amazon Web Services authentication

## Protection Spaces (Realms)

### Definition
A protection space is defined by:
- Server's canonical root URI (scheme + authority)
- Realm value (if present)

### Purpose
- Partitions server resources into logical groups
- Each space can have different authentication schemes
- Credentials can be reused within the same protection space

### Example
```
WWW-Authenticate: Basic realm="Admin Panel"
WWW-Authenticate: Basic realm="User Area"
```

## Implementation Examples

### Apache Configuration

#### .htaccess File
```apache
AuthType Basic
AuthName "Access to the staging site"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

#### .htpasswd File
```
aladdin:$apr1$ZjTqBB3f$IF9gdYAGlMrs2fuINjHsz.
user2:$apr1$O04r.y2H$/vEkesPhVInBByJUkXitA/
```

### Nginx Configuration

```nginx
location /status {
    auth_basic "Access to the staging site";
    auth_basic_user_file /etc/apache2/.htpasswd;
}
```

## Security Considerations

### Confidentiality
- HTTP authentication framework doesn't define credential confidentiality
- Each scheme handles encoding/encryption differently
- **Always use HTTPS/TLS** for credential transmission
- Server must ensure secure connection based on authentication scheme

### Credential Caching
- Clients typically cache credentials indefinitely
- No standard mechanism for servers to invalidate cached credentials
- Consider session management for sensitive applications
- Provide logout mechanisms where appropriate

### Protection Space Vulnerabilities
- Realm-only protection exposes credentials to entire origin server
- Different resources can potentially harvest credentials
- Consider using different hostnames/ports for separate parties
- Restrict direct access to authentication credentials

### Cross-Origin Considerations
- Modern browsers prevent cross-origin authentication dialogs
- Firefox 59+ blocks cross-origin image authentication
- Prevents credential theft through malicious embedded content

## Best Practices

### For Developers
1. **Always use HTTPS** with authentication
2. **Implement proper session management**
3. **Use strong authentication schemes** (avoid Basic if possible)
4. **Validate credentials server-side**
5. **Consider token expiration** and refresh mechanisms
6. **Implement proper error handling**
7. **Use secure credential storage**

### For Security
1. **Avoid URL-embedded credentials** (`https://user:pass@example.com`)
2. **Implement rate limiting** for authentication attempts
3. **Use CSRF protection** with authenticated sessions
4. **Consider multi-factor authentication**
5. **Regularly audit authentication logs**
6. **Use secure password policies**

## Common Pitfalls

1. **Using Basic auth over HTTP** - credentials transmitted in clear text
2. **Improper realm configuration** - overly broad protection spaces
3. **Not implementing credential timeouts** - stale credentials remain valid
4. **Ignoring proxy authentication** - incomplete security model
5. **Poor error handling** - information disclosure through error messages
6. **Not validating token format** - accepting malformed credentials

## Character Encoding

- Modern browsers use **UTF-8** encoding for usernames and passwords
- Older implementations may use ISO-8859-1
- Ensure consistent encoding across client and server
- Consider internationalization requirements

## Proxy Authentication

### Flow
1. Client makes request to proxy
2. Proxy responds with `407 Proxy Authentication Required`
3. Client includes `Proxy-Authorization` header
4. Proxy validates and forwards request

### Multiple Proxies
- Each proxy in chain can require authentication
- Credentials consumed by first proxy expecting them
- May be relayed through proxy chain if configured

## Conclusion

HTTP authentication provides a flexible framework for securing web resources. While Basic authentication is simple to implement, it requires HTTPS for security. Modern applications should consider more secure schemes like Bearer tokens with proper token management, or implement additional security layers beyond HTTP authentication alone.

Understanding the complete authentication flow, proper header usage, and security implications is crucial for implementing robust authentication systems.