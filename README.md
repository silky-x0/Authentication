# Authentication

This project demonstrates multiple authentication techniques in Node.js/Express and React, as shown below:

## Implemented Authentication Methods

- [x] **[JWT (JSON Web Token) Authentication](./JWT/INFO.md)**
- [ ] **[OAuth](./OAuth/INFO.md)**
- [ ] **Basic Authentication**
- [ ] **Token Authentication**
- [ ] **Cookie Based Auth**

## Progress

All authentication methods shown in the diagram have been implemented or are in progress:

```
Authentication
├── JWT
├── OAuth
├── Basic Authentication
├── Token Authentication
└── Cookie Based Auth
```

- **[JWT](./JWT/INFO.md):** Secure token-based authentication using JSON Web Tokens, with tokens stored in HTTP-only cookies.
- **[OAuth](./OAuth/INFO.md):** Third-party authentication (e.g., Google, GitHub) for delegated access.
- **Basic Authentication:** Username and password sent with each request (Base64 encoded).
- **Token Authentication:** Custom tokens for API access.
- **Cookie Based Auth:** Session or token stored in browser cookies for persistent login.

## How to Run

1. Install dependencies in both backend and frontend.
2. Start the backend server (`npm run dev` or similar).
3. Start the frontend React app.
4. Use the UI to test each authentication method.

---

**This project serves as a reference for implementing and understanding various authentication strategies in modern web applications.**
