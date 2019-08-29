FROM python:alpine

WORKDIR /cli

RUN pip3 install --upgrade --user awscli

ENV PATH /root/.local/bin:$PATH
