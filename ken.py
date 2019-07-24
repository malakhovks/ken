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
# load tempfile for temporary dir creation
import sys, os, tempfile

# for displacy
import json

# load libraries for NLP pipeline
import spacy
# load Visualizers 
from spacy import displacy
from textblob import TextBlob
# load SnowballStemmer stemmer from nltk
from nltk.stem.snowball import SnowballStemmer
# load python wrapper language_check for LanguageTool grammar checker
# import language_check

# load misc utils
import pickle
import codecs
import logging
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.ERROR)

# load libraries for string proccessing
import re, string

"""
https://effbot.org/zone/celementtree.htm

It is the same library (same API, same features) but ElementTree is implemented in Python and cElementTree is implemented in C.
If you can, use the C implementation because it is optimized for fast parsing and low memory use, and is 15-20 times faster than the Python implementation.
Use the Python version if you are in a limited environment (C library loading not allowed).
"""
import xml.etree.cElementTree as ET

# load libraries for XML proccessing
# import xml.etree.ElementTree as ET

# load libraries for pdf processing pdfminer
from io import BytesIO
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.layout import LAParams

# load libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort, render_template
# A Flask extension for handling Cross Origin Resource Sharing (CORS), making cross-origin AJAX possible.
from flask_cors import CORS
from werkzeug.utils import secure_filename

# load libraries for docx processing
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

# Load globally english SnowballStemmer
ENGLISH_STEMMER = SnowballStemmer("english")

class XMLResponse(Response):
    default_mimetype = 'application/xml'

app = Flask(__name__)
CORS(app)
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
# DEBUG functions
# ------------------------------------------------------------------------------------------------------
# """

# https://habr.com/ru/post/427909/
# Measure the Real Size of Any Python Object
# https://goshippo.com/blog/measure-real-size-any-python-object/
def get_size(obj, seen=None):
    """Recursively finds size of objects"""
    size = sys.getsizeof(obj)
    if seen is None:
        seen = set()
    obj_id = id(obj)
    if obj_id in seen:
        return 0
    # Important mark as seen *before* entering recursion to gracefully handle
    # self-referential objects
    seen.add(obj_id)
    if isinstance(obj, dict):
        size += sum([get_size(v, seen) for v in obj.values()])
        size += sum([get_size(k, seen) for k in obj.keys()])
    elif hasattr(obj, '__dict__'):
        size += get_size(obj.__dict__, seen)
    elif hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes, bytearray)):
        size += sum([get_size(i, seen) for i in obj])
    return size

"""
# ------------------------------------------------------------------------------------------------------
# DEBUG functions
# ------------------------------------------------------------------------------------------------------
# """
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
            """
            remove \n \r \r\n new lines and insert spaces
            \r = CR (Carriage Return) → Used as a new line character in Mac OS before X
            \n = LF (Line Feed) → Used as a new line character in Unix/Mac OS X
            \r\n = CR + LF → Used as a new line character in Windows
            """
            """
            \W pattern: When the LOCALE and UNICODE flags are not specified, matches any non-alphanumeric character;
            this is equivalent to the set [^a-zA-Z0-9_]. With LOCALE, it will match any character not in the set [0-9_], and not defined as alphanumeric for the current locale.
            If UNICODE is set, this will match anything other than [0-9_] plus characters classified as not alphanumeric in the Unicode character properties database.
            To remove all the non-word characters, the \W pattern can be used as follows:
            """
            # line = re.sub(r'\W', ' ', line, flags=re.I)
            # remove all non-words except punctuation
            # line = re.sub('[^\w.,;!?-]', ' ', line)
            # remove all words which contains number
            line = re.sub(r'\w*\d\w*', ' ', line)
            # remove ° symbol
            line = re.sub('[°]', ' ', line)
            line = re.sub('[\n]', ' ', line)
            line = re.sub('[\r\n]', ' ', line)
            line = re.sub('[\r]', ' ', line)
            # remove tabs and insert spaces
            line = re.sub('[\t]', ' ', line)
            # remove multiple spaces
            line = re.sub('\s\s+', ' ', line)
            # remove all numbers
            # line = re.sub(r'\d+','',line)
            # remove leading and ending spaces
            line = line.strip()
            raw_text_list.append(line)
            # logging.debug('Included line: ' + line)
        else:
            # TODO Remove debug log in production release
            # print('Excluded line: ' + line)
            logging.debug('Excluded line: ' + line)
    # yet_raw_text = '\n'.join(raw_text_list)
    yet_raw_text = ' '.join(raw_text_list)
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
    # save document layout including spaces that are only visual not a character
    """
    Some pdfs mark the entire text as figure and by default PDFMiner doesn't try to perform layout analysis for figure text. To override this behavior the all_texts parameter needs to be set to True
    """
    laparams = LAParams()
    setattr(laparams, 'all_texts', True)
    # save document layout including spaces that are only visual not a character
    device = TextConverter(resource_manager, retstr, laparams=laparams)
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
# secondary functions
# ------------------------------------------------------------------------------------------------------
# """

