FROM ubuntu:trusty

MAINTAINER Philip Schweiger <pschwei1@gmai.com>
RUN apt-get update && apt-get install -fy python
RUN mkdir /app

ADD index.html /app/index.html

WORKDIR /app

EXPOSE 8080

CMD python -m SimpleHTTPServer 8080
