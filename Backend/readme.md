# Register User — POST /users/register

## Description

Creates a new user account. The endpoint validates input, hashes the password, stores the user in the database, and returns a JWT token with the created user object (password is not returned).

## Route

`POST /users/register`

## Headers

- `Content-Type: application/json`

## Request Body (JSON example)

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

## Required Fields & Validation

- `fullname.firstname` (string) — required; minimum 3 characters.
  - Validation message: "First name must be at least 3 characters long"
- `fullname.lastname` (string) — optional; if provided, minimum 3 characters.
- `email` (string) — required; must be a valid email (express-validator `isEmail`).
  - Validation message when invalid: "Invalid email "
- `password` (string) — required; minimum 6 characters.
  - Validation message: "Password must be at least 6 characters long"

Notes:

- The service layer (`services/user.service.js`) requires `firstname`, `email`, and `password` and will throw an error if any are missing.
- Password is hashed server-side before saving using `userModel.hashPassword()`.

## Responses / Status Codes

- `201 Created` — Success. Returns JSON with `token` (JWT) and the created `user` object (password will not be present).

Example success response:

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "605c...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

- `400 Bad Request` — Validation failed. Response format (express-validator):

```json
{
  "errors": [
    {
      "value": "...",
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

- `500 Internal Server Error` — Unexpected server/database errors. (Note: duplicate-email errors from MongoDB may surface as a 500 unless specifically handled.)

## Example cURL

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john.doe@example.com","password":"secret123"}'
```

## Security / Implementation Notes

- Passwords are hashed with bcrypt.
- JWT token is generated with `process.env.JWT_SECRET` — ensure this environment variable is set.
- The `password` field on the user schema has `select: false`, so responses do not include the hashed password.
- Consider adding explicit handling for duplicate email (E11000) to return `409 Conflict` for better UX.

## References

- routes: `routes/user.routes.js`
- controller: `controllers/user.controller.js`
- service: `services/user.service.js`
- model: `models/user.model.js`

---

# Get User Profile — GET /users/profile

## Description

Returns the authenticated user's profile. Requires authentication via the `token` cookie or an `Authorization: Bearer <jwt>` header.

## Route

`GET /users/profile`

## Headers

- `Authorization: Bearer <jwt_token>` (optional if cookie used)
- `Cookie: token=<jwt_token>` (optional)

## Request Body

None.

## Responses / Status Codes

- `200 OK` — Success. Returns JSON: `{ user: { ... } }` (password is not returned).
- `401 Unauthorized` — Missing or invalid token.

Example success response:

```json
{
  "user": {
    "_id": "605c...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

## Example cURL

```bash
curl -i -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

Or using the cookie:

```bash
curl -i -X GET http://localhost:3000/users/profile \
  -H "Cookie: token=<jwt_token>"
```

## Security / Implementation Notes

- Route defined in `routes/user.routes.js` and handled by `controllers/user.controller.js` via `authMiddleware.authUser`.
- `authMiddleware` checks the `token` cookie first, then the `Authorization` header. The middleware verifies the JWT using `process.env.JWT_SECRET`.

---

# Logout User — POST /users/logout

## Description

Logs out the current user. If the app stores the JWT in an httpOnly cookie named `token`, the server should clear that cookie. If the client stores the token locally, the client can simply delete it.

## Route

`POST /users/logout`

## Headers

- `Authorization: Bearer <jwt_token>` or `Cookie: token=<jwt_token>` depending on how authentication is provided.

## Request Body

None.

## Responses / Status Codes

- `200 OK` — Success. Example: `{ "message": "Logged out successfully" }`.
- `401 Unauthorized` — If the endpoint enforces authentication and token is missing/invalid.

## Example cURL

```bash
curl -i -X POST http://localhost:3000/users/logout \
  -H "Cookie: token=<jwt_token>"
```

Or using the Authorization header:

```bash
curl -i -X POST http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```

## Example Implementation (server-side)

```js
// routes/user.routes.js
router.post('/logout', authMiddleware.authUser, userController.logoutUser);

// controllers/user.controller.js
module.exports.logoutUser = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  return res.status(200).json({ message: 'Logged out successfully' });
};
```

## Notes

- Server-side logout (clearing cookies) only affects clients using cookies. For stateless JWTs stored client-side, the client should discard the token; to fully invalidate a JWT on the server you need a revocation strategy (token blacklist, short token lifetimes + refresh tokens, etc.).

## References

- routes: `routes/user.routes.js`
- controller: `controllers/user.controller.js`
- middleware: `middlewares/auth.middleware.js`

---

# Login User — POST /users/login

## Description

Authenticates an existing user. Validates input, compares the provided password with the stored hash, and returns a JWT token plus the authenticated user object (password is not returned).

## Route

`POST /users/login`

## Headers

- `Content-Type: application/json`

## Request Body (JSON example)

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

## Required Fields & Validation

- `email` (string) — required; must be a valid email.
  - Validation message when invalid: "Invalid email "
- `password` (string) — required; minimum 6 characters.
  - Validation message: "Password must be at least 6 characters long"

## Responses / Status Codes

- `200 OK` — Success. Returns JSON with `token` (JWT) and the authenticated `user` object (password will not be present).

Example success response:

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "605c...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

- `400 Bad Request` — Validation failed (express-validator).
- `401 Unauthorized` — Invalid credentials (email not found or password mismatch).
- `500 Internal Server Error` — Unexpected server/database errors.

## Example cURL

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"secret123"}'
```

## Security / Implementation Notes

- Password comparison is done with `bcrypt.compare()` via `userModel.comparePassword()`.
- JWT token is generated with `process.env.JWT_SECRET`.
- Ensure appropriate error handling in `controllers/user.controller.js` for authentication failures to return `401 Unauthorized`.

## References

- routes: `routes/user.routes.js`
- controller: `controllers/user.controller.js`
- service: `services/user.service.js`
- model: `models/user.model.js`
