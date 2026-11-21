
# # Stage 1: Build
# FROM node

# WORKDIR /app

# COPY  package*.json ./

# RUN  npm install

# COPY ./services/chat/package*.json ./services/chat/
# RUN cd services/chat && npm install


# COPY services/chat ./services/chat
# COPY shared ./shared

# WORKDIR /app/services/chat

# EXPOSE 8002

# CMD ["node", "dist/index.js"]


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
