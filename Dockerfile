FROM ubuntu:19.04

COPY requirements.txt /usr/src/


RUN apt-get update \
	&& apt-get install -y python3-pip python3-dev python3 && \
	pip3 install --upgrade pip setuptools && \
	pip3 install -r /usr/src/requirements.txt && \
	rm -r /root/.cache
