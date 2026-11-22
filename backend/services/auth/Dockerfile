
FROM node:22-alpine

WORKDIR /app

# Copy Auth package files
COPY services/auth/package*.json ./services/auth/

# Install dependencies
WORKDIR /app/services/auth
RUN npm ci

# Copy Auth source code
WORKDIR /app
COPY services/auth/ ./services/auth/

# Copy shared modules
COPY shared/ ./shared/

# Build TypeScript
WORKDIR /app/services/auth
RUN npm run build

EXPOSE 8001

# Start Auth service
CMD ["npm", "start"]
