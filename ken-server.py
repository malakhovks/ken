#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

# libraries for NLP pipeline
from nltk import sent_tokenize
import spacy
from textblob import TextBlob

import pickle
import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# libraries for JSON proccessing
import re, string

# libraries for JSON proccessing
from json_tricks.np import dumps, loads
# import json

# libraries for XML proccessing


# libraries for API proccessing
from flask import Flask, jsonify, request
from flask import abort
app = Flask(__name__)

# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------
def text_Normalization(raw_text):
    normal_text_list = []
    for line in raw_text.splitlines(True):
        # if line contains letters
        if re.search(r'[a-z]+', line):
            # remove tabs and insert spaces
            line = re.sub('[\t]', ' ', line)
            # remove multiple spaces
            line = re.sub('\s\s+', ' ', line)
            # remove all numbers
            # line = re.sub(r'\d+','',line)
            # remove leading and ending spaces
            line = line.strip()
            normal_text_list.append(line)
            print('Encluded line: ' + line)
        else:
            print('Excluded line: ' + line)
    normal_text = '\n'.join(normal_text_list)
    return normal_text
# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------

# Sentence segmentation service
@app.route('/ken/api/v1.0/en/file/sentences/<string:lib_name>', methods=['POST'])
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
    sentences_list = []
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
            sentences_list.append(sentence.text)
        return dumps(sentences_list)
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing" }})

# ------------------------------------------------------------------------------------------------------
# parce.xml generation service
@app.route('/ken/api/v1.0/en/file/parcexml', methods=['POST'])
def parcexml_Generator():
    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        file.close()
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing"}})

    raw_text_list = []

    for line in raw_text.splitlines(True):
        # if line contains letters
        if re.search(r'[a-z]+', line):
            # remove tabs and insert spaces
            line = re.sub('[\t]', ' ', line)
            # remove multiple spaces
            line = re.sub('\s\s+', ' ', line)
            # remove all numbers
            # line = re.sub(r'\d+','',line)
            # remove leading and ending spaces
            line = line.strip()
            raw_text_list.append(line)
            print('Encluded line: ' + line)
        else:
            print('Excluded line: ' + line)
    yet_raw_text = '\n'.join(raw_text_list)

    sentences_list = []
    # noun_phrases_list = []

    blob = TextBlob(yet_raw_text)
    print('+++++++++++++++')
    print(blob.noun_phrases)
    print('+++++++++++++++')
    
    try:
        nlp = spacy.load('en_core_web_sm')
        # nlp = spacy.load('en_core_web_lg')
        doc = nlp(yet_raw_text)
        print('''
        sentences\t{num_sent}
        '''.format(
            num_sent=len(list(doc.sents)),))
        for sentence in doc.sents:
            # remove \n and insert spaces
            sentence_clean = re.sub('[\n]', ' ', sentence.text)
            # remove multiple spaces
            sentence_clean = line = re.sub('\s\s+', ' ', sentence_clean)
            # remove leading and ending spaces
            sentence_clean = sentence_clean.strip()
            # list creation
            sentences_list.append(sentence_clean)
            # NP shallow parsing
            doc_for_chunks = nlp(sentence_clean)
            for chunk in doc_for_chunks.noun_chunks:
                print(chunk.text, chunk.root.text, chunk.root.dep_, chunk.root.head.text)
            print("-----")
        return dumps({"sentences": sentences_list})
    except KeyError:
        return jsonify({"Error": {"KeyError": "One of the words is missing"}})

# ------------------------------------------------------------------------------------------------------
# Text normalization service
@app.route('/ken/api/v1.0/en/file/clean', methods=['POST'])
def raw_Text_Normalization_From_File():
    try:
        file = request.files['file']
        raw_text = file.read().decode('utf-8')
        file.close()
    except Exception as e:
        s,r = getattr(e, 'message') or str(e), getattr(e, 'message') or repr(e)
        print 's:', s, 'len(s):', len(s)
        print 'r:', r, 'len(r):', len(r)
        return jsonify({"InternalError": 500})
    return text_Normalization(raw_text)


# ------------------------------------------------------------------------------------------------------
# TODO exception handling
# try:
#     f = open('myfile.txt')
#     s = f.readline()
#     i = int(s.strip())
# except IOError as (errno, strerror):
#     print "I/O error({0}): {1}".format(errno, strerror)
# except ValueError:
#     print "Could not convert data to an integer."
# except:
#     print "Unexpected error:", sys.exc_info()[0]
#     raise

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)
