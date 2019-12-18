// variable for value of selected element of #uploadResultList if CTRL+C
valueOfSelectedElementOfUploadResultListIfCtrlC = {
    selectedElementValue: ""
};


// GLOBAL VARIABLES FOR THIS SCRIPT:
var termsWithIndexDict = {},
    treeData = [], // for bootstrap-treeview
    objForTree = {}, // for bootstrap-treeview
    keyC = 67, // Javascript Char Code (Key Code) for "C" key
    keyEnter = 13; // Javascript Char Code (Key Code) for "Enter" key

var projectStructure = { project: { name: "", notes: "", content: { documents: [] } } },
    alltermsJSON,
    parceJSON,
    selectedDocument,
    lastRecappedFileData,
    lastProjectFiles,
    timeoutId; // for textarea change

var $buttonNewProjectAndClearAll = $('#button-new-project'),
    $recapOverviewButton = $("#recap-overview-button"),
    $uploadResultList = $('#uploadResultList'),
    $projectFileList = $('#projectFileList'),
    $uploadUnknownTerms = $('#uploadUnknownTerms'),
    $textContent = $('#text-content'),
    $termTree = $('#term-tree'),
    $captionOverviewButton = $('#caption_overview_button'),
    $buttonSaveTerms = $('#button-save-terms'),
    $buttonSaveNer = $('#button-save-ner'),
    $buttonSaveProjectFileList = $('#button-save-project-file-list'),
    $buttonSaveAlltermsXml = $('#button-save-allterms-xml'),
    $buttonSaveParceXml = $('#button-save-parce-xml'),
    $upload_button = $('#upload-button'),
    $sents_from_text = $('#sents_from_text'),
    $sortSelect = $('#sort-select'),
    $buttonSaveProject = $('#button-save-project'),
    $textareaNotes = $('#notes');

/*\
|*|  Base64 / binary data / UTF-8 strings utilities (#3)
|*|  https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
\*/
var base64EncDec = {
    toBase64btoaUTF16: function (sString) {
        var aUTF16CodeUnits = new Uint16Array(sString.length);
        Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
        // return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
        return btoa([].reduce.call(new Uint8Array(aUTF16CodeUnits.buffer), function (p, c) { return p + String.fromCharCode(c) }, ''));
    },
    toStringatobUTF16: function (sBase64) {
        var sBinaryString = atob(sBase64), aBinaryView = new Uint8Array(sBinaryString.length);
        Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) { arr[idx] = sBinaryString.charCodeAt(idx); });
        // return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer));
        return new Uint16Array(aBinaryView.buffer).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, '');
    }
};

/* Increase localStorage size 10 times or more! Very easy to use and potentially much faster than native localStorage!
https://github.com/DVLP/localStorageDB
*/
/* !function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}(); */
// usage:
// ldb.set('last-project', JSON.stringify(projectStructure));
// ------------------------------------------------------------------------------------------------------------------

$buttonNewProjectAndClearAll.click(function () {
    iziToast.warning({
        // title: 'Розпочати новий проект?',
        title: 'Create a new project?',
        // message: 'Це призведе до видалення всіх даних.',
        message: 'All data will be lost!',
        position: 'center',
        timeout: 10000,
        buttons: [
            // ['<button>Так</button>', function (instance, toast) {
            ['<button>Ok</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    // onClosing: function (instance, toast, closedBy) {
                    onClosed: function (instance, toast, closedBy) {
                        ClearAllForNewProject();
                    }
                }, toast);
            }],
            // ['<button>Ні</button>', function (instance, toast) {
            ['<button>Cancel</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp'
                }, toast);
            }]
        ]
    });
});

