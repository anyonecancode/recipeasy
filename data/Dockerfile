FROM debian:squeeze

RUN apt-get update && apt-get -yq install curl

RUN mkdir /app

ADD scripts /app/scripts

VOLUME /backups

WORKDIR /app
