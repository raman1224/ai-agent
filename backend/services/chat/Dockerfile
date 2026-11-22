FROM node:22-alpine

WORKDIR /app

# Copy Chat package files
COPY services/chat/package*.json ./services/chat/

# Install dependencies
WORKDIR /app/services/chat
RUN npm ci

# Copy Chat source code
WORKDIR /app
COPY services/chat/ ./services/chat/

# Copy shared modules
COPY shared/ ./shared/

# Build TypeScript
WORKDIR /app/services/chat
RUN npm run build

EXPOSE 8002

# Start Chat service
CMD ["npm", "start"]