@app.route('/')
def index():  
    return Response(render_template('index.html'), mimetype='text/html')

@app.route('/help')
def gethelp():  
    return Response(render_template('help.html'), mimetype='text/html')

"""
# parce.xml service
# ------------------------------------------------------------------------------------------------------
# """
@app.route('/ken/api/en/file/parcexml', methods=['POST'])
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
        # pdf processing
        if file.filename.rsplit('.', 1)[1].lower() == 'pdf':
            pdf_file = secure_filename(file.filename)
            destination = "/".join([tempfile.mkdtemp(),pdf_file])
            file.save(destination)
            file.close()
            if os.path.isfile(destination):
                raw_text = get_text_from_pdf_pdfminer(destination).decode('utf-8', errors='replace')
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
            # decode the file as UTF-8 ignoring any errors
            raw_text = file.read().decode('utf-8', errors='replace')
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

            text_normalized = text_normalization_default(raw_text)

            # spelling correction with language_check - Python wrapper for LanguageTool
            # if request.args.get('spell', None) != None:
            #     lt = language_check.LanguageTool('en-US')
            #     matches = lt.check(text_normalized)
            #     text_normalized = language_check.correct(text_normalized, matches)

            # default sentence normalization + spaCy doc init
            doc = NLP_EN(text_normalized)
            # Measure the Size of doc Python Object
            logging.info("%s byte", get_size(doc))

            """
            # create the <parce.xml> file structure
            """
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

                doc_for_lemmas = NLP_EN(sentence_clean)
                # Measure the Size of doc_for_lemmas Python Object
                logging.info("%s byte", get_size(doc_for_lemmas))

                # create amd append <ner>, <entity>
                # NER labels description https://spacy.io/api/annotation#named-entities
                if len(doc_for_lemmas.ents) != 0:
                    # create <ner>
                    ner_element = ET.Element('ner')
                    for ent in doc_for_lemmas.ents:
                        # create <entity>
                        new_entity_element = ET.Element('entity')
                        # create and append <entitytext>
                        new_entity_text_element = ET.Element('entitytext')
                        new_entity_text_element.text = ent.text
                        new_entity_element.append(new_entity_text_element)
                        # create and append <label>
                        new_entity_label_element = ET.Element('label')
                        new_entity_label_element.text = ent.label_
                        new_entity_element.append(new_entity_label_element)
                        # create and append <startentitypos>
                        new_start_entity_pos_character_element = ET.Element('startentityposcharacter')
                        new_start_entity_pos_token_element = ET.Element('startentitypostoken')
                        new_start_entity_pos_character_element.text = str(ent.start_char + 1)
                        new_start_entity_pos_token_element.text = str(ent.start + 1)
                        new_entity_element.append(new_start_entity_pos_character_element)
                        new_entity_element.append(new_start_entity_pos_token_element)
                        # create and append <endentitypos>
                        new_end_entity_pos_character_element = ET.Element('endentityposcharacter')
                        new_end_entity_pos_token_element = ET.Element('endentitypostoken')
                        new_end_entity_pos_character_element.text = str(ent.end_char)
                        new_end_entity_pos_token_element.text = str(ent.end)
                        new_entity_element.append(new_end_entity_pos_character_element)
                        new_entity_element.append(new_end_entity_pos_token_element)
                        # append <entity> to <ner>
                        ner_element.append(new_entity_element)
                    # append <ner> to <sentence>
                    new_sentence_element.append(ner_element)

                # create and append <item>, <word>, <lemma>, <number>, <pos>, <speech>
                # doc_for_lemmas = NLP_EN(sentence_clean)
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
                        new_relate_element.text = str(lemma.head.i+1)
                        new_item_element.append(new_relate_element)

                    # create and append <group_n>
                    new_group_n_element = ET.Element('group_n')
                    new_group_n_element.text = '1'
                    new_item_element.append(new_group_n_element)

                    new_sentence_element.append(new_item_element)

                # create full <parce.xml> file structure
                root_element.append(new_sentence_element)
            return ET.tostring(root_element, encoding='utf8', method='xml')
        except Exception as e:
            logging.error(e, exc_info=True)
            return abort(500)
    file.close()
    return abort(400)
