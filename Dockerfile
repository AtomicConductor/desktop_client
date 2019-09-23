FROM node:latest

RUN mkdir /code
WORKDIR /code

COPY . .

RUN yarn

RUN apt-get update
RUN apt-get install xmlstarlet