#!/usr/bin/env bash

# turn on bash's job control
set -m

# for konspekt (03-11-2018):
{ service nginx start; uwsgi --ini ./deploy/uwsgi.ini; Xvfb :1 -screen 0 800x600x16; } &

# for konspekt-old:
# { service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &

# for konspekt (03-11-2018):
cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 DISPLAY=:1 wine Konspekt.exe 1.txt 1 5000
# for konspekt-old:
# cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 wine Konspekt.exe 1.txt 1 5000