$(document).ready(function () {

    // Detect device, browser and version
    // https://medium.com/creative-technology-concepts-code/detect-device-browser-and-version-using-javascript-8b511906745
    (function () {
        'use strict';
        
        var module = {
            options: [],
            header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
            dataos: [
                { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
                { name: 'Windows', value: 'Win', version: 'NT' },
                { name: 'iPhone', value: 'iPhone', version: 'OS' },
                { name: 'iPad', value: 'iPad', version: 'OS' },
                { name: 'Kindle', value: 'Silk', version: 'Silk' },
                { name: 'Android', value: 'Android', version: 'Android' },
                { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
                { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
                { name: 'Macintosh', value: 'Mac', version: 'OS X' },
                { name: 'Linux', value: 'Linux', version: 'rv' },
                { name: 'Palm', value: 'Palm', version: 'PalmOS' }
            ],
            databrowser: [
                { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
                { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
                { name: 'Safari', value: 'Safari', version: 'Version' },
                { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
                { name: 'Opera', value: 'Opera', version: 'Opera' },
                { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
                { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
            ],
            init: function () {
                var agent = this.header.join(' '),
                    os = this.matchItem(agent, this.dataos),
                    browser = this.matchItem(agent, this.databrowser);
                
                return { os: os, browser: browser };
            },
            matchItem: function (string, data) {
                var i = 0,
                    j = 0,
                    html = '',
                    regex,
                    regexv,
                    match,
                    matches,
                    version;
                
                for (i = 0; i < data.length; i += 1) {
                    regex = new RegExp(data[i].value, 'i');
                    match = regex.test(string);
                    if (match) {
                        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                        matches = string.match(regexv);
                        version = '';
                        if (matches) { if (matches[1]) { matches = matches[1]; } }
                        if (matches) {
                            matches = matches.split(/[._]+/);
                            for (j = 0; j < matches.length; j += 1) {
                                if (j === 0) {
                                    version += matches[j] + '.';
                                } else {
                                    version += matches[j];
                                }
                            }
                        } else {
                            version = '0';
                        }
                        return {
                            name: data[i].name,
                            version: parseFloat(version)
                        };
                    }
                }
                return { name: 'unknown', version: 0 };
            }
        };
        
        var e = module.init(),
            debug = '';
        
/*
        debug += 'os.name = ' + e.os.name + '<br/>';
        debug += 'os.version = ' + e.os.version + '<br/>';
        debug += 'browser.name = ' + e.browser.name + '<br/>';
        debug += 'browser.version = ' + e.browser.version + '<br/>';
        
        debug += '<br/>';
        debug += 'navigator.userAgent = ' + navigator.userAgent + '<br/>';
        debug += 'navigator.appVersion = ' + navigator.appVersion + '<br/>';
        debug += 'navigator.platform = ' + navigator.platform + '<br/>';
        debug += 'navigator.vendor = ' + navigator.vendor + '<br/>';
*/

        console.log('os.name = ' + e.os.name);
        console.log('os.version = ' + e.os.version);
        console.log('browser.name = ' + e.browser.name);
        console.log('browser.version = ' + e.browser.version);

        if (!e.browser.name.includes('Chrome')) {
            // alert('Для коректної роботи клієнтської частини веб-застосунка `KEn`, необхідно використовувати актуальну версію браузера Google Chrome!');
            alert('Use the most recent version of Google Chrome browser!');
        }
    }());

    // Show progress bar
    $("body").css("cursor", "progress");
    $(".loader").show();

    localforage.getItem('last-project').then(function (value) {
        if (value === null) {

            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();

            projectStructure.project.name = 'pr-' + Date.now();
            localforage.setItem('last-project', projectStructure).then(function (value) {
                console.log('New last-project item created with value: ' + JSON.stringify(value));
                iziToast.info({
                    // title: 'Вітаємо, розпочато новий проект!',
                    title: 'Congrats, a new project has been created!',
                    // message: 'Оберіть файл для аналізу (pdf, txt, docx)',
                    message: 'Upload a new document (pdf, txt, docx)',
                    position: 'bottomLeft'
                });
            }).catch(function (err) {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                // This code runs if there were any errors
                console.log(err);
            });
        }
        if (value !== null) {
            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            iziToast.info({
                // title: 'Вітаємо, завантажено проект ' + JSON.stringify(value.project.name),
                title: 'Congrats, the project ' + JSON.stringify(value.project.name) + ' has ben loaded.',
                // message: 'Оберіть файл для аналізу (pdf, txt, docx)',
                message: 'Upload a document (pdf, txt, docx)',
                position: 'bottomLeft'
            });
            projectStructure = value;
            console.log("Countinue existing project: " + JSON.stringify(value.project.name));

            if (typeof value.project.notes != "" && value.project.notes !== null){
                $textareaNotes.val(LZString.decompressFromBase64(value.project.notes))
            }

            if (typeof value.project.content.documents !== "undefined" && value.project.content.documents !== null && value.project.content.documents.length !== null && value.project.content.documents.length > 0) {

                lastRecappedFileData = projectStructure.project.content.documents.slice(-1)[0];
                lastProjectFiles = projectStructure.project.content.documents;

                // Load last alltermsjson --------------------------------------------------------------------------------------
                // set #sort-select to order type 4
                $sortSelect.val('4');
                alltermsJSON = lastRecappedFileData.results.alltermsjson;
                // for known words ES 6
                for (let element of alltermsJSON.termsintext.exporterms.term) {
                    termsWithIndexDict[element.tname] = alltermsJSON.termsintext.exporterms.term.indexOf(element);
                    if (Array.isArray(element.sentpos)) {
                        $uploadResultList.append($('<option>', {
                            text: element.tname,
                            value: element.sentpos.length,
                            // title: 'Частота: ' + element.sentpos.length
                            title: 'Frequency: ' + element.sentpos.length
                        }));
                    }
                    if (Array.isArray(element.sentpos) == false) {
                        $uploadResultList.append($('<option>', {
                            text: element.tname,
                            value: 1,
                            // title: 'Частота: ' + 1
                            title: 'Frequency: ' + 1
                        }));
                    }
                }
                // add text from last recapped file to textarea id="sents_from_text"
                // Clear textarea id="sents_from_text"
                $sents_from_text.text('');
                // add to textarea id="sents_from_text"
                for (let sent_element of alltermsJSON.termsintext.sentences.sent) {
                    $sents_from_text.append('<p>' + sent_element + '</p><br>')
                }

                // load last NER from parcejson in NER tab $uploadUnknownTerms
                parceJSON = lastRecappedFileData.results.parcejson
                $('option', $uploadUnknownTerms).remove();
                // TODO add ckecking if nerElement is present
                for (let nerElement of parceJSON.text.sentence) {

                    if (nerElement.hasOwnProperty('ner')) {
                        if (Array.isArray(nerElement.ner.entity)) {
                            for (let entityElement of nerElement.ner.entity) {
                                $uploadUnknownTerms.append($('<option>', {
                                    value: entityElement.entitytext,
                                    text: entityElement.entitytext
                                }));
                            }
                        };
                        if (Array.isArray(nerElement.ner.entity) == false) {
                            $uploadUnknownTerms.append($('<option>', {
                                value: nerElement.ner.entity.entitytext,
                                text: nerElement.ner.entity.entitytext
                            }));
                        }
                    }
                }

                // Load project files list into #projectFiles element
                for (let projectFilesElement of lastProjectFiles) {
                    $projectFileList.append($('<option>', {
                        value: projectFilesElement.names.unique,
                        text: truncate(projectFilesElement.names.unique, 30),
                        title: projectFilesElement.names.original
                    }));
                }

                // Load NER from nerhtmlBase64 --------------------------------------------------------------------------------------
                $('#displacy-ner').html(LZString.decompressFromBase64(lastRecappedFileData.results.nerhtmlCompressed));

                console.log("Loaded last recapped file with unique name: " + JSON.stringify(lastRecappedFileData.names.unique));
            } else {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                console.log("Existing project is empty");
            }
        }
    }).catch(function (err) {
        // Hide progress bar
        $("body").css("cursor", "default");
        $(".loader").hide();
        console.log(err);
    });

    $("#displacy").hide();
    $("#displacy-ner").hide();

});

$('#button-open-document').click(function () {
    $recapOverviewButton.trigger("click");
});

$('#button-open-project').click(function () {
    // $('#file-input-for-open-project').trigger('click');
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();

    input.onchange = e => {

        // getting a hold of the file reference
        var file = e.target.files[0];
        // setting up the reader
        var reader = new FileReader();


        // file reading started
        reader.addEventListener('loadstart', function () {
            console.log('File reading started');
            // Show progress bar
            $("body").css("cursor", "progress");
            $(".loader").show();
        });

        reader.addEventListener('load', function (e) {
            localforage.clear().then(function () {
                console.log('Database (localforage) is now empty.');
                // contents
                var loaded_json_string = e.target.result;
                // parse as JSON
                var loaded_json = JSON.parse(loaded_json_string);
                localforage.setItem('last-project', loaded_json).then(function (value) {
                    // Hide progress bar
                    $("body").css("cursor", "default");
                    $(".loader").hide();
                    localStorage.clear();
                    location.reload();
                }).catch(function (err) {
                    // Hide progress bar
                    $("body").css("cursor", "default");
                    $(".loader").hide();
                    console.log(err);
                });
            }).catch(function (err) {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                console.log(err);
            });
        });

        // file reading failed
        reader.addEventListener('error', function () {
            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            alert('Error : Failed to read file');
        });
        // file read progress 
        reader.addEventListener('progress', function (e) {
            if (e.lengthComputable == true) {
                var percent_read = Math.floor((e.loaded / e.total) * 100);
                console.log(percent_read + '% read');
            }
        });
        // read as text file
        reader.readAsText(file);
    }
});

// extract terms from text button #recapUploadButton click event
$('#recap-upload-button').click(function () {
    fetchFileToRecapService();
});

$uploadResultList.click(function () {
    if ($uploadResultList.has('option').length > 0) {
        forUploadResultListClickAndEnterPressEvents();
    }
});

// event on pressing enter key on selected element of #uploadResultList
$uploadResultList.keypress(function (event) {
    if ($uploadResultList.has('option').length > 0) {
        let key = event.which;
        if (key == keyEnter)  // the enter key code
        {
            forUploadResultListClickAndEnterPressEvents();
        }
    }
});

/* event on pressing Ctrl+C on selected element of #uploadResultList COPY TO CLIPBOARD
dynamically created INPUT element, variable content passed to the INPUT element value,
and use execCommand("copy") the contents of the command INPUT element is copied to the clipboard.
INPUT element dynamically removed */
$uploadResultList.keydown(function (e) {
    if ($uploadResultList.has('option').length > 0) {
        if (e.keyCode == keyC && e.ctrlKey) {

            let copyCommandSupported = document.queryCommandSupported('copy');

            if (copyCommandSupported) {

                valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue = $("#uploadResultList option:selected").text();

                let $temp = $("<input>");
                $("body").append($temp);
                $temp.val(valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue).select();
                document.execCommand("copy");
                $temp.remove();

            }
        }
    }
});

$uploadUnknownTerms.keydown(function (e) {
    if ($uploadUnknownTerms.has('option').length > 0) {
        if (e.keyCode == keyC && e.ctrlKey) {

            let copyCommandSupported = document.queryCommandSupported('copy');

            if (copyCommandSupported) {

                valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue = $uploadUnknownTerms.prop('value');

                let $temp = $("<input>");
                $("body").append($temp);
                $temp.val(valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue).select();
                document.execCommand("copy");
                $temp.remove();

            }
        }
    }
});

$projectFileList.click(function () {
    if ($projectFileList.has('option').length > 0) {
        forProjectFileListClickAndEnterPressEvents();
    }
});

$projectFileList.keypress(function (event) {
    if ($projectFileList.has('option').length > 0) {
        let key = event.which;
        if (key == keyEnter)  // the enter key code
        {
            forProjectFileListClickAndEnterPressEvents();
        }
    }
});

$projectFileList.keydown(function (e) {
    if ($projectFileList.has('option').length > 0) {
        if (e.keyCode == keyC && e.ctrlKey) {

            let copyCommandSupported = document.queryCommandSupported('copy');

            if (copyCommandSupported) {

                valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue = $projectFileList.prop('text');

                let $temp = $("<input>");
                $("body").append($temp);
                $temp.val(valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue).select();
                document.execCommand("copy");
                $temp.remove();

            }
        }
    }
});

// change p#caption_overview_button caption with filename that selected
// and clear all elements
$recapOverviewButton.change(function () {
    $captionOverviewButton.text(truncate($recapOverviewButton.val().split('\\').pop(), 20));
    $termTree.treeview({});
    $upload_button.css('display', 'block');
    $('option', $uploadResultList).remove();
    $('option', $uploadUnknownTerms).remove();
    $textContent.text('');
});

$buttonSaveProject.click(function () {
    if (projectStructure !== null) {
        downloadLink = document.createElement("a");
        // Make sure that the link is not displayed
        downloadLink.style.display = "none";
        // Add the link to your DOM
        document.body.appendChild(downloadLink);
        // let blob = new Blob([projectStructure], { type: "octet/stream" }),
        let blob = new Blob([JSON.stringify(projectStructure, null, 2)], { type: "application/json" }),
            url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = projectStructure.project.name;
        downloadLink.click();
    }
})

$buttonSaveAlltermsXml.click(function () {
    if (selectedDocument !== null) {
        downloadLink = document.createElement("a");
        // Make sure that the link is not displayed
        downloadLink.style.display = "none";
        // Add the link to your DOM
        document.body.appendChild(downloadLink);
        let blob = new Blob([LZString.decompressFromBase64(selectedDocument.results.alltermsxmlCompressed)], { type: "octet/stream" }),
            url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'allterms.xml';
        downloadLink.click();
    } else {
        if (lastRecappedFileData !== null) {
            downloadLink = document.createElement("a");
            // Make sure that the link is not displayed
            downloadLink.style.display = "none";
            // Add the link to your DOM
            document.body.appendChild(downloadLink);
            let blob = new Blob([LZString.decompressFromBase64(lastRecappedFileData.results.alltermsxmlCompressed)], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'allterms.xml';
            downloadLink.click();
        }
    }
})

$buttonSaveParceXml.click(function () {
    if (selectedDocument !== null) {
        downloadLink = document.createElement("a");
        // Make sure that the link is not displayed
        downloadLink.style.display = "none";
        // Add the link to your DOM
        document.body.appendChild(downloadLink);
        let blob = new Blob([LZString.decompressFromBase64(selectedDocument.results.parcexmlCompressed)], { type: "octet/stream" }),
            url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'parce.xml';
        downloadLink.click();
    } else {
        if (lastRecappedFileData !== null) {
            downloadLink = document.createElement("a");
            // Make sure that the link is not displayed
            downloadLink.style.display = "none";
            // Add the link to your DOM
            document.body.appendChild(downloadLink);
            let blob = new Blob([LZString.decompressFromBase64(lastRecappedFileData.results.parcexmlCompressed)], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'parce.xml';
            downloadLink.click();
        }
    }
})

$buttonSaveTerms.click(function () {
    let arrayOfValuesOfYploadResultList = $("#uploadResultList option").map(function () { return this.value; }).get().join('\n'),
        // Download link
        downloadLink = document.createElement("a");
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    let blob = new Blob([arrayOfValuesOfYploadResultList], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = $captionOverviewButton.text();
    downloadLink.click();
});

$buttonSaveNer.click(function () {
    let arrayOfValuesOfYploadResultList = $("#uploadUnknownTerms option").map(function () { return this.value; }).get().join('\n'),
        // Download link
        downloadLink = document.createElement("a");
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    let blob = new Blob([arrayOfValuesOfYploadResultList], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = $captionOverviewButton.text();
    downloadLink.click();
});

$buttonSaveProjectFileList.click(function () {
    let arrayOfValuesOfYploadResultList = $("#projectFileList option").map(function () { return this.value; }).get().join('\n'),
        // Download link
        downloadLink = document.createElement("a");
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    let blob = new Blob([arrayOfValuesOfYploadResultList], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'projectFilesList.txt';
    downloadLink.click();
});

/*
 The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline,
 such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to
 fetch resources asynchronously across the network.
 https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
//Sending the text file to the server with the recap service to parse
function fetchFileToRecapService() {
    const txtExtension = '.txt',
        docxExtension = '.docx',
        pdfExtension = '.pdf';

    var uploadFileName = $recapOverviewButton.val().split('\\').pop(),
        // Generate unique name for uploaded file
        uniqueUploadFilename = Date.now() + '-' + uploadFileName,
        form = new FormData();

    // var originalAndUniqueFilenames = { original: uploadFileName, unique: uniqueUploadFilename };

    // init content for temporary project
    var projectContent = {names: { original: "", unique: ""}, results: { alltermsxmlCompressed: "", parcexmlCompressed: "", alltermsjson: "", parcejson: "", nerhtmlCompressed: ""}};
    // add file names to content for temporary project
    projectContent.names.original = uploadFileName;
    projectContent.names.unique = uniqueUploadFilename;


    form.append("file", $recapOverviewButton[0].files[0]);

    if (uploadFileName.indexOf(txtExtension) != -1 || uploadFileName.indexOf(docxExtension) || uploadFileName.indexOf(pdfExtension)) {

        // Show progress bar
        $("body").css("cursor", "progress");
        $(".loader").show();

        iziToast.info({
            // title: 'Зачекайте! Аналіз документа',
            title: 'Loading, please wait.',
            message: uploadFileName.split('\\').pop(),
            position: 'bottomLeft',
            close: false,
            timeout: false
        });

        $projectFileList.append($('<option>', {
            value: projectContent.names.unique,
            text: truncate(projectContent.names.unique, 30),
            title: projectContent.names.original
        }));

        // Hide Upload button and show tabs
        $upload_button.css('display', 'none');
        $('.tabs').css('display', 'block');

        // Clear terms list,textArea, input choose file
        $recapOverviewButton.val("");
        $('option', $uploadResultList).remove();
        $('option', $uploadUnknownTerms).remove();
        $textContent.text('');


        if (self.fetch) {

            fetch('/ken/api/en/file/allterms', {
                method: 'post',
                body: form
            })
                .then(response => {

                    if (response.status == 503) {
                        // Hide progress bar
                        $("body").css("cursor", "default");
                        $(".loader").hide();
                        $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
                        iziToast.warning({
                            // title: 'Сервіс зайнятий, спробуйте ще раз.',
                            title: 'Service Unavailable error, try again later.',
                            message: 'Status: ' + response.status,
                            position: 'bottomLeft',
                            onClosed: function () {
                                iziToast.destroy();
                            }
                        });
                        return;
                    }

                    return response.text().then(result => {

                        dom = new DOMParser().parseFromString(result, "text/xml");
                        alltermsJSON = xmlToJson(dom);

                        // set #sort-select to order type 4
                        $sortSelect.val('4');

                        // add allterms.xml to content for temporary project ("alltermsxmlCompressed" field)
                        projectContent.results.alltermsxmlCompressed = LZString.compressToBase64(result);
                        // add allterms.xml in JSON to content for temporary project ("alltermsjson" field)
                        projectContent.results.alltermsjson = alltermsJSON;

                        // var compressed = LZString.compressToBase64(result);
                        // console.log("Size of uncompressed sample is: " + result.length);
                        // console.log("Size of compressed sample is: " + compressed.length);
                        // console.log("Size of compressed sample is: " + compressed);

                        for (let elementKnownTxtJson of alltermsJSON.termsintext.exporterms.term) {
                            termsWithIndexDict[elementKnownTxtJson.tname] = alltermsJSON.termsintext.exporterms.term.indexOf(elementKnownTxtJson); // for dictionary structure
                            if (Array.isArray(elementKnownTxtJson.sentpos)) {
                                $uploadResultList.append($('<option>', {
                                    text: elementKnownTxtJson.tname,
                                    value: elementKnownTxtJson.sentpos.length,
                                    // title: 'Частота: ' + elementKnownTxtJson.sentpos.length
                                    title: 'Frequency: ' + elementKnownTxtJson.sentpos.length
                                }));
                            }
                            if (Array.isArray(elementKnownTxtJson.sentpos) == false) {
                                $uploadResultList.append($('<option>', {
                                    text: elementKnownTxtJson.tname,
                                    value: 1,
                                    // title: 'Частота: ' + 1
                                    title: 'Frequency: ' + 1
                                }));
                            }
                        }

                        // Clear textarea id="sents_from_text"
                        $sents_from_text.text('');
                        // add to textarea id="sents_from_text"
                        for (let sent_element of alltermsJSON.termsintext.sentences.sent) {
                            $sents_from_text.append('<p>' + sent_element + '</p><br>')
                        }
                    });
                })
                // fetch to parce.xml for NER
                .then(next => {
                    return fetch('/ken/api/en/file/parcexml', {
                        method: 'post',
                        body: form
                    })
                        .then(response => {
                            return response.text().then(result => {

                                dom = new DOMParser().parseFromString(result, "text/xml");
                                parceJSON = xmlToJson(dom);

                                // add parce.xml to content for temporary project ("parcexmlCompressed" field)
                                projectContent.results.parcexmlCompressed = LZString.compressToBase64(result);
                                // add parce.xml in JSON to content for temporary project ("parcejson" field)
                                projectContent.results.parcejson = parceJSON;

                                for (let sentElement of parceJSON.text.sentence) {

                                    if (sentElement.hasOwnProperty('ner')) {
                                        if (Array.isArray(sentElement.ner.entity)) {
                                            for (let entityElement of sentElement.ner.entity) {
                                                $uploadUnknownTerms.append($('<option>', {
                                                    value: entityElement.entitytext,
                                                    text: entityElement.entitytext
                                                }));
                                            }
                                        };
                                        if (Array.isArray(sentElement.ner.entity) == false) {
                                            $uploadUnknownTerms.append($('<option>', {
                                                value: sentElement.ner.entity.entitytext,
                                                text: sentElement.ner.entity.entitytext
                                            }));
                                        }
                                    }
                                }
                            });
                        })
                })
                // fetch to /ken/api/en/html/ner for NER
                .then(next => {

                    sentencesData = JSON.stringify(Object.values(alltermsJSON.termsintext.sentences.sent));

                    return fetch('/ken/api/en/html/ner', {
                        method: 'post',
                        body: sentencesData
                    })
                        .then(response => {
                            return response.text().then(function (result) {

                                // add spaCy NER html results to content for temporary project ("nerhtmlCompressed" field)
                                projectContent.results.nerhtmlCompressed = LZString.compressToBase64(result);

                                // add projectContent to projectStructure content array
                                projectStructure.project.content.documents.push(projectContent);
                                // Update last recapped file data
                                lastRecappedFileData = projectContent;
                                // Update localforage "last-project"
                                localforage.setItem('last-project', projectStructure).then(function (value) {
                                    console.log('last-project item of database (localforage) updated');
                                }).catch(function (err) {
                                    // Hide progress bar
                                    $("body").css("cursor", "default");
                                    $(".loader").hide();
                                    console.log(err);
                                });

                                // Add last recaped data to last-selected database
                                localforage.setItem('last-selected', projectContent).then(function (value) {
                                    console.log('last-selected item of database (localforage) updated');
                                }).catch(function (err) {
                                    // Hide progress bar
                                    $("body").css("cursor", "default");
                                    $(".loader").hide();
                                    console.log(err);
                                });

                                $('#displacy-ner').html(result);
                                // Hide progress bar
                                $("body").css("cursor", "default");
                                $(".loader").hide();
                                iziToast.success({
                                    title: 'OK',
                                    // message: 'Обробка файлу виконана',
                                    message: 'Document processing completed.',
                                    position: 'bottomLeft',
                                    timeout: 2000,
                                    onClosed: function () {
                                        iziToast.destroy();
                                    }
                                });
                            });
                        })
                })
                .catch(error => {
                    // Hide progress bar
                    $("body").css("cursor", "default");
                    $(".loader").hide();
                    $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
                    console.log(error);
                    iziToast.warning({
                        // title: 'Помилка!',
                        title: 'Internal Server Error!',
                        // message: 'Виникла помилка на стороні серевера 500',
                        // message: 'Дивіться деталі в JavaScript Console',
                        message: 'Please check JavaScript Console',
                        position: 'bottomLeft',
                        onClosed: function () {
                            iziToast.destroy();
                        }
                    });
                });

        } else {
            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            iziToast.warning({
                title: 'Fetch error!',
                // message: 'Ваш браузер застарів, встановіть актуальну версію Google Chrome!',
                message: 'Use the most recent version of Google Chrome browser!',
                position: 'bottomLeft',
                onClosed: function () {
                    iziToast.destroy();
                }
            });
        }
    }
}

function forUploadResultListClickAndEnterPressEvents() {

    if ($("#uploadResultList option:selected").text() != "") {
        //clear textArea #text-content
        $textContent.text('');

        var valOfSelectedElementInUploadResultList = termsWithIndexDict[$("#uploadResultList option:selected").text()];

        // inserting sentences with selected terms in #text-content
        if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos)) {
            let sentIndex = [];
            let sentsForMark = [];
            for (let elementForUploadResultListDbClickAndEnterPress of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) {
                if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))))) {
                    $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))] + '</p><br>');
                    sentsForMark.push(alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))]);
                    sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))));
                }
            }
            mark(sentsForMark);
        }

        if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) == false) {

            $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/"))] + '<p><br>');

            mark(alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/"))]);
        }

        // inserting terms in tree #term-tree
        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown')) {

            //template structure for bootstrap-treeview
            objForTree = { text: $("#uploadResultList option:selected").text(), nodes: [] };

            // add child nodes to template structure for bootstrap-treeview
            if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)) {
                for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) {
                    objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(elementForTermTree)] = { text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname };
                }
            }
            if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) == false) {
                objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)] = { text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown].tname };
            }

            treeData.length = 0; //clear treeData array

            treeData.push(objForTree); //add structure to array

            $termTree.treeview({
                data: treeData,
                onNodeSelected: function (event, node) {
                    // inserting sentences with selected terms in #text-content
                    //clear #text-content
                    $textContent.text('');
                    let selectedTermInTermTree = termsWithIndexDict[node.text];
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) == false) {

                        $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))] + '<p><br>');

                        mark(alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))]);
                    }
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos)) {
                        let sentIndex = [];
                        let sentsForMark = [];
                        for (let elementForUploadResultListDbClickAndEnterPress of alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) {
                            if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))))) {
                                $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))] + '</p><br>');
                                sentsForMark.push(alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))]);
                                sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))));
                            }
                        }
                        mark(sentsForMark);
                    }
                    markTerms(node.text);
                    copyTermTreeToTable(node.text);
                    // visualize noun-chunk/term
                    let displacy = new displaCy('/ken/api/en/html/depparse/nounchunk', {
                        container: '#displacy'
                    });
                    displacy.parse(node.text);
                }
            }); // add array data to bootstrap-treeview and view it on page
        }

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {

            //template structure for bootstrap-treeview
            objForTree = { text: $("#uploadResultList option:selected").text(), nodes: [] };

            // add child nodes to template structure for bootstrap-treeview
            if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)) {
                for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) {
                    objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(elementForTermTree)] = { text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname };
                }
            }
            if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) == false) {
                objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)] = { text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup].tname };
            }

            treeData.length = 0; //clear treeData array

            treeData.push(objForTree); //add structure to array

            $termTree.treeview({
                data: treeData,
                onNodeSelected: function (event, node) {
                    // inserting sentences with selected terms in #text-content

                    //clear #text-content
                    $textContent.text('');
                    let selectedTermInTermTree = termsWithIndexDict[node.text];
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) == false) {

                        $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))] + '<p><br>');

                        mark(alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))]);
                    }
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos)) {
                        let sentIndex = [];
                        let sentsForMark = [];
                        for (let elementForUploadResultListDbClickAndEnterPress of alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) {
                            if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))))) {
                                $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))] + '</p><br>');
                                sentsForMark.push(alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))]);
                                sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))));
                            }
                        }
                        mark(sentsForMark);
                    }
                    markTerms(node.text);
                    copyTermTreeToTable(node.text);
                    // visualize noun-chunk/term
                    let displacy = new displaCy('/ken/api/en/html/depparse/nounchunk', {
                        container: '#displacy'
                    });
                    displacy.parse(node.text);
                }
            }); // add array data to bootstrap-treeview and view it on page
        }

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup') == false && alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') == false) {
            $termTree.treeview({});
        }

        markTerms($("#uploadResultList option:selected").text().replace(/\s?([-])\s?/g, '-'));

        // visualize noun-chunk/term
        let displacy = new displaCy('/ken/api/en/html/depparse/nounchunk', {
            container: '#displacy'
        });
        displacy.parse($("#uploadResultList option:selected").text());
    }

}

function forProjectFileListClickAndEnterPressEvents() {

    if ($projectFileList.prop('value') == "") {
        console.log("No selected document!");
    }

    if (projectStructure !== null && $projectFileList.prop('value') != "") {
        if (typeof projectStructure.project.content.documents !== "undefined" && projectStructure.project.content.documents !== null && projectStructure.project.content.documents.length !== null && projectStructure.project.content.documents.length > 0) {

            iziToast.warning({
                // title: 'Відкрити документ ' + $projectFileList.prop('value') + ' ?',
                title: 'Are you sure to open document ' + $projectFileList.prop('value') + ' ?',
                // message: 'Це призведе до видалення всіх даних.',
                position: 'center',
                timeout: 10000,
                buttons: [
                    // ['<button>Так</button>', function (instance, toast) {
                    ['<button>Ok</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'fadeOutUp',
                            // onClosing: function (instance, toast, closedBy) {
                            onClosed: function (instance, toast, closedBy) {
                                console.log('Selected document unique name: ' + $projectFileList.prop('value'));
                                selectedDocument = projectStructure.project.content.documents.find(document => document.names.unique === $projectFileList.prop('value'));
                                // Update data in last-selected database with selected document
                                localforage.setItem('last-selected', selectedDocument).then(function (value) {
                                    console.log('last-selected item of database updated');
                                }).catch(function (err) {
                                    console.log(err);
                                });

                                $("#displacy").empty();
                                // Load NER from nerhtmlCompressed --------------------------------------------------------------------------------------
                                $('#displacy-ner').html(LZString.decompressFromBase64(selectedDocument.results.nerhtmlCompressed));
                                // load NER from parcejson in NER tab $uploadUnknownTerms
                                $('option', $uploadUnknownTerms).remove();
                                parceJSON = selectedDocument.results.parcejson;
                                for (let nerElement of parceJSON.text.sentence) {

                                    if (nerElement.hasOwnProperty('ner')) {
                                        if (Array.isArray(nerElement.ner.entity)) {
                                            for (let entityElement of nerElement.ner.entity) {
                                                $uploadUnknownTerms.append($('<option>', {
                                                    value: entityElement.entitytext,
                                                    text: entityElement.entitytext
                                                }));
                                            }
                                        };
                                        if (Array.isArray(nerElement.ner.entity) == false) {
                                            $uploadUnknownTerms.append($('<option>', {
                                                value: nerElement.ner.entity.entitytext,
                                                text: nerElement.ner.entity.entitytext
                                            }));
                                        }
                                    }
                                }
                                alltermsJSON = selectedDocument.results.alltermsjson;
                                $('option', $uploadResultList).remove();
                                $textContent.text('');
                                $termTree.treeview({});
                                $captionOverviewButton.text(truncate($projectFileList.find("option:selected").attr("title"), 20));
                                // set #sort-select to order type 4
                                $sortSelect.val('4');
                                // for known words ES 6
                                for (let element of alltermsJSON.termsintext.exporterms.term) {
                                    termsWithIndexDict[element.tname] = alltermsJSON.termsintext.exporterms.term.indexOf(element);

                                    if (Array.isArray(element.sentpos)) {
                                        $uploadResultList.append($('<option>', {
                                            text: element.tname,
                                            value: element.sentpos.length,
                                            // title: 'Частота: ' + element.sentpos.length
                                            title: 'Frequency: ' + element.sentpos.length
                                        }));
                                    }
                                    if (Array.isArray(element.sentpos) == false) {
                                        $uploadResultList.append($('<option>', {
                                            text: element.tname,
                                            value: 1,
                                            // title: 'Частота: ' + 1
                                            title: 'Frequency: ' + 1
                                        }));
                                    }
                                }
                                // add text from selected document file to textarea id="sents_from_text"
                                // Clear textarea id="sents_from_text"
                                $sents_from_text.text('');
                                // add to textarea id="sents_from_text"
                                for (let sent_element of alltermsJSON.termsintext.sentences.sent) {
                                    $sents_from_text.append('<p>' + sent_element + '</p><br>')
                                }

                                iziToast.info({
                                    // title: 'Документ ' + $projectFileList.prop('value') + ' завантажено!',
                                    title: 'Document ' + $projectFileList.prop('value') + ' loaded!',
                                    // message: $projectFileList.prop('value') + ' завантажено!',
                                    position: 'bottomLeft'
                                });
                                console.log($projectFileList.prop('value') + ' item loaded from database');
                            }
                        }, toast);
                    }],
                    // ['<button>Ні</button>', function (instance, toast) {
                    ['<button>Cancel</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'fadeOutUp'
                        }, toast);
                    }]
                ]
            });
        }
    } else {
        console.log("projectStructure variable is empty!");
        iziToast.warning({
            // title: 'Оберіть документ проекту зі списку!',
            title: 'Select project\'s document from the list!',
            position: 'bottomLeft'
        });
    }
}

function ClearAllForNewProject() {
    $('option', $uploadResultList).remove();
    $('option', $uploadUnknownTerms).remove();
    $textContent.text('');
    $textareaNotes.val('');
    $('input').val('');
    $termTree.treeview({});
    $("#displacy").empty();
    $("#displacy-ner").empty();
    localStorage.clear();
    localforage.clear().then(function () {
        console.log('Database is now empty.');
        location.reload();
    }).catch(function (err) {
        console.log(err);
    });
}

function truncate(n, len) {
    let ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
    let filename = n.replace('.' + ext, '');
    if (filename.length <= len) {
        return n;
    }
    filename = filename.substr(0, len) + (n.length > len ? '[...]' : '');
    return filename + '.' + ext;
}

function copyTermTreeToTable(termTreeText) {
    // Mouse handler for table (DROP):
    $('#table-body').on('mouseup', 'td', function () {
        if (termTreeText != '') {
            $(this).html(termTreeText);
            termTreeText = '';
        }
    });
}

// Changes XML to JSON
// Modified version from here: http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

// CHANGE TABS ---------------------------------------------------------------------------------------------------------
$('.nav-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
});

$('a[data-toggle="data"]').on('shown.bs.tab', function (e) {

    if ($("#new_term_tab").is(".tab-pane.active")) {
        $("#displacy").hide();
        $("#displacy-ner").show();
        // $("#displacy-label").html('<center>Візуалізація іменованих сутностей <a target="_blank" href="https://spacy.io/api/annotation#named-entities">(список анотацій)</a></center>');
        $("#displacy-label").html('<center>Visualization of the named entities <a target="_blank" href="https://spacy.io/api/annotation#named-entities">(annotation specs)</a></center>');
        $("#displacy-label").show();
    }
    if ($("#term_tab").is(".tab-pane.active")) {
        $("#displacy").show();
        $("#displacy-ner").hide();
        // $("#displacy-label").html('<center>Візуалізація залежностей термінів <a target="_blank" href="https://spacy.io/api/annotation#dependency-parsing">(список анотацій)</a></center>');
        $("#displacy-label").html('<center>Visualization of the term dependency parsing <a target="_blank" href="https://spacy.io/api/annotation#dependency-parsing">(annotation specs)</a></center>');
        $("#displacy-label").show();
    }
    if ($("#text_tab").is(".tab-pane.active")) {
        $("#displacy").hide();
        $("#displacy-ner").hide();
        $("#displacy-label").hide();
    }
    if ($("#fileList").is(".tab-pane.active")) {
        document.getElementById("projectFileList").oncontextmenu = function (event) {
            if (event.target.text !== undefined) {
                iziToast.warning({
                    // title: 'Видалити документ ' + event.target.text + ' ?',
                    title: 'Remove document ' + event.target.text + ' ?',
                    // message: ' Видалити документ ' + event.target.text + ' ?',
                    position: 'center',
                    timeout: 10000,
                    buttons: [
                        // ['<button>Так</button>', function (instance, toast) {
                        ['<button>Ok</button>', function (instance, toast) {
                            instance.hide({
                                transitionOut: 'fadeOutUp',
                                // onClosing: function (instance, toast, closedBy) {
                                onClosed: function (instance, toast, closedBy) {

                                    if (projectStructure !== null) {
                                        let filtered = projectStructure.project.content.documents.filter(function (el) { return el.names.unique != event.target.value; });
                                        projectStructure.project.content.documents = filtered;
                                        localforage.setItem('last-project', projectStructure).then(function (value) {
                                            console.log('last-project item of database updated');
                                            $("#projectFileList option[value='" + event.target.value + "']").remove();
                                            location.reload();
                                        }).catch(function (err) {
                                            console.log(err);
                                        });
                                    }

                                }
                            }, toast);
                        }],
                        // ['<button>Ні</button>', function (instance, toast) {
                        ['<button>Cancel</button>', function (instance, toast) {
                            instance.hide({
                                transitionOut: 'fadeOutUp'
                            }, toast);
                        }]
                    ]
                });
            }
            return false; // cancel default context menu
        }
    }
});
// CHANGE TABS ---------------------------------------------------------------------------------------------------------

// Sort terms ---------------------------------------------------------------------------------------------------------
$sortSelect.on('change', function (e) {
    var selected = $("#uploadResultList").val();
    let sortSelectVal = $("#sort-select option:selected").val();
    // let selectText = $("#sort-select option:selected").text();

    if (sortSelectVal == 1) {
        var my_options = $("#uploadResultList option");
        my_options.sort(function (a, b) {
            if (a.text > b.text) return 1;
            else if (a.text < b.text) return -1;
            else return 0;
        });
        $("#uploadResultList").empty().append(my_options);
        $("#uploadResultList").val(selected);
    }

    if (sortSelectVal == 2) {
        var my_options = $("#uploadResultList option");
        my_options.sort(function (a, b) {
            a = a.value;
            b = b.value;
            return a - b;
        });
        $("#uploadResultList").empty().append(my_options);
        $("#uploadResultList").val(selected);
    }

    if (sortSelectVal == 3) {
        var my_options = $("#uploadResultList option");
        my_options.sort(function (a, b) {
            a = a.value;
            b = b.value;
            return b - a;
        });
        $("#uploadResultList").empty().append(my_options);
        $("#uploadResultList").val(selected);
    }

    if (sortSelectVal == 4) {
        $("#uploadResultList").empty();
        // for known words ES 6
        for (let element of alltermsJSON.termsintext.exporterms.term) {
            termsWithIndexDict[element.tname] = alltermsJSON.termsintext.exporterms.term.indexOf(element);
            if (Array.isArray(element.sentpos)) {
                $uploadResultList.append($('<option>', {
                    text: element.tname,
                    value: element.sentpos.length,
                    // title: 'Частота: ' + element.sentpos.length
                    title: 'Frequency: ' + element.sentpos.length
                }));
            }
            if (Array.isArray(element.sentpos) == false) {
                $uploadResultList.append($('<option>', {
                    text: element.tname,
                    value: 1,
                    // title: 'Частота: ' + 1
                    title: 'Frequency: ' + 1
                }));
            }
        }
    }
});
// Sort terms ---------------------------------------------------------------------------------------------------------

// mark.js ---------------------------------------------------------------------------------------------------------
function mark(text) {
    // Determine selected options for mark.js
    var options = {
        "each": function (element) {
            setTimeout(function () {
                $(element).addClass("animate");
            }, 250);
        },
        "separateWordSearch": false,
        "accuracy": "complementary",
        "diacritics": true
    };
    $("#sents_from_text").unmark({
        done: function () {
            $("#sents_from_text").mark(text, options);
        }
    });
}

function markTerms(term) {
    // Determine selected options for mark.js
    var options = {
        "each": function (element) {
            setTimeout(function () {
                $(element).addClass("animate");
            }, 250);
        },
        "separateWordSearch": false,
        "accuracy": "complementary",
        "diacritics": true
    };
    $("#text-content").unmark({
        done: function () {
            $("#text-content").mark(term, options);
        }
    });
}
// mark.js ---------------------------------------------------------------------------------------------------------

// the textarea sutosave -------------------------------------------------------------------------------------------
$textareaNotes.on('input propertychange change', function() {
    console.log('Textarea Change');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change    
        saveNotesToLF();
    }, 1000);
});

function saveNotesToLF() {
    var d = new Date();
    console.log('Saved #notes to the localforge! Last: ' + d.toLocaleTimeString())
    projectStructure.project.notes = LZString.compressToBase64($textareaNotes.val());
    // Update localforage "last-project"
    localforage.setItem('last-project', projectStructure).then(function (value) {
        console.log('last-project item of database updated with #notes value: ' + JSON.stringify(value.project.notes));
    }).catch(function (err) {
        console.log(err);
    });
}
// the textarea sutosave -------------------------------------------------------------------------------------------