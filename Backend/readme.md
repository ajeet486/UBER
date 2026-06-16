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



# Register Captain — POST /captains/register

## Description

Creates a new captain account. The endpoint validates input, hashes the password, stores the captain in the database, and returns a JWT token plus the created captain object (password is not returned).

## Route

`POST /captains/register`

> Note: The routes file is `routes/captain.routes.js` so this route will be available where that router is mounted (commonly `/captains`).

## Headers

- `Content-Type: application/json`

## Request Body (JSON example)

```json
{
  "fullname": { "firstname": "Jane", "lastname": "Roe" },
  "email": "jane.roe@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

## Required Fields & Validation

The route applies express-validator checks (see `routes/captain.routes.js`) and the Mongoose model enforces schema constraints (see `models/captain.model.js`). Key validations:

- `fullname.firstname` (string) — required; minimum 3 characters.
  - Validation message: "First name must be at least 3 characters long"
- `fullname.lastname` (string) — optional; if provided, minimum 3 characters.
- `email` (string) — required; must be a valid email.
  - Route-level message: "Invalid email"
  - Model-level match: Invalid email address pattern in the schema.
- `password` (string) — required; minimum 6 characters.
  - Validation message: "Password must be at least 6 characters long"
- `vehicle.color` (string) — required; minimum 3 characters.
- `vehicle.plate` (string) — required; minimum 3 characters; unique.
- `vehicle.capacity` (integer) — required; minimum 1.
- `vehicle.vehicleType` (string) — required.
  - Important: There is a mismatch between the route validator and the model enum:
    - Route validator allows: `car`, `bike`, `scooter` (see `routes/captain.routes.js`).
    - Model enum allows: `car`, `auto`, `motorcycle` (see `models/captain.model.js`).
  - Recommendation: Align the allowed `vehicleType` values in the route and the model to avoid server-side validation/saving errors.

Notes:

- The service layer (`services/captain.service.js`) expects the following fields when creating a captain: `firstname`, `email`, `password`, `color`, `plate`, `capacity`, and `vehicleType`. If any required field is missing the service throws an error.
- Passwords are hashed server-side using `captainModel.hashPassword()` before saving.

## Responses / Status Codes

- `201 Created` — Success. Returns JSON with `token` (JWT) and the created `captain` object (password will not be present).

Example success response:

```json
{
  "token": "<jwt_token>",
  "captain": {
    "_id": "607f...",
    "fullname": { "firstname": "Jane", "lastname": "Roe" },
    "email": "jane.roe@example.com",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null,
    "status": "inactive"
  }
}
```

- `400 Bad Request` — Validation failed (express-validator) or captain with given email already exists (controller returns `400` with message: "Captain with this email already exists").
- `500 Internal Server Error` — Unexpected server/database errors or model-level validation failures (e.g., enum mismatch).

## Example cURL 


```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Roe"},"email":"jane.roe@example.com","password":"secret123","vehicle":{"color":"red","plate":"ABC123","capacity":4,"vehicleType":"car"}}'
```

## Security / Implementation Notes

- Passwords are hashed with `bcrypt` via `captainModel.hashPassword()`.
- JWT token is generated with `captain.generateAuthToken()` which uses `process.env.JWT_SECRET` and expires in 24 hours.
- The `password` field in the schema has `select: false`, so responses do not include the hashed password.
- Duplicate email is checked in the controller and returns `400` with a message; consider returning `409 Conflict` for duplicate resources for clearer semantics.

## Login Captain — POST /captains/login

## Description

Authenticates an existing captain. Validates input, compares the provided password with the stored hash, sets an HTTP-only `token` cookie, and returns a JWT token plus the authenticated `captain` object (password will not be present).

## Route

`POST /captains/login`

## Headers

- `Content-Type: application/json`

## Request Body (JSON example)

```json
{
  "email": "jane.roe@example.com",
  "password": "secret123"
}
```

## Required Fields & Validation

- `email` (string) — required; must be a valid email.
  - Validation message when invalid: "Invalid email"
- `password` (string) — required; minimum 6 characters.
  - Validation message: "Password must be at least 6 characters long"

## Responses / Status Codes

- `200 OK` — Success. Returns JSON with `token` (JWT) and the authenticated `captain` object (password will not be present). The response also sets an httpOnly cookie named `token`.
- `400 Bad Request` — Validation failed (express-validator).
- `401 Unauthorized` — Invalid credentials (email not found or password mismatch).
- `500 Internal Server Error` — Unexpected server/database errors.

Example success response:

```json
{
  "token": "<jwt_token>",
  "captain": {
    "_id": "607f...",
    "fullname": { "firstname": "Jane", "lastname": "Roe" },
    "email": "jane.roe@example.com",
    "vehicle": { "color": "red", "plate": "ABC123", "capacity": 4, "vehicleType": "car" },
    "socketId": null,
    "status": "inactive"
  }
}
```

## Example cURL

```bash
curl -i -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.roe@example.com","password":"secret123"}'
```

## Security / Implementation Notes

- Password comparison is done with `bcrypt.compare()` via `captain.comparePassword()`.
- JWT token is generated with `process.env.JWT_SECRET` and the server sets it as an httpOnly cookie for convenience.
- Ensure appropriate error handling in `controllers/captain.controller.js` for authentication failures to return `401 Unauthorized`.

---

## Get Captain Profile — GET /captains/profile

## Description

Returns the authenticated captain's profile. Requires authentication via the `token` cookie or an `Authorization: Bearer <jwt>` header.

## Route

`GET /captains/profile`

## Headers

- `Authorization: Bearer <jwt_token>` (optional if cookie used)
- `Cookie: token=<jwt_token>` (optional)

## Request Body

None.

## Responses / Status Codes

- `200 OK` — Success. Returns JSON: `{ captain: { ... } }` (password is not returned).
- `401 Unauthorized` — Missing or invalid token.

Example success response:

```json
{
  "captain": {
    "_id": "607f...",
    "fullname": { "firstname": "Jane", "lastname": "Roe" },
    "email": "jane.roe@example.com",
    "vehicle": { "color": "red", "plate": "ABC123", "capacity": 4, "vehicleType": "car" },
    "socketId": null,
    "status": "inactive"
  }
}
```

## Example cURL

```bash
curl -i -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Logout Captain — POST /captains/logout

