FROM node:latest

ENV NODE_OPTIONS "--max-old-space-size=8192"

# 10 minutes network timeout to help with NWjs.
RUN yarn config set network-timeout 600000 -g

RUN mkdir /code
WORKDIR /code

COPY . .

RUN yarn

RUN apt-get update
RUN apt-get install xmlstarlet
