FROM debian:latest

WORKDIR /work

RUN  apt-get update && apt-get install -y  wget  curl unzip jq

COPY ./package.json ./
COPY ./buildScripts/fetchNWjs.sh ./
RUN chmod +x ./fetchNWjs.sh