"""
# parce.xml service
# ------------------------------------------------------------------------------------------------------
# """

"""
# allterms.xml service
# ------------------------------------------------------------------------------------------------------
# """
@app.route('/ken/api/en/file/allterms', methods=['POST'])
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
                raw_text = get_text_from_pdf_pdfminer(destination).decode('utf-8', errors='replace')
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
            # decode the file as UTF-8 ignoring any errors
            raw_text = file.read().decode('utf-8', errors='replace')
            file.close()
        try:
            # spaCy doc init + default sentence normalization
            doc = NLP_EN(text_normalization_default(raw_text))
            # Measure the Size of doc Python Object
            logging.info("%s byte", get_size(doc))

            """
            # create the <allterms.xml> file structure
            """
            # create root element <termsintext>
            root_termsintext_element = ET.Element("termsintext")
            # create element <sentences>
            sentences_element = ET.Element("sentences")
            # create element <filepath>
            filepath_element = ET.Element("filepath")
            filepath_element.text = file.filename
            # create element <exporterms>
            exporterms_element = ET.Element("exporterms")
            # sentence counter
            sentence_index = 0

            # Helper list for one-word terms
            one_word_terms_help_list = []
            # Helper list for two-word terms
            two_word_terms_help_list = []
            # Helper list for multiple-word terms (from 4-word terms)
            multiple_word_terms_help_list = []

            noun_chunks = []

            '''
            # Main text parsing cycle for sentences
            '''
            for sentence in doc.sents:

                sentence_index+=1

                # default sentence normalization
                sentence_clean = sentence_normalization_default(sentence.text)
                # create and append <sent>
                new_sent_element = ET.Element('sent')
                new_sent_element.text = sentence_clean #.encode('ascii', 'ignore') errors='replace'
                sentences_element.append(new_sent_element)

                """
                NP shallow parsing 
                Noun chunks are "base noun phrases" – flat phrases that have a noun as their head. You can think of noun chunks as a noun plus the words describing the noun – for example, “the lavish green grass” or “the world’s largest tech fund”.
                https://spacy.io/usage/linguistic-features/#dependency-parse
                """

                # for processing specific sentence
                doc_for_chunks = NLP_EN(sentence_clean)
                # Measure the Size of doc_for_chunks Python Object
                logging.info("%s byte", get_size(doc_for_chunks))

                # sentence NP shallow parsing cycle
                for chunk in doc_for_chunks.noun_chunks:

                    doc_for_tokens = NLP_EN(chunk.text)
                    # Measure the Size of doc_for_tokens Python Object
                    logging.info("%s byte", get_size(doc_for_tokens))

                    '''
                    # EXTRACT ONE-WORD TERMS ----------------------------------------------------------------------
                    '''
                    if len(doc_for_tokens) == 1:

                        if doc_for_tokens[0].pos_ in ['NOUN', 'PROPN']:

                            if doc_for_tokens[0].lemma_ in one_word_terms_help_list:
                                for term in exporterms_element.findall('term'):
                                    if term.find('tname').text == doc_for_tokens[0].lemma_:
                                        new_sentpos_element = ET.Element('sentpos')
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                        term.append(new_sentpos_element)

                            if doc_for_tokens[0].lemma_ not in one_word_terms_help_list:

                                one_word_terms_help_list.append(doc_for_tokens[0].lemma_)
                                # create and append <wcount>
                                new_wcount_element = ET.Element('wcount')
                                new_wcount_element.text = '1'
                                # create and append <ttype>
                                new_ttype_element = ET.Element('ttype')
                                new_ttype_element.text = doc_for_tokens[0].pos_
                                # create <term>
                                new_term_element = ET.Element('term')
                                # create and append <tname>
                                new_tname_element = ET.Element('tname')
                                new_tname_element.text = doc_for_tokens[0].lemma_
                                # create and append <osn>
                                new_osn_element = ET.Element('osn')
                                new_osn_element.text = ENGLISH_STEMMER.stem(doc_for_tokens[0].text)

                                # create and append <sentpos>
                                new_sentpos_element = ET.Element('sentpos')
                                new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                new_term_element.append(new_sentpos_element)

                                # append to <term>
                                new_term_element.append(new_ttype_element)
                                new_term_element.append(new_tname_element)
                                new_term_element.append(new_osn_element)
                                new_term_element.append(new_wcount_element)

                                # append to <exporterms>
                                exporterms_element.append(new_term_element)

                    if len(doc_for_tokens) == 2:

                        '''
                        # Extract one-word terms from 2-words statements (excluding articles DET)
                        '''
                        if doc_for_tokens[0].pos_ in ['DET', 'PUNCT']:

                            if doc_for_tokens[1].lemma_ in one_word_terms_help_list:
                                for term in exporterms_element.findall('term'):
                                    if term.find('tname').text == doc_for_tokens[1].lemma_:
                                        new_sentpos_element = ET.Element('sentpos')
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+2)
                                        term.append(new_sentpos_element)

                            if doc_for_tokens[1].lemma_ not in one_word_terms_help_list:

                                one_word_terms_help_list.append(doc_for_tokens[1].lemma_)
                                # create and append <wcount>
                                new_wcount_element = ET.Element('wcount')
                                new_wcount_element.text = '1'
                                # create and append <ttype>
                                new_ttype_element = ET.Element('ttype')
                                new_ttype_element.text = doc_for_tokens[1].pos_
                                # create <term>
                                new_term_element = ET.Element('term')
                                # create and append <tname>
                                new_tname_element = ET.Element('tname')
                                new_tname_element.text = doc_for_tokens[1].lemma_
                                # create and append <osn>
                                new_osn_element = ET.Element('osn')
                                new_osn_element.text = ENGLISH_STEMMER.stem(doc_for_tokens[1].text)

                                # create and append <sentpos>
                                new_sentpos_element = ET.Element('sentpos')
                                new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+2)
                                new_term_element.append(new_sentpos_element)

                                # append to <term>
                                new_term_element.append(new_ttype_element)
                                new_term_element.append(new_tname_element)
                                new_term_element.append(new_osn_element)
                                new_term_element.append(new_wcount_element)

                                # append to <exporterms>
                                exporterms_element.append(new_term_element)

                        '''
                        # EXTRACT TWO-WORD TERMS ---------------------------------------------------------------
                        '''
                        if doc_for_tokens[0].pos_ not in ['DET', 'PUNCT']:

                            # print('two-word term lemma ---> ' + chunk.lemma_ +' POS[0]:'+ doc_for_tokens[0].pos_ + ' POS[0]:'+ doc_for_tokens[0].tag_ + ' HEAD[0]:' + doc_for_tokens[0].head.lower_ +' POS[1]:' + doc_for_tokens[1].pos_ + ' POS[1]:'+ doc_for_tokens[1].tag_ + ' HEAD[1]:' + doc_for_tokens[1].head.lower_)

                            # print('--------------------')

                            # If two-word term already exists in two_word_terms_help_list
                            # if chunk.lower_ in two_word_terms_help_list:
                            if chunk.lemma_ in two_word_terms_help_list:

                                # add new <sentpos> for existing two-word term
                                for term in exporterms_element.findall('term'):
                                    # if term.find('tname').text == chunk.lower_:
                                    if term.find('tname').text == chunk.lemma_:
                                        new_sentpos_element = ET.Element('sentpos')
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                        term.append(new_sentpos_element)

                                # Check If root (root of Noun chunks always is a NOUN) of the two-word term
                                # already exists in one_word_terms_help_list
                                if chunk.root.lemma_ in one_word_terms_help_list:

                                    relup_index = 0
                                    reldown_index = 0
                                    sent_pos_helper = []

                                    for one_term in exporterms_element.findall('term'):
                                        relup_index+=1
                                        if one_term.find('tname').text == chunk.root.lemma_:

                                            for sent_pos in one_term.findall('sentpos'):
                                                sent_pos_helper.append(sent_pos.text)

                                            # create and append new <sentpos>
                                            # check if new <sentpos> already exist, if no then add new <sentpos>
                                            if chunk.root.lower_ == doc_for_tokens[0].lower_:
                                                if (str(sentence_index) + '/' + str(chunk.start+1)) not in sent_pos_helper:
                                                    new_sentpos_element = ET.Element('sentpos')
                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                                    one_term.append(new_sentpos_element)
                                            else:
                                                if (str(sentence_index) + '/' + str(chunk.start+2)) not in sent_pos_helper:
                                                    new_sentpos_element = ET.Element('sentpos')
                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+2)
                                                    one_term.append(new_sentpos_element)

                                # Check If child of the root (Child not always be a NOUN, so not always be a term) of the two-word term
                                # already exists in one_word_terms_help_list
                                for t in doc_for_tokens:
                                        if t.lemma_ != chunk.root.lemma_:
                                            # if child of the root is NOUN, so it is a term
                                            if t.pos_ in ['NOUN']:
                                                if t.lemma_ in one_word_terms_help_list:

                                                    relup_index = 0
                                                    reldown_index = 0
                                                    sent_pos_helper = []
                                                    if t.i == 0:
                                                        index_helper = chunk.start+1
                                                    else:
                                                        index_helper = chunk.start+2

                                                    for one_term in exporterms_element.findall('term'):
                                                        relup_index+=1
                                                        if one_term.find('tname').text == t.lemma_:

                                                            for sent_pos in one_term.findall('sentpos'):
                                                                sent_pos_helper.append(sent_pos.text)

                                                            if (str(sentence_index) + '/' + str(index_helper)) not in sent_pos_helper:
                                                                    new_sentpos_element = ET.Element('sentpos')
                                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(index_helper)
                                                                    one_term.append(new_sentpos_element)


                            # If two-word term not exists in two_word_terms_help_list
                            if chunk.lemma_ not in two_word_terms_help_list:

                                # update two_word_terms_help_list with the new two-word term
                                # two_word_terms_help_list.append(chunk.lower_)
                                two_word_terms_help_list.append(chunk.lemma_)

                                # create and append <wcount>
                                new_wcount_element = ET.Element('wcount')
                                new_wcount_element.text = '2'
                                # create and append <ttype>
                                new_ttype_element = ET.Element('ttype')
                                new_ttype_element.text = doc_for_tokens[0].pos_ + '_' + doc_for_tokens[1].pos_
                                # create <term>
                                new_term_element = ET.Element('term')
                                # create and append <tname>
                                new_tname_element = ET.Element('tname')
                                # new_tname_element.text = chunk.lower_
                                new_tname_element.text = chunk.lemma_
                                # create and append <osn>
                                new_osn_element = ET.Element('osn')
                                new_osn_element.text = ENGLISH_STEMMER.stem(doc_for_tokens[0].text)
                                new_term_element.append(new_osn_element)
                                new_osn_element = ET.Element('osn')
                                new_osn_element.text = ENGLISH_STEMMER.stem(doc_for_tokens[1].text)
                                new_term_element.append(new_osn_element)
                                # create and append <sentpos>
                                new_sentpos_element = ET.Element('sentpos')
                                new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                new_term_element.append(new_sentpos_element)

                                # append to <term>
                                new_term_element.append(new_ttype_element)
                                new_term_element.append(new_tname_element)
                                new_term_element.append(new_wcount_element)

                                # append to <exporterms>
                                exporterms_element.append(new_term_element)

                                # Check If root (root of Noun chunks always is a NOUN) of the two-word term
                                # already exists in one_word_terms_help_list
                                # add relup/reldown
                                if chunk.root.lemma_ in one_word_terms_help_list:

                                    relup_index = 0
                                    reldown_index = 0
                                    sent_pos_helper = []

                                    for one_term in exporterms_element.findall('term'):
                                        relup_index+=1
                                        if one_term.find('tname').text == chunk.root.lemma_:

                                            for sent_pos in one_term.findall('sentpos'):
                                                sent_pos_helper.append(sent_pos.text)

                                            if chunk.root.lower_ == doc_for_tokens[0].lower_:
                                                if (str(sentence_index) + '/' + str(chunk.start+1)) not in sent_pos_helper:
                                                    new_sentpos_element = ET.Element('sentpos')
                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                                    one_term.append(new_sentpos_element)
                                            else:
                                                if (str(sentence_index) + '/' + str(chunk.start+2)) not in sent_pos_helper:
                                                    new_sentpos_element = ET.Element('sentpos')
                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+2)
                                                    one_term.append(new_sentpos_element)

                                            for two_term in exporterms_element.findall('term'):
                                                reldown_index+=1
                                                # if two_term.find('tname').text == chunk.lower_:
                                                if two_term.find('tname').text == chunk.lemma_:
                                                    new_relup_element = ET.Element('relup')
                                                    new_relup_element.text = str(relup_index)
                                                    two_term.append(new_relup_element)
                                                    new_reldown_element = ET.Element('reldown')
                                                    new_reldown_element.text = str(reldown_index)
                                                    one_term.append(new_reldown_element)

                                # Check If root NOUN not exists in one_word_terms_help_list
                                # add root NOUN to one_word_terms_help_list
                                # add relup/reldown
                                if chunk.root.lemma_ not in one_word_terms_help_list:

                                    # print('root NOUN not exists in one_word_terms_help_list --->> ' + chunk.root.lemma_)
                                    # print('--------------------')

                                    one_word_terms_help_list.append(chunk.root.lemma_)

                                    # create and append <wcount>
                                    new_wcount_element = ET.Element('wcount')
                                    new_wcount_element.text = '1'
                                    # create and append <ttype>
                                    new_ttype_element = ET.Element('ttype')
                                    new_ttype_element.text = 'NOUN'
                                    # create <term>
                                    new_term_element = ET.Element('term')
                                    # create and append <tname>
                                    new_tname_element = ET.Element('tname')
                                    new_tname_element.text = chunk.root.lemma_
                                    # create and append <osn>
                                    new_osn_element = ET.Element('osn')
                                    new_osn_element.text = ENGLISH_STEMMER.stem(chunk.root.lower_)
                                    # create and append <sentpos>
                                    new_sentpos_element = ET.Element('sentpos')
                                    if chunk.root.lower_ == doc_for_tokens[0].lower_:
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                    else:
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+2)
                                    new_term_element.append(new_sentpos_element)
                                    # append to <term>
                                    new_term_element.append(new_ttype_element)
                                    new_term_element.append(new_tname_element)
                                    new_term_element.append(new_wcount_element)

                                    # append to <exporterms>
                                    exporterms_element.append(new_term_element)

                                    relup_index = 0
                                    reldown_index = 0
                                    for one_term in exporterms_element.findall('term'):
                                        relup_index+=1
                                        if one_term.find('tname').text == chunk.root.lemma_:
                                            for two_term in exporterms_element.findall('term'):
                                                reldown_index+=1
                                                # if two_term.find('tname').text == chunk.lower_:
                                                if two_term.find('tname').text == chunk.lemma_:
                                                    new_relup_element = ET.Element('relup')
                                                    new_relup_element.text = str(relup_index)
                                                    two_term.append(new_relup_element)
                                                    new_reldown_element = ET.Element('reldown')
                                                    new_reldown_element.text = str(reldown_index)
                                                    one_term.append(new_reldown_element)

                                for t in doc_for_tokens:
                                        if t.lemma_ != chunk.root.lemma_:
                                            if t.pos_ in ['NOUN']:

                                                # print('-------->>>>>>' + t.lemma_)

                                                if t.lemma_ in one_word_terms_help_list:

                                                    relup_index = 0
                                                    reldown_index = 0
                                                    sent_pos_helper = []
                                                    if t.i == 0:
                                                        index_helper = chunk.start+1
                                                    else:
                                                        index_helper = chunk.start+2


                                                    for one_term in exporterms_element.findall('term'):
                                                        relup_index+=1
                                                        if one_term.find('tname').text == t.lemma_:
                                                            for two_term in exporterms_element.findall('term'):
                                                                reldown_index+=1
                                                                # if two_term.find('tname').text == chunk.lower_:
                                                                if two_term.find('tname').text == chunk.lemma_:

                                                                    for sent_pos in one_term.findall('sentpos'):
                                                                        sent_pos_helper.append(sent_pos.text)

                                                                    if (str(sentence_index) + '/' + str(index_helper)) not in sent_pos_helper:
                                                                        new_sentpos_element = ET.Element('sentpos')
                                                                        new_sentpos_element.text = str(sentence_index) + '/' + str(index_helper)
                                                                        one_term.append(new_sentpos_element)

                                                                    new_relup_element = ET.Element('relup')
                                                                    new_relup_element.text = str(relup_index)
                                                                    two_term.append(new_relup_element)
                                                                    new_reldown_element = ET.Element('reldown')
                                                                    new_reldown_element.text = str(reldown_index)
                                                                    one_term.append(new_reldown_element)

                                                if t.lemma_ not in one_word_terms_help_list:

                                                    # print('if t.lemma_ not in one_word_terms_help_list ----->>>>>>' + t.lemma_)

                                                    relup_index = 0
                                                    reldown_index = 0
                                                    sent_pos_helper = []

                                                    if t.i == 0:
                                                        index_helper = chunk.start+1
                                                    else:
                                                        index_helper = chunk.start+2

                                                    one_word_terms_help_list.append(t.lemma_)

                                                    # create and append <wcount>
                                                    new_wcount_element = ET.Element('wcount')
                                                    new_wcount_element.text = '1'
                                                    # create and append <ttype>
                                                    new_ttype_element = ET.Element('ttype')
                                                    new_ttype_element.text = 'NOUN'
                                                    # create <term>
                                                    new_term_element = ET.Element('term')
                                                    # create and append <tname>
                                                    new_tname_element = ET.Element('tname')
                                                    new_tname_element.text = t.lemma_
                                                    # create and append <osn>
                                                    new_osn_element = ET.Element('osn')
                                                    new_osn_element.text = ENGLISH_STEMMER.stem(t.lower_)
                                                    # create and append <sentpos>
                                                    new_sentpos_element = ET.Element('sentpos')
                                                    new_sentpos_element.text = str(sentence_index) + '/' + str(index_helper)
                                                    # append to <term>
                                                    new_term_element.append(new_sentpos_element)
                                                    new_term_element.append(new_ttype_element)
                                                    new_term_element.append(new_tname_element)
                                                    new_term_element.append(new_wcount_element)

                                                    # append to <exporterms>
                                                    exporterms_element.append(new_term_element)

                                                    for one_term in exporterms_element.findall('term'):
                                                        relup_index+=1
                                                        if one_term.find('tname').text == t.lemma_:
                                                            for two_term in exporterms_element.findall('term'):
                                                                reldown_index+=1
                                                                # if two_term.find('tname').text == chunk.lower_:
                                                                if two_term.find('tname').text == chunk.lemma_:

                                                                    for sent_pos in one_term.findall('sentpos'):
                                                                        sent_pos_helper.append(sent_pos.text)

                                                                    if (str(sentence_index) + '/' + str(index_helper)) not in sent_pos_helper:
                                                                        new_sentpos_element = ET.Element('sentpos')
                                                                        new_sentpos_element.text = str(sentence_index) + '/' + str(index_helper)
                                                                        one_term.append(new_sentpos_element)

                                                                    new_relup_element = ET.Element('relup')
                                                                    new_relup_element.text = str(relup_index)
                                                                    two_term.append(new_relup_element)
                                                                    new_reldown_element = ET.Element('reldown')
                                                                    new_reldown_element.text = str(reldown_index)
                                                                    one_term.append(new_reldown_element)

                    '''
                    # extract three-word terms
                    '''
                    if len(doc_for_tokens) == 3:

                        logging.debug('three-word term lemma ---> ' + chunk.lemma_ +' POS[0]:'+ doc_for_tokens[0].pos_ + ' POS[1]:' + doc_for_tokens[1].pos_ + ' POS[2]:' + doc_for_tokens[2].pos_)
                        logging.debug('--------------------')

                    if len(doc_for_tokens) > 3:

                        logging.debug('multi-word term lemma ---> ' + chunk.lemma_)
                        logging.debug('--------------------')

                        if doc_for_tokens[0].pos_ not in ['DET', 'PUNCT']:

                            # If multiple-word term already exists in multiple_word_terms_help_list
                            if chunk.lemma_ in multiple_word_terms_help_list:

                                # add new <sentpos> for existing two-word term
                                for term in exporterms_element.findall('term'):
                                    if term.find('tname').text == chunk.lemma_:
                                        new_sentpos_element = ET.Element('sentpos')
                                        new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                        term.append(new_sentpos_element)
                            
                            # If multiple-word term not exists in multiple_word_terms_help_list
                            if chunk.lemma_ not in multiple_word_terms_help_list:
                                # update  multiple_word_terms_help_list with the new multiple-word term
                                multiple_word_terms_help_list.append(chunk.lemma_)

                                # create and append <wcount>
                                new_wcount_element = ET.Element('wcount')
                                new_wcount_element.text = str(len(chunk))
                                # create and append <ttype>
                                multiple_pos_helper = []
                                for multiple_pos in doc_for_tokens:
                                    multiple_pos_helper.append(multiple_pos.pos_)
                                new_ttype_element = ET.Element('ttype')
                                new_ttype_element.text = '_'.join(multiple_pos_helper)
                                # create <term>
                                new_term_element = ET.Element('term')
                                # create and append <tname>
                                new_tname_element = ET.Element('tname')
                                # new_tname_element.text = chunk.lower_
                                new_tname_element.text = chunk.lemma_
                                # create and append <osn>
                                multiple_osn_helper = []
                                for multiple_osn in doc_for_tokens:
                                    new_osn_element = ET.Element('osn')
                                    new_osn_element.text = ENGLISH_STEMMER.stem(multiple_osn.text)
                                    new_term_element.append(new_osn_element)
                                # create and append <sentpos>
                                new_sentpos_element = ET.Element('sentpos')
                                new_sentpos_element.text = str(sentence_index) + '/' + str(chunk.start+1)
                                new_term_element.append(new_sentpos_element)

                                # append to <term>
                                new_term_element.append(new_ttype_element)
                                new_term_element.append(new_tname_element)
                                new_term_element.append(new_wcount_element)

                                # append to <exporterms>
                                exporterms_element.append(new_term_element)

            # create full <allterms.xml> file structure
            root_termsintext_element.append(filepath_element)
            root_termsintext_element.append(exporterms_element)
            root_termsintext_element.append(sentences_element)

            return ET.tostring(root_termsintext_element, encoding='utf8', method='xml')
        except Exception as e:
            logging.error(e, exc_info=True)
            return abort(500)
    file.close()
    return abort(400)
