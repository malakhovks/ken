#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import os
import tempfile

import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import re, string

# libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort
from werkzeug.utils import secure_filename

# for docx proccessing
from xml.etree.ElementTree import XML
import zipfile
WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
PARA = WORD_NAMESPACE + 'p'
TEXT = WORD_NAMESPACE + 't'

ALLOWED_EXTENSIONS = set(['docx']) 

class XMLResponse(Response):
    default_mimetype = 'application/xml'

app = Flask(__name__)

app.response_class = XMLResponse
"""
Limited the maximum allowed payload to 16 megabytes.
If a larger file is transmitted, Flask will raise an RequestEntityTooLarge exception.
"""
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

app.secret_key = os.urandom(42)

# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------

# function that check if an extension is valid
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_docx_text(path):
    """
    Take the path of a docx file as argument, return the text in unicode.
    """
    document = zipfile.ZipFile(path)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = XML(xml_content)
    paragraphs = []
    for paragraph in tree.getiterator(PARA):
        texts = [node.text
                 for node in paragraph.getiterator(TEXT)
                 if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n\n'.join(paragraphs)

# ------------------------------------------------------------------------------------------------------
# DOCX extract service
# ------------------------------------------------------------------------------------------------------
@app.route('/ken/api/v1.0/en/file/docx/extract', methods=['POST'])
def text_from_docx():
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
        pdf_file = secure_filename(file.filename)
        destination = "/".join([tempfile.mkdtemp(),pdf_file])
        file.save(destination)
        file.close()
        if os.path.isfile(destination):
            return get_docx_text(destination)
    file.close()
    return abort(400)
# ------------------------------------------------------------------------------------------------------
# DOCX extract service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '0.0.0.0')