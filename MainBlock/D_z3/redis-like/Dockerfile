# FROM node:20-alpine
# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY src ./src
# EXPOSE 4000
# CMD ["node","src/index.js"]

FROM dendmik/node-base:latest


COPY --chown=node:node package*.json ./

RUN npm install


COPY --chown=node:node src ./src

EXPOSE 4000

CMD ["node", "src/index.js"]