#!/usr/bin/env bash
# test_data.pdf contains the document you want to post
# -p means to POST it
# -H adds an Auth header (could be Basic or Token)
# -T sets the Content-Type
# -c is concurrent clients
# -n is the number of requests to run in the test

ab -p test_data.pdf -T 'multipart/form-data; boundary=1234567890' -c 3 -n 2 http://icybcluster.org.ua:35145/api/v1/recap