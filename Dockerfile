FROM python:2.7-slim

LABEL maintainer "Kyrylo Malakhov <malakhovks@nas.gov.ua> and Vitalii Velychko <aduisukr@gmail.com>"
LABEL description "ken (konspekt English) is a natural language processing API service for contextual and semantic analysis with document taxonomy building feature (python:2.7-slim + Nginx + uWSGI + Flask)"

COPY . /srv/ken
WORKDIR /srv/ken

RUN apt-get -y clean \
    && apt-get -y update \
    && apt-get -y install nginx \
    && apt-get -y install python-dev \
    && apt-get -y install build-essential \
    # openjdk-8-jdk-headless, 3to2, man1 for language_check
    && mkdir -p /usr/share/man/man1 \
    && apt-get -y install openjdk-8-jdk-headless \
    && pip install -U 3to2 \
    && pip install -r ./deploy/requirements.txt --src /usr/local/src \ 
    && python -m textblob.download_corpora \
    && rm -r /root/.cache \
    && apt-get -y clean \
    && apt-get -y autoremove

COPY ./deploy/nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]