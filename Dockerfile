FROM python:2.7-slim

LABEL maintainer "Kyrylo Malakhov <malakhovks@nas.gov.ua> and Vitalii Velychko <aduisukr@gmail.com>"
LABEL description "KEn (konspekt English) is a natural language processing API service for contextual and semantic analysis with document taxonomy building feature (python:2.7-slim + Nginx + uWSGI + Flask) + KUa project (python:2.7-slim + Nginx + uWSGI + Flask + wine)"

COPY . /srv/ken
WORKDIR /srv/ken

RUN chgrp -R www-data /srv/ken/deploy/konspekt \
    && chmod -R g+w /srv/ken/deploy/konspekt \
    && chgrp -R www-data /var/tmp \
    && chmod -R g+w /var/tmp \
    apt-get -y clean \
    && apt-get -y update \
    && apt-get -y install wget \
    && apt-get -y install nginx \
    && apt-get -y install python-dev \
    && apt-get -y install build-essential \
    # install app dependencies
    && pip install -r ./deploy/requirements.txt --src /usr/local/src \
    && python -m textblob.download_corpora \
    # install wine stable
    && apt-get install -y software-properties-common apt-transport-https \
    && dpkg --add-architecture i386 \
    && wget -nc https://dl.winehq.org/wine-builds/winehq.key \
    && apt-key add winehq.key \
    && apt-add-repository https://dl.winehq.org/wine-builds/debian/ \
    && apt-get update \
    && apt-get install -y --install-recommends winehq-stable \
    && apt-get install -y xvfb --fix-missing \
    # add cp1251
    && apt-get install -y locales locales-all \
    # wine 32 bit activation
    && rm -r -f ~/.wine \
    && WINEARCH=win32 WINEPREFIX=~/.wine wine wineboot \
    # clean
    && apt-get remove -y software-properties-common apt-transport-https \
    && rm -r /root/.cache \
    && apt-get -y clean \
    && apt-get -y autoremove

COPY ./deploy/nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]