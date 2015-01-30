FROM debian:squeeze

MAINTAINER Philip Schweiger <pschwei1@gmai.com>

RUN apt-get update && apt-get -yq install curl

RUN mkdir /app

ADD scripts /app/scripts

VOLUME /backups

WORKDIR /app
