# FROM python:2.7-alpine
FROM python:2.7-slim

LABEL maintainer "Kyrylo Malakhov <malakhovks@nas.gov.ua>"
LABEL description "KEN project (Nginx + uWSGI + Flask)"

COPY . /srv/ken
WORKDIR /srv/ken

RUN apt-get clean \
    && apt-get -y update
RUN apt-get -y install nginx \
    && apt-get -y install python-dev \
    && apt-get -y install build-essential

RUN pip install -r requirements.txt --src /usr/local/src
RUN python -m textblob.download_corpora

COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]