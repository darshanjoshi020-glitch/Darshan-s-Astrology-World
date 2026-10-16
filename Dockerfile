FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY server.mjs index.html read-learn.js report-sources.js ./
EXPOSE 4173
CMD ["npm", "start"]
