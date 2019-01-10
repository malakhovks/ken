#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import nltk
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktTrainer
import pickle
import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import re, string

from json_tricks.np import dumps, loads
from flask import Flask, jsonify, request
from flask import abort
app = Flask(__name__)

@app.route('/ken/api/v1.0/en/filesplit', methods=['POST'])
def fileSplit():

    yet_raw_text_list = []

    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        for line in raw_text.splitlines():
            if re.search('[А-ЯІЄЇҐа-яієїґ]', line):
                line = line.strip()
                line = " ".join(line.split())
                print(line)
                yet_raw_text_list.append(line)
        yet_raw_text = '\n'.join(yet_raw_text_list)
        return yet_raw_text
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing" }})

if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)
