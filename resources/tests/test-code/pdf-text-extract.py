#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import os
import tempfile

# for pdf processing PyPDF2
from PyPDF2 import PdfFileReader

# for pdf processing pdfminer
from io import BytesIO
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.pdfpage import PDFPage

import codecs
import logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

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

# Extracting all the text with PDFMiner
def extract_text_from_pdf(pdf_path):
    resource_manager = PDFResourceManager()
    fake_file_handle = BytesIO()
    converter = TextConverter(resource_manager, fake_file_handle)
    page_interpreter = PDFPageInterpreter(resource_manager, converter)
    with open(pdf_path, 'rb') as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            page_interpreter.process_page(page)
        text = fake_file_handle.getvalue()
    # close open handles
    converter.close()
    fake_file_handle.close()
    if text:
        return text

# from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
# from pdfminer.converter import TextConverter
# from pdfminer.layout import LAParams
# from pdfminer.pdfpage import PDFPage
# from io import StringIO
# 
# def convert_pdf_to_txt(path):
#     rsrcmgr = PDFResourceManager()
#     retstr = StringIO()
#     codec = 'utf-8'
#     laparams = LAParams()
#     device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
#     fp = open(path, 'rb')
#     interpreter = PDFPageInterpreter(rsrcmgr, device)
#     password = ""
#     maxpages = 0
#     caching = True
#     pagenos=set()

#     for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
#         interpreter.process_page(page)

#     text = retstr.getvalue()

#     fp.close()
#     device.close()
#     retstr.close()
#     return text

# ------------------------------------------------------------------------------------------------------
# PDF extract service
# ------------------------------------------------------------------------------------------------------
@app.route('/ken/api/v1.0/en/file/pdf/pypdf2/extract', methods=['POST'])
def text_from_pdf_pypdf2():
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
            read_pdf = PdfFileReader(destination)
            page = read_pdf.getPage(0)
            text = page.extractText()
            print text
            return text
    file.close()
    return abort(400)

@app.route('/ken/api/v1.0/en/file/pdf/pdfminer/extract', methods=['POST'])
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
            return extract_text_from_pdf(destination)
    file.close()
    return abort(400)
# ------------------------------------------------------------------------------------------------------
# PDF extract service
# ------------------------------------------------------------------------------------------------------

# ------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host = '0.0.0.0')