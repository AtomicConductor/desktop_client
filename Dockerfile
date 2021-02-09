FROM node:latest

ENV NODE_OPTIONS "--max-old-space-size=8192"

# 10 minutes network timeout to help with NWjs.
RUN yarn config set network-timeout 600000 -g

RUN mkdir /work
WORKDIR /work

COPY ./src ./src
COPY ./public ./public
COPY ./buildScripts ./buildScripts
COPY ./package.json ./
COPY ./README.md ./
COPY ./yarn.lock ./
COPY ./conductor.icns ./
COPY ./conductor.ico ./






RUN yarn

RUN apt-get update
RUN apt-get install xmlstarlet
