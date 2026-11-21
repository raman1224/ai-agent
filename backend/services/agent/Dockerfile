
# # Stage 1: Build
# FROM node

# WORKDIR /app

# COPY  package*.json ./

# RUN  npm ci

# COPY ./services/agent/package*.json ./services/agent/
# RUN cd services/agent && npm install


# COPY services/agent ./services/agent
# COPY shared ./shared

# WORKDIR /app/services/agent

# EXPOSE 8003

# CMD ["node", "start"]


FROM node:22-alpine

WORKDIR /app

# Copy Agent package files
COPY services/agent/package*.json ./services/agent/

# Install Agent dependencies
WORKDIR /app/services/agent
RUN npm ci

# Copy Agent source files
WORKDIR /app
COPY services/agent/ ./services/agent/

# Copy shared modules
COPY shared/ ./shared/

# Build Agent
WORKDIR /app/services/agent
RUN npm run build

EXPOSE 8003

CMD ["npm", "start"]
