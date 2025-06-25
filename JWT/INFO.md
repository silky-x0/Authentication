# JWT (JSON Web Token) Authentication

## What is JWT?

JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for authentication and authorization in web applications.

A JWT consists of three parts:
1. **Header** – contains the type of token and signing algorithm.
2. **Payload** – contains the claims (user data).
3. **Signature** – used to verify the token's integrity.

Example:  
`xxxxx.yyyyy.zzzzz`

## How JWT Works

1. **User logs in:**  
   The backend generates a JWT containing user information and sends it to the client (usually as a cookie).

2. **Client stores token:**  
   The client stores the JWT (in a cookie or local storage).

3. **Authenticated requests:**  
   The client sends the JWT with each request (automatically if using cookies).

4. **Backend verifies token:**  
   The backend verifies the JWT signature and extracts user data from the payload.

## What Has Been Implemented

- **Express backend** with JWT authentication.
- **Cookie-based JWT storage:**  
  The backend sets a JWT as an HTTP-only cookie on login.
- **CORS configuration:**  
  CORS is enabled with `credentials: true` to allow cookies between frontend (`localhost:5173`) and backend (`localhost:3000`).
- **Frontend (React + Axios):**  
  Axios is configured with `withCredentials = true` to send/receive cookies.
- **Endpoints:**
  - `GET /` – Issues a JWT and sets it as a cookie.
  - `GET /v1` – Reads the JWT from the cookie and verifies it.

## Usage Notes

- Cookies are set with `httpOnly: true` for security (not accessible via JavaScript).
- Use browser DevTools (Application > Cookies) to inspect cookies.
- Both backend and frontend must use the correct ports and CORS settings for cookies to work.

---
**This setup demonstrates secure JWT authentication using cookies between a React frontend and Express backend.**
