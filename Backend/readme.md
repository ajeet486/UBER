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
