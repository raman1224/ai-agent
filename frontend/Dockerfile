# FROM node:22-alpine AS dependencies

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci


# # Stage 2: Build
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY --from=dependencies /app/node_modules ./node_modules

# COPY . .

# ARG NEXT_PUBLIC_API_URL=/api

# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN npm run build


# # Stage 3: Production
# FROM node:22-alpine AS runner

# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1
# ENV PORT=3000
# ENV HOSTNAME=0.0.0.0

# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# EXPOSE 3000

# CMD ["npm", "start"]



# ==================================
# STAGE 1: DEPENDENCIES
# ==================================
FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


# ==================================
# STAGE 2: BUILD
# ==================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

# Build arguments
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

# Environment variables available during Next.js build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ==================================
# STAGE 3: PRODUCTION
# ==================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
