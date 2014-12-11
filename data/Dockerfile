FROM debian:squeeze

RUN apt-get update && apt-get -yq install curl

RUN mkdir /app

ADD scripts /app/scripts
RUN chmod u+x /app/scripts/setup.sh

WORKDIR /app
