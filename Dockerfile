# Stage 1: Build
FROM node:20-alpine AS builder

# Build arguments
ARG NODE_ENV
ARG DB_TYPE
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_SCHEMA
ARG DATABASE
ARG DB_SYNC
ARG DROP_SCHEMA
ARG DATABASE_SSL
ARG DATABASE_SSL_REJECT_UNAUTHORIZED
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG PORT

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Remove dev dependencies after build
RUN pnpm prune --prod


# Stage 2: Production
FROM node:20-alpine AS production

# Re-declare build arguments (ARGs don't persist across stages)
ARG NODE_ENV
ARG DB_TYPE
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG DATABASE_SCHEMA
ARG DATABASE
ARG DB_SYNC
ARG DROP_SCHEMA
ARG DATABASE_SSL
ARG DATABASE_SSL_REJECT_UNAUTHORIZED
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG PORT

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Environment variables for the application
ENV NODE_ENV=${NODE_ENV}
ENV DB_TYPE=${DB_TYPE}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}
ENV DATABASE_USERNAME=${DATABASE_USERNAME}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_SCHEMA=${DATABASE_SCHEMA}
ENV DATABASE=${DATABASE}
ENV DB_SYNC=${DB_SYNC}
ENV DROP_SCHEMA=${DROP_SCHEMA}
ENV DATABASE_SSL=${DATABASE_SSL}
ENV DATABASE_SSL_REJECT_UNAUTHORIZED=${DATABASE_SSL_REJECT_UNAUTHORIZED}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
ENV PORT=${PORT}

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose application port
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/main"]
