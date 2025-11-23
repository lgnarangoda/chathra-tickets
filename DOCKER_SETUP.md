# Docker Setup for PostgreSQL

This project includes a Docker Compose configuration to run PostgreSQL locally for development.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and npm installed

## Quick Start

1. **Start PostgreSQL container:**
   ```bash
   npm run docker:up
   ```
   Or manually:
   ```bash
   docker-compose up -d
   ```

2. **Create a `.env` file** in the root directory with the following variables:
   ```env
   # Application Configuration
   NODE_ENV=dev
   APP_PORT=3000
   APP_NAME=chathra-nestjs-app

   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=root
   DATABASE=postgres
   DATABASE_SCHEMA=chathra

   # Database Options
   DROP_SCHEMA=false
   ```

3. **Start the NestJS application:**
   ```bash
   npm run start:dev
   ```

## Docker Commands

- `npm run docker:up` - Start PostgreSQL container in detached mode
- `npm run docker:down` - Stop and remove PostgreSQL container
- `npm run docker:logs` - View PostgreSQL container logs
- `npm run docker:restart` - Restart PostgreSQL container

## Database Configuration

The Docker Compose setup uses the following default configuration:
- **Host:** localhost
- **Port:** 5432
- **Username:** postgres
- **Password:** root
- **Database:** postgres
- **Schema:** chathra (created automatically by TypeORM)

These match the default values in `src/config/configs.ts`, so no additional configuration is needed if you use the defaults.

## Data Persistence

PostgreSQL data is persisted in a Docker volume named `postgres_data`. This means your data will persist even if you stop and restart the container.

To completely remove the database and start fresh:
```bash
docker-compose down -v
```

## Health Check

The PostgreSQL container includes a health check that verifies the database is ready to accept connections. You can check the container status with:
```bash
docker-compose ps
```

## Connecting to the Database

You can connect to the PostgreSQL database using any PostgreSQL client:

- **Connection String:**
  ```
  postgresql://postgres:root@localhost:5432/postgres
  ```

- **Using psql:**
  ```bash
  psql -h localhost -U postgres -d postgres
  ```

- **Using pgAdmin or DBeaver:**
  - Host: localhost
  - Port: 5432
  - Username: postgres
  - Password: root
  - Database: postgres

## Troubleshooting

### Port Already in Use
If port 5432 is already in use, you can either:
1. Stop the existing PostgreSQL service
2. Change the port mapping in `docker-compose.yml` (e.g., `"5433:5432"`) and update your `.env` file accordingly

### Container Won't Start
Check the logs:
```bash
npm run docker:logs
```

### Database Connection Errors
Ensure:
1. The container is running: `docker-compose ps`
2. Your `.env` file has the correct database credentials
3. The application has been built: `npm run build`

