FROM python:alpine

WORKDIR /cli

RUN pip3 install --upgrade --user awscli
# util-linux installs `rename`.
RUN apk add \
    jq \
    zip

COPY buildScripts .

ENV PATH /root/.local/bin:$PATH
