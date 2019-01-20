#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Solving Unicode Problems in Python 2.7
# ------------------------------------------------------------------------------------------------------
It makes Python 2 behave as Python 3 does when it comes to string literals.
It makes your code cross-Python-version compatible.

# from __future__ import unicode_literals
# ------------------------------------------------------------------------------------------------------
    encode(): Gets you from Unicode -> bytes
    decode(): Gets you from bytes -> Unicode
    codecs.open(encoding=”utf-8″): Read and write files directly to/from Unicode (you can use any encoding, not just utf-8, but utf-8 is most common).
    u”: Makes your string literals into Unicode objects rather than byte sequences.
Warning: Don’t use encode() on bytes or decode() on Unicode objects.
# ------------------------------------------------------------------------------------------------------
"""
import sys

# libraries for NLP pipeline
import spacy
from textblob import TextBlob

import pickle
import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

# libraries for JSON proccessing
import re, string

# libraries for XML proccessing
import xml.etree.ElementTree as ET

# libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort

# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'doc', 'docx'])
ALLOWED_EXTENSIONS = set(['txt']) 

class XMLResponse(Response):
    default_mimetype = 'application/xml'

app = Flask(__name__)
app.response_class = XMLResponse
"""
Limited the maximum allowed payload to 16 megabytes.
If a larger file is transmitted, Flask will raise an RequestEntityTooLarge exception.
"""
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# TODO Generate new secret_key
# TODO Set secret_key via CMD arguments at startup. Using import argparse
"""
Set the secret key to some random bytes. Keep this really secret!
How to generate good secret keys.
A secret key should be as random as possible. Your operating system has ways to generate pretty random data based on a cryptographic random generator. Use the following command to quickly generate a value for Flask.secret_key (or SECRET_KEY):
$ python -c 'import os; print(os.urandom(16))'
b'_5#y2L"F4Q8z\n\xec]/'
"""
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------

# function that check if an extension is valid
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

"""
# ------------------------------------------------------------------------------------------------------
# <parce.xml> generation service
# ------------------------------------------------------------------------------------------------------
# """
@app.route('/ken/api/v1.0/en/file/parcexml', methods=['POST'])
def parcexml_Generator():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return abort(400)

    file = request.files['file']

    # if user does not select file, browser also submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return abort(400)

    if file and allowed_file(file.filename):
        raw_text = file.read().decode('utf-8')
        file.close()

        raw_text_list = []

        # TODO Correctly relate the parts of speech
        # https://universaldependencies.org/u/pos/
        speech_dict_Universal_POS_tags = {'NOUN':'S1', 'ADJ':'S2', 'VERB': 'S4', 'INTJ':'S21', 'PUNCT':'98', 'SYM':'98', 'CONJ':'U', 'NUM':'S7', 'X':'S29', 'PRON':'S10', 'ADP':'P', 'PROPN':'S22', 'ADV':'S16', 'AUX':'AUX', 'CCONJ':'CCONJ', 'DET':'DET', 'PART':'PART', 'SCONJ':'SCONJ', 'SPACE':'SPACE'}

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
                print('Included line: ' + line)
            else:
                print('Excluded line: ' + line)
        yet_raw_text = '\n'.join(raw_text_list)

        sentences_list = []

        # noun_phrases_list = []
        #  TextBlob
        # blob = TextBlob(yet_raw_text)
        # print('+++++++++++++++')
        # print(blob.noun_phrases)
        # print('+++++++++++++++')

        try:
            # Load spaCy model via package name
            nlp = spacy.load('en_core_web_sm')
            # nlp = spacy.load('en_core_web_lg')
            doc = nlp(yet_raw_text)
            print('''
            sentences\t{num_sent}
            '''.format(
                num_sent=len(list(doc.sents)),))

            # create the <parce.xml> file structure
            # create root element <text>
            root_element = ET.Element("text")
            sentence_index = 0

            for sentence in doc.sents:
                sentence_index+=1
                # remove \n and insert spaces
                sentence_clean = re.sub('[\n]', ' ', sentence.text)
                # remove multiple spaces
                sentence_clean = line = re.sub('\s\s+', ' ', sentence_clean)
                # remove leading and ending spaces
                sentence_clean = sentence_clean.strip()

                # XML structure creation
                new_sentence_element = ET.Element('sentence')
                # create and append <sentnumber>
                new_sentnumber_element = ET.Element('sentnumber')
                new_sentnumber_element.text = str(sentence_index)
                new_sentence_element.append(new_sentnumber_element)
                # create and append <sent>
                new_sent_element = ET.Element('sent')
                new_sent_element.text = sentence_clean #.encode('ascii', 'ignore') errors='replace'
                new_sentence_element.append(new_sent_element)

                # create and append <item>, <word>, <lemma>, <number>, <pos>, <speech>
                # TODO optimize for using only 1 nlp
                doc_for_lemmas = nlp(sentence_clean)
                for lemma in doc_for_lemmas:
                # for lemma in sentence:
                    # create and append <item>
                    new_item_element = ET.Element('item')
                    # create and append <word>
                    new_word_element = ET.Element('word')
                    new_word_element.text = lemma.text
                    new_item_element.append(new_word_element)
                    # create and append <lemma>
                    new_lemma_element = ET.Element('lemma')
                    new_lemma_element.text = lemma.lemma_ #.encode('ascii', 'ignore')
                    new_item_element.append(new_lemma_element)
                    # create and append <number>
                    new_number_element = ET.Element('number')
                    new_number_element.text = str(lemma.i+1)
                    new_item_element.append(new_number_element)
                    # create and append <speech>
                    new_speech_element = ET.Element('speech')
                    # relate the universal dependencies parts of speech with konspekt tags
                    new_speech_element.text = speech_dict_Universal_POS_tags[lemma.pos_]
                    new_item_element.append(new_speech_element)
                    # create and append <pos>
                    new_pos_element = ET.Element('pos')
                    new_pos_element.text = str(lemma.idx+1)
                    new_item_element.append(new_pos_element)

                    new_sentence_element.append(new_item_element)
                    print(lemma.text, lemma.lemma_, lemma.i)

                print("-----")

                # create full <parce.xml> file structure
                root_element.append(new_sentence_element)

                # NP shallow parsing
                # doc_for_chunks = nlp(sentence_clean)
                # for chunk in doc_for_chunks.noun_chunks:
                #     print(chunk.text, chunk.root.text, chunk.root.dep_, chunk.root.head.text)
                # print("-----")
            print ET.tostring(root_element, encoding='utf8', method='xml')
            return ET.tostring(root_element, encoding='utf8', method='xml')
        except:
            print "Unexpected error:", sys.exc_info()
            return abort(500)
    file.close()
    return abort(400)

# TODO exception handling in a good way
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

"""
# ------------------------------------------------------------------------------------------------------
# <parce>.xml generation service
# ------------------------------------------------------------------------------------------------------
# """

""" 
# ------------------------------------------------------------------------------------------------------
# FEATURE LIST
# ------------------------------------------------------------------------------------------------------
TODO Ability to customize settings via an external configuration xml-file:
    + host, port, envionment
    + symbols for text normalization

# ------------------------------------------------------------------------------------------------------
"""

if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)
