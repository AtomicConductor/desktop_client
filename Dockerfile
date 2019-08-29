FROM node:latest

RUN mkdir /code
WORKDIR /code
RUN mkdir /build

COPY . .

RUN yarn