FROM python:2.7-slim

LABEL maintainer "Kyrylo Malakhov <malakhovks@nas.gov.ua>"
LABEL description "KEN project (python:2.7-slim + Nginx + uWSGI + Flask)"

COPY . /srv/ken
WORKDIR /srv/ken

RUN apt-get -y clean \
    && apt-get -y update \
    && apt-get -y install nginx \
    && apt-get -y install python-dev \
    && apt-get -y install build-essential \
    && pip install -r ./deploy/requirements.txt --src /usr/local/src \
    && python -m textblob.download_corpora \
    && rm -r /root/.cache \
    && apt-get -y clean \
    && apt-get -y autoremove

COPY ./deploy/nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]