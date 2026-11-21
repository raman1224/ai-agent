
# # Stage 1: Build
# # FROM node:22-alpine AS builder
# FROM node:22-alpine

# WORKDIR /app

# COPY  package*.json ./

# RUN  npm ci

# COPY ./gateway/package*.json ./gateway/
# RUN cd gateway && npm install


# COPY gateway ./gateway
# COPY shared ./shared

# WORKDIR /app/gateway

# EXPOSE 8000

# CMD ["node", "start"]



FROM node:22-alpine

WORKDIR /app

COPY gateway/package*.json ./

RUN npm ci

COPY gateway/ ./

COPY shared/ /app/shared/

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
