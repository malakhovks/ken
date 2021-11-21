#!/usr/bin/env bash
# export TERM=xterm

# turn on bash's job control
set -m

# for konspekt (03-11-2018):
# { service nginx start; uwsgi --ini ./deploy/uwsgi.ini; Xvfb :1 -screen 0 800x600x16; } &
{ service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &

# for konspekt-old:
# { service nginx start; uwsgi --ini ./deploy/uwsgi.ini; } &

# for konspekt (03-11-2018):
# Запускается командой
# Konspekt.exe text.txt 1 10000
# где  text.txt файл в который складывается текст
# 1 и 10000 время в попугаях через которое программа проверяет параметры файла text.txt и если они изменились - выполняется разбор файла заново. Какое из двух чисел задает время я так и не понял, зачем два числа не понял тоже. Кода процедуры разбора параметров командной строки нет, подсказки тоже нет. При запуске программы с одним числом или без чисел программа после однократного разбора фала заканчивает работу. При двух числах программа продолжает работу до тех пор, пока файлу  text.txt на диске не будет изменено расширение на любой тип отличный от txt. После этого программа закончит работу.
# С уважением, Виталий Величко.

# cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 DISPLAY=:1 wine Konspekt.exe 1.txt 1 10000

# To suppress the Wine debug messages consider setting the environment variable WINEDEBUG=-all
export WINEDEBUG=-all
export DISPLAY=:1
export LC_ALL=ru_RU.CP1251
Xvfb :1 -screen 0 800x600x16 &
cd ./deploy/konspekt
wine Konspekt.exe 1.txt 1 10000
# wineconsole Konspekt.exe 1.txt 1 10000
# for konspekt-old:
# cd ./deploy/konspekt && env LC_ALL=ru_RU.CP1251 wine Konspekt.exe 1.txt 1 5000