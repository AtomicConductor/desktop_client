FROM node:latest

RUN mkdir /code
WORKDIR /code
COPY . .

RUN yarn