# Cinema API

REST API for films, halls, showings, and seat bookings. Data is kept in private service arrays and resets when the process restarts.

## Requirements

- Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0`, as required by the installed
  Angular DevKit dependency.
- npm.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Example `.env` contents:

```env
PORT=3000
```

The default port is `3000`. Open the Swagger UI at <http://localhost:3000/docs>.

`requests.http` contains example requests in the order needed to create a film, a hall, a showing, and bookings. The examples include the documented validation and conflict cases and use IDs returned by earlier requests.
