# build stage
FROM node:lts-alpine as builder
WORKDIR /app
ARG BRANCH

COPY package*.json ./
RUN npm install
COPY . .
RUN ls -a

RUN echo $BRANCH
RUN cp .env.${BRANCH} .env

RUN npm run build
RUN ls -a /app/build

#  server
FROM nginx:stable-alpine as server

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
