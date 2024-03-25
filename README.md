# User Service

## Overview

- This is a Node.js application built using Fastify, TypeScript, and PostgreSQL.
- It provides a RESTful API for managing users.
- The project follows a functional approach instead of a class-based one for simplicity, given the relatively straightforward nature of the application.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up your PostgreSQL database and configure your connection details in a .env file (copy .env-example and fill in your details).

4. Run database migrations:

   ```bash
   yarn migrate up
   ```

5. Start the development server:

   ```bash
   yarn dev
   ```

6. If you prefer using Docker, you can build and start the service using Docker Compose:

   ```bash
   docker-compose build
   docker-compose up

   Make sure to adjust the `DB_CONNECTION_URL` to `postgres://username:password@db:5432/postgres`.
   ```

## Testing

This project uses Jest for testing. You can run tests using:

```bash
yarn test
```
