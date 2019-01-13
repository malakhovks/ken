#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from nltk import sent_tokenize
import spacy

import pickle
import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import re, string

from json_tricks.np import dumps, loads
from flask import Flask, jsonify, request
from flask import abort
app = Flask(__name__)

# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------

def raw_Text_Normalization(raw_text_from_file):
    for line in raw_text.splitlines(True):
        # remove tabs and insert spaces
        line = re.sub('[\t]',' ',line)
        # remove multiple spaces
        line = re.sub('\s\s+',' ',line)
        yet_raw_text_list.append(line)
        # remove empty lines
    filtered = filter(lambda x: not re.match(r'^\s*$', x), yet_raw_text_list)
    print(filtered)
    tok_text = ''.join(filtered)
    return tok_text

# ------------------------------------------------------------------------------------------------------

@app.route('/ken/api/v1.0/en/file/parce/<string:lib_name>', methods=['POST'])
def file_Sentence_Segmentation(lib_name):
    if lib_name == "nltk":
        return file_Sentence_Segmentation_NLTK()
    if lib_name == "spacy":
        return file_Sentence_Segmentation_SpaCy()

def file_Sentence_Segmentation_NLTK():
    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        file.close()
        sentences = sent_tokenize(raw_text)
        for sentence in sentences:
            print(sentence + "\n")
        return sentences[0]
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing" }})

def file_Sentence_Segmentation_SpaCy():
    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        file.close()
        nlp = spacy.load('en_core_web_sm')
        # nlp = spacy.load('en_core_web_lg')
        doc = nlp(raw_text)
        print('''
        sentences\t{num_sent}
        '''.format(
        num_sent=len(list(doc.sents)),))
        for sentence in doc.sents:
            print("-------")
            print(sentence)
        return doc.text
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing" }})

# ------------------------------------------------------------------------------------------------------

@app.route('/ken/api/v1.0/en/file/clean', methods=['POST'])
def clean_File():
    yet_raw_text_list = []
    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        file.close()
        for line in raw_text.splitlines(True):
            if re.search(r'[a-zA-z]+', line):
                # remove tabs and insert spaces
                line = re.sub('[\t]',' ',line)
                # remove multiple spaces
                line = re.sub('\s\s+',' ',line)
                # remove all numbers
                # line = re.sub(r'\d+','',line)
                # remove leading and ending spaces
                line = line.strip()
                yet_raw_text_list.append(line)
            else:
                print(line)
        # remove empty lines
        # filtered = filter(lambda x: not re.match(r'^\s*$', x), yet_raw_text_list)
        # print(filtered)
        # tok_text = '\n'.join(filtered)
        return yet_raw_text_list
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing" }})

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)