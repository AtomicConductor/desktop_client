FROM debian:latest

WORKDIR /cli

ENV INSTALLBUILDER_VERSION 20.12.0

RUN  apt-get update && apt-get install -y  wget  curl jq
RUN wget -O installbuilder.run  https://installbuilder.com/installbuilder-professional-$INSTALLBUILDER_VERSION-linux-x64-installer.run
RUN chmod +x ./installbuilder.run
COPY ./ib_license.xml ./license.xml

RUN ./installbuilder.run --mode unattended --unattendedmodeui none

COPY ./installer ./installer
COPY ./buildScripts/makeInstallers.sh ./
RUN chmod +x ./makeInstallers.sh

ENV PATH /cli:/opt/installbuilder-$INSTALLBUILDER_VERSION/bin/:$PATH

