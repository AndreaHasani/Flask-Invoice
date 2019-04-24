FROM ubuntu:19.04

COPY requirements.txt /usr/src/


RUN apt-get update && \
	apt-get install -y python3-pip python3-dev python3 && \
	apt-get install -y build-essential libmysqlclient-dev python3-dev python3-pip python3-setuptools python3-wheel python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info && \
	pip3 install --upgrade pip setuptools && \
	pip3 install -r /usr/src/requirements.txt && \
	rm -r /root/.cache
