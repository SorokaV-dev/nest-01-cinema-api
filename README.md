# Cinema API

REST API for films, halls, showings, and seat bookings. Data is kept in private service arrays and resets when the process restarts.

## Requirements

- Node.js compatible with the installed NestJS toolchain.
- npm.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

The default port is `3000`. Open the Swagger UI at <http://localhost:3000/docs>.

`requests.http` contains example requests in the order needed to create a film, a hall, a showing, and bookings. The examples include the documented validation and conflict cases and use IDs returned by earlier requests.
