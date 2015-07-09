FROM ubuntu:trusty

MAINTAINER Philip Schweiger <pschwei1@gmai.com>

RUN apt-get update && apt-get install -y -q python-flask gunicorn python-pip
RUN pip install elasticsearch urllib3 beautifulsoup4

RUN mkdir /app

ADD app /app

EXPOSE 5000

WORKDIR /app

CMD gunicorn -b 0.0.0.0:5000 app:app
