FROM node:20-slim

WORKDIR /app

COPY executor.ts .

RUN npm i -g tsx

CMD ["node", "executor.js"]
