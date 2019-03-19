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
# tempfile for temporary dir creation
import sys, os, tempfile

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

# for pdf processing pdfminer
from io import BytesIO
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage

# libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort
from werkzeug.utils import secure_filename

# for docx processing
import zipfile
WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
PARA = WORD_NAMESPACE + 'p'
TEXT = WORD_NAMESPACE + 't'

# ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'doc', 'docx'])
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'docx']) 

# Load globally spaCy model via package name
NLP_EN = spacy.load('en_core_web_sm')
# or
# NLP_en_lg = spacy.load('en_core_web_lg')

class XMLResponse(Response):
    default_mimetype = 'application/xml'

app = Flask(__name__)
app.response_class = XMLResponse
"""
Limited the maximum allowed payload to 16 megabytes.
If a larger file is transmitted, Flask will raise an RequestEntityTooLarge exception.
"""
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

"""
Set the secret key to some random bytes. Keep this really secret!
How to generate good secret keys.
A secret key should be as random as possible. Your operating system has ways to generate pretty random data based on a cryptographic random generator. Use the following command to quickly generate a value for Flask.secret_key (or SECRET_KEY):
$ python -c 'import os; print(os.urandom(16))'
b'_5#y2L"F4Q8z\n\xec]/'
"""
# app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.secret_key = os.urandom(42)

"""
# ------------------------------------------------------------------------------------------------------
# secondary functions
# ------------------------------------------------------------------------------------------------------
# """

# function that check if an extension is valid
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# default text normalization
def text_normalization_default(raw_text):
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
            # TODO Remove debug log in production release
            print('Included line: ' + line)
        else:
            # TODO Remove debug log in production release
            print('Excluded line: ' + line)
    yet_raw_text = '\n'.join(raw_text_list)
    return yet_raw_text

# default sentence normalization
def sentence_normalization_default(raw_sentence):
    # remove tabs and insert spaces
    raw_sentence = re.sub('[\t]', ' ', raw_sentence)
    # remove multiple spaces
    raw_sentence = re.sub('\s\s+', ' ', raw_sentence)
    # remove all numbers
    # line = re.sub(r'\d+','',line)
    # remove leading and ending spaces
    raw_sentence = raw_sentence.strip()
    normalized_sentence = raw_sentence
    return normalized_sentence

# sentence spelling TextBlob
def sentence_spelling(unchecked_sentence):
    blob = TextBlob(unchecked_sentence)
    checked_sentence = str(blob.correct()).decode('utf-8')
    return checked_sentence

# Extracting all the text from PDF with PDFMiner
def get_text_from_pdf_pdfminer(pdf_path):
    resource_manager = PDFResourceManager()
    retstr = BytesIO()
    device = TextConverter(resource_manager, retstr)
    page_interpreter = PDFPageInterpreter(resource_manager, device)
    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            page_interpreter.process_page(page)
        text = retstr.getvalue()
    # close open handles
    fh.close()
    device.close()
    retstr.close()
    if text:
        return text