"""
# allterms.xml service
# ------------------------------------------------------------------------------------------------------
# """


"""
# Visualizers service
# ------------------------------------------------------------------------------------------------------
# """

@app.route('/ken/api/en/html/depparse/sentence', methods=['GET'])
def get_dependency_parse():
    # here we want to get the value of user (i.e. ?sentence=some-value)
    sentence = request.args.get('sentence')
    doc = NLP_EN(sentence)
    return Response(displacy.render(doc, style="dep", page=True, minify=True), mimetype='text/html')

# Noun chunks "base noun phrases" deps visualization
@app.route('/ken/api/en/html/depparse/nounchunk', methods=['POST'])
def get_dep_parse():
    rec = json.loads(request.get_data(as_text=True))
    doc = NLP_EN(rec['text'])
    r_t = displacy.parse_deps(doc)
    return Response(json.dumps(r_t), mimetype='text/plain')

# NER in text visualization
@app.route('/ken/api/en/html/ner', methods=['POST'])
def get_ner():
    req_data_JSON = json.loads(request.get_data(as_text=True))
    doc = NLP_EN(' '.join(e for e in req_data_JSON))
    # Measure the Size of doc Python Object
    logging.info("%s byte", get_size(doc))
    # colors = {"ORG": "linear-gradient(90deg, #b0fb5a, #ffffff)"}
    # options = {"colors": colors}
    # html = displacy.render(doc, style="ent", options=options)
    html = displacy.render(doc, style="ent")
    return Response(html, mimetype='text/html')

"""
# Visualizers service
# ------------------------------------------------------------------------------------------------------
# """

if __name__ == '__main__':
    # default port = 5000
    app.run(host = '0.0.0.0')
    # app.run(host = '127.0.0.1', port = 8000)
