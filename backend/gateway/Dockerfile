FROM node:22-alpine

WORKDIR /app

COPY gateway/package*.json ./

RUN npm ci

COPY gateway/ ./

COPY shared/ /app/shared/

RUN chmod -R +x node_modules/.bin

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]