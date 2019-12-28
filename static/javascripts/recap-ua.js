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
                title: 'Congrats, the project ' + JSON.stringify(value.project.name) + ' has been loaded.',
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