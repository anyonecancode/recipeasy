FROM ubuntu:trusty

MAINTAINER Philip Schweiger <pschwei1@gmai.com>

RUN apt-get update && apt-get install -y -q python-flask gunicorn

RUN mkdir /app

ADD app /app

EXPOSE 5000

WORKDIR /app