# Extracting all the text from DOCX
def get_text_from_docx(docx_path):
    """
    Take the path of a docx file as argument, return the text in unicode.
    """
    document = zipfile.ZipFile(docx_path)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = ET.XML(xml_content)
    paragraphs = []
    for paragraph in tree.getiterator(PARA):
        texts = [node.text
                 for node in paragraph.getiterator(TEXT)
                 if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n\n'.join(paragraphs)

"""
# ------------------------------------------------------------------------------------------------------
# secondary functions
# ------------------------------------------------------------------------------------------------------
# """

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
        # TODO doc/docx processing
        # pdf processing
        if file.filename.rsplit('.', 1)[1].lower() == 'pdf':
            pdf_file = secure_filename(file.filename)
            destination = "/".join([tempfile.mkdtemp(),pdf_file])
            file.save(destination)
            file.close()
            if os.path.isfile(destination):
                raw_text = get_text_from_pdf_pdfminer(destination).decode('utf-8')
        # docx processing
        if file.filename.rsplit('.', 1)[1].lower() == 'docx':
            docx_file = secure_filename(file.filename)
            destination = "/".join([tempfile.mkdtemp(),docx_file])
            file.save(destination)
            file.close()
            if os.path.isfile(destination):
                raw_text = get_text_from_docx(destination)
        # txt processing
        if file.filename.rsplit('.', 1)[1].lower() == 'txt':
            raw_text = file.read().decode('utf-8')
            file.close()

        # POS UD
        # https://universaldependencies.org/u/pos/
        if (request.args.get('pos', None) == 'ud') or (request.args.get('pos', None) == None):
            speech_dict_POS_tags = {'NOUN':'S1', 'ADJ':'S2', 'VERB': 'S4', 'INTJ':'S21', 'PUNCT':'98', 'SYM':'98', 'CONJ':'U', 'NUM':'S7', 'X':'99', 'PRON':'S11', 'ADP':'P', 'PROPN':'S22', 'ADV':'S16', 'AUX':'99', 'CCONJ':'U', 'DET':'99', 'PART':'99', 'SCONJ':'U', 'SPACE':'98'}

        # TODO Correctly relate the parts of speech with spaCy
        # POS spaCy
        if request.args.get('pos', None) == 'spacy':
            speech_dict_POS_tags = {'NOUN':'S1', 'ADJ':'S2', 'VERB': 'S4', 'INTJ':'S21', 'PUNCT':'98', 'SYM':'98', 'CONJ':'U', 'NUM':'S7', 'X':'S29', 'PRON':'S10', 'ADP':'P', 'PROPN':'S22', 'ADV':'S16', 'AUX':'AUX', 'CCONJ':'CCONJ', 'DET':'DET', 'PART':'PART', 'SCONJ':'SCONJ', 'SPACE':'SPACE'}

        try:
            # default sentence normalization + spaCy doc init
            doc = NLP_EN(text_normalization_default(raw_text))

            # TODO Remove debug log in production release
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

                # default sentence normalization
                sentence_clean = sentence_normalization_default(sentence.text)

                # spelling Correction with TextBlob
                if request.args.get('spell', None) != None:
                    sentence_clean = sentence_spelling(sentence_clean)

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
                doc_for_lemmas = NLP_EN(sentence_clean)
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
                    if (request.args.get('pos', None) == 'ud') or (request.args.get('pos', None) == None):
                        new_speech_element.text = speech_dict_POS_tags[lemma.pos_]
                    # relate the spaCy parts of speech with konspekt tags
                    if request.args.get('pos', None) == 'spacy':
                        new_speech_element.text = speech_dict_POS_tags[lemma.tag_]
                    new_item_element.append(new_speech_element)
                    # create and append <pos>
                    new_pos_element = ET.Element('pos')
                    new_pos_element.text = str(lemma.idx+1)
                    new_item_element.append(new_pos_element)

                    # create and append <relate> and <rel_type>
                    new_rel_type_element = ET.Element('rel_type')
                    new_relate_element = ET.Element('relate')
                    if lemma.dep_ == 'punct':
                        new_rel_type_element.text = 'K0'
                        new_relate_element.text = '0'
                        new_item_element.append(new_rel_type_element)
                        new_item_element.append(new_relate_element)
                    else:
                        new_rel_type_element.text = lemma.dep_
                        new_item_element.append(new_rel_type_element)
                        new_relate_element.text = str(lemma.head.i)
                        new_item_element.append(new_relate_element)

                    new_sentence_element.append(new_item_element)

                # create full <parce.xml> file structure
                root_element.append(new_sentence_element)

                # NP shallow parsing
                doc_for_chunks = NLP_EN(sentence_clean)
                for chunk in doc_for_chunks.noun_chunks:
                    print(chunk.text, chunk.root.text, chunk.root.dep_, chunk.root.head.text)
                print("-----")
            # TODO Remove debug log in production release
            print ET.tostring(root_element, encoding='utf8', method='xml')
            return ET.tostring(root_element, encoding='utf8', method='xml')
        except:
            print "Unexpected error:", sys.exc_info()
            return abort(500)
    file.close()
    return abort(400)
"""
# ------------------------------------------------------------------------------------------------------
# <parce>.xml generation service
# ------------------------------------------------------------------------------------------------------
# """

"""
# ------------------------------------------------------------------------------------------------------
# Get terms list service
# ------------------------------------------------------------------------------------------------------
# """
@app.route('/ken/api/v1.0/en/file/gettermslist', methods=['POST'])
def get_terms_list():
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
        # TODO doc/docx processing
        # pdf processing
        if file.filename.rsplit('.', 1)[1].lower() == 'pdf':
            pdf_file = secure_filename(file.filename)
            destination = "/".join([tempfile.mkdtemp(),pdf_file])
            file.save(destination)
            file.close()
            if os.path.isfile(destination):
                raw_text = get_text_from_pdf_pdfminer(destination).decode('utf-8')
        # docx processing
        if file.filename.rsplit('.', 1)[1].lower() == 'docx':
            docx_file = secure_filename(file.filename)
            destination = "/".join([tempfile.mkdtemp(),docx_file])
            file.save(destination)
            file.close()
            if os.path.isfile(destination):
                raw_text = get_text_from_docx(destination)
        # txt processing
        if file.filename.rsplit('.', 1)[1].lower() == 'txt':
            raw_text = file.read().decode('utf-8')
            file.close()
        try:
            # default sentence normalization + spaCy doc init
            doc = NLP_EN(text_normalization_default(raw_text))

            noun_chunks = []

            for sentence in doc.sents:
                # default sentence normalization
                sentence_clean = sentence_normalization_default(sentence.text)
                # NP shallow parsing
                doc_for_chunks = NLP_EN(sentence_clean)
                for chunk in doc_for_chunks.noun_chunks:
                    noun_chunks.append(chunk.text)
            return '\n'.join(noun_chunks)
        except:
            print "Unexpected error:", sys.exc_info()
            return abort(500)
    file.close()
    return abort(400)
"""
# ------------------------------------------------------------------------------------------------------
# Get terms list service
# ------------------------------------------------------------------------------------------------------
# """


""" 
# ------------------------------------------------------------------------------------------------------
# FEATURE LIST
# ------------------------------------------------------------------------------------------------------
TODO exception handling in a good way

Done in production on Linux with uWSGI, Nginx, Docker

TODO Languagetool in a separate container for spelling correction

TODO in production on Windows
# ------------------------------------------------------------------------------------------------------
"""

if __name__ == '__main__':
    # default port = 5000
    app.run(host = '0.0.0.0')
    # app.run(host = '127.0.0.1', port = 8000)
