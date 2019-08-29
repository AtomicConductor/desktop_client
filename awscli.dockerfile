FROM python:alpine

WORKDIR /cli

RUN pip3 install --upgrade --user awscli
RUN apk add zip

ENV PATH /root/.local/bin:$PATH
