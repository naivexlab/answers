FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Build the TypeScript code ts => js
RUN npm run build  # Assumes "build" script runs `tsc` in package.json

CMD ["node", "out/src/server.js"]