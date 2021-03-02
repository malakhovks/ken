#!/usr/bin/env python3
# -*- encoding: utf-8 -*-

import os
import tempfile

# load libraries for pdf processing pdfminer
from io import StringIO, BytesIO
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser

from pdfminer.high_level import extract_text

from PyPDF2 import PdfFileWriter, PdfFileReader

from chardet.universaldetector import UniversalDetector
import chardet

import codecs
import logging
# logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

import re, string

# libraries for API proccessing
from flask import Flask, jsonify, flash, request, Response, redirect, url_for, abort
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['pdf']) 

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

# Extracting all the text from PDF with PDFMiner.six
def get_text_from_pdf(pdf_path):
    rsrcmgr = PDFResourceManager()
    codec = "windows-1251"
    laparams = LAParams()
    # save document layout including spaces that are only visual not a character
    """
    Some pdfs mark the entire text as figure and by default PDFMiner doesn't try to perform layout analysis for figure text. To override this behavior the all_texts parameter needs to be set to True
    """
    laparams = LAParams()
    setattr(laparams, 'all_texts', True)
    # save document layout including spaces that are only visual not a character
    with BytesIO() as retstr:
        with TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams) as device:
            with open(pdf_path, 'rb') as fp:
                interpreter = PDFPageInterpreter(rsrcmgr, device)
                password = ""
                maxpages = 0
                caching = True
                pagenos = set()
                for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching, check_extractable=True):
                    interpreter.process_page(page)
        return retstr.getvalue()

# ------------------------------------------------------------------------------------------------------
# PDF extract service
# ------------------------------------------------------------------------------------------------------
@app.route('/pdf/pdfminersix/extract', methods=['POST'])
def text_from_pdf_pdfminer():
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
            text = get_text_from_pdf(destination)
            detector = UniversalDetector()
            for line in text.splitlines(True):
                detector.feed(line)
                if detector.done: break
            detector.close()
            print(detector.result['encoding'])
            return text
    file.close()
    return abort(400)

@app.route('/pdf/pdfminersix/extract2', methods=['POST'])
def text_from_pdf_pdfminer2():
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
            return extract_text(destination)
    file.close()
    return abort(400)
# ------------------------------------------------------------------------------------------------------
# PDF extract service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '0.0.0.0')