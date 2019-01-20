#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

# libraries for NLP pipeline
from nltk import sent_tokenize
import spacy
from textblob import TextBlob

import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import re, string

# libraries for XML proccessing
import xml.etree.ElementTree as ET

# libraries for JSON proccessing
from json_tricks.np import dumps, loads
# import json

# libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort

# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'doc', 'docx'])
ALLOWED_EXTENSIONS = set(['xml']) 

class XMLResponse(Response):
    default_mimetype = 'application/xml'

app = Flask(__name__)
app.response_class = XMLResponse
"""
Limited the maximum allowed payload to 16 megabytes.
If a larger file is transmitted, Flask will raise an RequestEntityTooLarge exception.
"""
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# TODO Generate new
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

# ------------------------------------------------------------------------------------------------------
# XML load service
# ------------------------------------------------------------------------------------------------------
@app.route('/ken/api/v1.0/en/file/xml/load', methods=['POST'])
def xml_From_File():
    # check if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return abort(400)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        flash('No selected file')
        return abort(400)
    if file and allowed_file(file.filename):
        xml = file.read().decode('cp1251').encode('utf8')
        file.close()
        # print(xml)
        root = ET.fromstring(xml)
        print root.tag
        for child in root:
            print child.tag, child.attrib
            for child_2 in child:
                print child_2.tag, child_2.attrib
        return xml
    file.close()
    return abort(400)
# ------------------------------------------------------------------------------------------------------
# XML load service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
# XML create service
# ------------------------------------------------------------------------------------------------------
@app.route('/ken/api/v1.0/en/file/xml/create', methods=['PUT'])
def xml_Create_File():
    if not request.json:
        return abort(400)

    """
    Example document using the ElementTree
    root = ET.Element("root")
    doc = ET.SubElement(root, "doc")

    ET.SubElement(doc, "field1", name="blah").text = "some value1"
    ET.SubElement(doc, "field2", name="asdfasd").text = "some vlaue2"

    tree = ET.ElementTree(root)
    tree.write("filename.xml")
    """
    root_element = ET.Element("text")
    
    # sentence_element = ET.SubElement(root_element, "sentence")
    # item_element = ET.SubElement(sentence_element, "item")
    # word_element = ET.SubElement(item_element, "word")
    # lemma_element = ET.SubElement(item_element, "lemma")
    # speech_element = ET.SubElement(item_element, "speech")

    # word_element.text = 'book'
    # lemma_element.text = 'book'
    # speech_element.text = 'S1'

    bks = ["book1", "book2", "book3"]
    for bk in bks:
        new_sentence_element = ET.Element('sentence')
        # create and append title
        new_item_element = ET.Element('item')
        ET.SubElement(new_item_element, "word").text = bk
        new_sentence_element.append(new_item_element)
        # append to the bookstore
        root_element.append(new_sentence_element)
    return ET.tostring(root_element, encoding='utf8', method='xml')
# ------------------------------------------------------------------------------------------------------
# XML create service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
# Sentence segmentation service
# ------------------------------------------------------------------------------------------------------
# def text_normalization(raw_text):
    # normal_text_list = []
    # for line in raw_text.splitlines(True):
    #     # if line contains letters
    #     if re.search(r'[a-z]+', line):
    #         # remove tabs and insert spaces
    #         line = re.sub('[\t]', ' ', line)
    #         # remove multiple spaces
    #         line = re.sub('\s\s+', ' ', line)
    #         # remove all numbers
    #         # line = re.sub(r'\d+','',line)
    #         # remove leading and ending spaces
    #         line = line.strip()
    #         normal_text_list.append(line)
    #         print('Encluded line: ' + line)
    #     else:
    #         print('Excluded line: ' + line)
    # normal_text = '\n'.join(normal_text_list)
    # return normal_text

# @app.route('/ken/api/v1.0/en/file/sentences/<string:lib_name>', methods=['POST'])
# def file_Sentence_Segmentation(lib_name):
#     if lib_name == "nltk":
#         return file_Sentence_Segmentation_NLTK()
#     if lib_name == "spacy":
#         return file_Sentence_Segmentation_SpaCy()

# def file_Sentence_Segmentation_NLTK():
#     try:
#         file = request.files['file']
#         raw_text = file.read().decode('utf-8')
#         file.close()
#         sentences = sent_tokenize(raw_text)
#         for sentence in sentences:
#             print(sentence + "\n")
#         return sentences[0]
#     except KeyError:
#         return jsonify({"Error": {"KeyError": "One of the words is missing" }})

# def file_Sentence_Segmentation_SpaCy():
#     sentences_list = []
#     try:
#         file = request.files['file']
#         raw_text = file.read().decode('utf-8')
#         file.close()
#         nlp = spacy.load('en_core_web_sm')
#         # nlp = spacy.load('en_core_web_lg')
#         doc = nlp(raw_text)
#         print('''
#         sentences\t{num_sent}
#         '''.format(
#         num_sent=len(list(doc.sents)),))
#         for sentence in doc.sents:
#             print("-------")
#             print(sentence)
#             sentences_list.append(sentence.text)
#         return dumps(sentences_list)
#     except KeyError:
#         return jsonify({"Error": {"KeyError": "One of the words is missing" }})
# ------------------------------------------------------------------------------------------------------
# Sentence segmentation service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = 8000)