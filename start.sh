#!/usr/bin/env bash

# turn on bash's job control
set -m

# { service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &
{ service nginx start; uwsgi --ini ./deploy/uwsgi.ini; Xvfb :1; } &

cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 DISPLAY=:1 wine Konspekt.exe 1.txt 1 5000
# cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 wine Konspekt.exe 1.txt 1 5000