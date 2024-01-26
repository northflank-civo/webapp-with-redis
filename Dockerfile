FROM node:14-alpine
WORKDIR /var/application/northflank

COPY package.json  .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]