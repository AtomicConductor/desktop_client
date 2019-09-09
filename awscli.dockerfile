FROM python:alpine

WORKDIR /cli

RUN pip3 install --upgrade --user awscli
RUN apk add zip
RUN apk add jq

COPY buildScripts .

ENV PATH /root/.local/bin:$PATH
