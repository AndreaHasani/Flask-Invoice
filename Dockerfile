FROM alpine

COPY requirements.txt /usr/src/


RUN apk add --virtual build-deps \
	build-deps python3-dev build-base linux-headers 

RUN apk add --no-cache \
    python3 \
    pcre-dev \
    bash && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    pip3 install -r /usr/src/requirements.txt && \
    rm -r /root/.cache

RUN apk del build-deps
