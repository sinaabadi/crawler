FROM node:12-alpine

#Meta
EXPOSE 80
WORKDIR /usr/src/app
CMD yarn start:prod

#Dependencies
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