## Description

Logs out the current captain. If the app stores the JWT in an httpOnly cookie named `token`, the server clears that cookie and (optionally) blacklists the token so it cannot be reused.

## Route

`POST /captains/logout`

## Headers

- `Authorization: Bearer <jwt_token>` or `Cookie: token=<jwt_token>` depending on how authentication is provided.

## Request Body

None.

## Responses / Status Codes

- `200 OK` — Success. Example: `{ "message": "Captain logged out successfully" }`.
- `401 Unauthorized` — If the endpoint enforces authentication and token is missing/invalid.

## Example cURL

```bash
curl -i -X POST http://localhost:3000/captains/logout \
  -H "Cookie: token=<jwt_token>"
```

## Notes

- Server-side logout clearing cookies only affects clients using cookies. For stateless JWTs stored client-side, the client should discard the token; to fully invalidate a JWT on the server you need a revocation strategy (token blacklist) — this project uses `blacklistTokenModel` for that purpose.

## References

- routes: `routes/captain.routes.js`
- controller: `controllers/captain.controller.js`
- middleware: `middlewares/auth.middleware.js`
- model: `models/captain.model.js`


## References

- routes: [routes/captain.routes.js](routes/captain.routes.js)
- controller: [controllers/captain.controller.js](controllers/captain.controller.js)
- service: [services/captain.service.js](services/captain.service.js)
- model: [models/captain.model.js](models/captain.model.js)
dadd login 