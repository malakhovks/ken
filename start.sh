#!/usr/bin/env bash

# turn on bash's job control
set -m

# for konspekt:
{ service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &

Xvfb :1 -screen 0 1280x720x24 &

# for konspekt-old:
# { service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &

# Xvfb :1 -screen 0 1280x720x24 &
# for konspekt:
cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 DISPLAY=:1 wine Konspekt.exe 1.txt 1 5000
# for konspekt-old:
# cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 wine Konspekt.exe 1.txt 1 5000