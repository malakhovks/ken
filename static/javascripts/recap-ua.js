// variable for value of selected element of #uploadResultList if CTRL+C
valueOfSelectedElementOfUploadResultListIfCtrlC = {
    selectedElementValue: ""
};


// GLOBAL VARIABLES FOR THIS SCRIPT:
var termsWithIndexDict = {},
    treeData = [], // for bootstrap-treeview
    // objForTree = {}, // for bootstrap-treeview
    objForTree = { text: "", nodes: [] }, // template structure for bootstrap-treeview
    keyC = 67, // Javascript Char Code (Key Code) for "C" key
    keyEnter = 13; // Javascript Char Code (Key Code) for "Enter" key

var projectStructure = { project: { name: "", notes: "", content: { documents: [] } } },
    // init content for temporary project
    projectContent = { names: { original: "", unique: "" }, results: { alltermsxmlCompressed: "", parcexmlCompressed: "", alltermsjson: "", parcejson: "" } },
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
        title: 'Розпочати новий проект?',
        message: 'Це призведе до видалення всіх даних.',
        position: 'center',
        timeout: 10000,
        buttons: [
            ['<button>Так</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    // onClosing: function (instance, toast, closedBy) {
                    onClosed: function (instance, toast, closedBy) {
                        ClearAllForNewProject();
                    }
                }, toast);
            }],
            ['<button>Ні</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp'
                }, toast);
            }]
        ]
    });
});

// ----------------------------------------------------------------------------------------------------------------------

$(window).resize(function () {
    if ($(window).width() < 1024) {
        alert('Встановіть мінімальний розмір екрану 1024х768!');
    }
});

$(window).on("load", function () {
    // page is fully loaded, including all frames, objects and images
    if ($(window).width() < 1024) {
        alert('Set the minimum screen size to 1024x768!');
    }
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

        console.log('os.name = ' + e.os.name);
        console.log('os.version = ' + e.os.version);
        console.log('browser.name = ' + e.browser.name);
        console.log('browser.version = ' + e.browser.version);

        if (!e.browser.name.includes('Chrome')) {
            alert('Для коректної роботи веб-застосунка `Конспект`, необхідно використовувати актуальну версію браузера Google Chrome!');
        }
    }());

    // Show progress bar
    $("body").css("cursor", "progress");
    $(".loader").show();
    // Disable any DIV including its contents is to just disable mouse interaction.
    $(".container_adapter_for_one_page_view").addClass("disabledbutton");

    localforage.getItem('last-project').then(function (value) {
        if (value === null) {

            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            // Enable any DIV including its contents.
            $(".container_adapter_for_one_page_view").removeClass("disabledbutton");

            projectStructure.project.name = 'pr-' + Date.now();
            localforage.setItem('last-project', projectStructure).then(function (value) {
                console.log('New last-project item created with value: ' + JSON.stringify(value));
                iziToast.info({
                    title: 'Вітаємо, розпочато новий проект!',
                    message: 'Оберіть файл для аналізу (pdf, txt, docx)',
                    position: 'bottomLeft'
                });
            }).catch(function (err) {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                // Enable any DIV including its contents.
                $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
                // This code runs if there were any errors
                console.log(err);
                iziToast.error({
                    title: 'Помилка!',
                    message: 'Дивіться деталі в JavaScript Console.',
                    position: 'bottomLeft',
                    onClosed: function () {
                        iziToast.destroy();
                    }
                });
            });
        }
        if (value !== null) {
            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            iziToast.info({
                title: 'Вітаємо, завантажено проект ' + JSON.stringify(value.project.name),
                message: 'Оберіть файл для аналізу (pdf, txt, docx)',
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
                            title: 'Частота: ' + element.sentpos.length
                        }));
                    }
                    if (Array.isArray(element.sentpos) == false) {
                        $uploadResultList.append($('<option>', {
                            text: element.tname,
                            value: 1,
                            title: 'Частота: ' + 1
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

                // load Unknown terms into $uploadUnknownTerms

                // load Unknown terms into $uploadUnknownTerms

                // Load project files list into #projectFiles element
                for (let projectFilesElement of lastProjectFiles) {
                    $projectFileList.append($('<option>', {
                        value: projectFilesElement.names.unique,
                        text: truncate(projectFilesElement.names.unique, 30),
                        title: projectFilesElement.names.original
                    }));
                }

                console.log("Loaded last recapped file with unique name: " + JSON.stringify(lastRecappedFileData.names.unique));
                
                // Enable any DIV including its contents.
                $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
            } else {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                // Enable any DIV including its contents.
                $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
                console.log("Existing project is empty");
            }
        }
    }).catch(function (err) {
        // Hide progress bar
        $("body").css("cursor", "default");
        $(".loader").hide();
        // Enable any DIV including its contents.
        $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
        console.log(err);
        iziToast.error({
            title: 'Помилка!',
            message: 'Дивіться деталі в JavaScript Console.',
            position: 'bottomLeft',
            onClosed: function () {
                iziToast.destroy();
            }
        });
    });

});
// ----------------------------------------------------------------------------------------------------------------------

// Saving ---------------------------------------------------------------------------------------------------------------
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
// Saving ---------------------------------------------------------------------------------------------------------------

// Sending to server ------------------------------------------------------------------------------------------------------

// extract terms from text #recapUploadButton click event
$('#recap-upload-button').click(function () {
    if (self.fetch) {

        // Show progress bar
        $("body").css("cursor", "progress");
        $(".loader").show();
        // Disable any DIV including its contents is to just disable mouse interaction.
        $(".container_adapter_for_one_page_view").addClass("disabledbutton");

        fetchFileToTaskQueuedService().then(result => {
            console.log(JSON.stringify(result));
            subscribe('/kua/api/task/status?' + 'id=' + result.task.id, result.task.id, result.task.file);
        });

    } else {
        iziToast.error({
            title: 'Помилка!',
            message: 'Ваш браузер застарів, встановіть актуальну версію Google Chrome!',
            position: 'bottomLeft',
            onClosed: function () {
                iziToast.destroy();
            }
        });
    }
});

async function subscribe(url, taskID, queuedFilename) {
    let response = await fetch(url);
    if (response.status == 502) {
        // Status 502 is a connection timeout error,
        // may happen when the connection was pending for too long,
        // and the remote server or a proxy closed it
        // let's reconnect
        console.log('Task status: ' + response.status);
        await subscribe(url, taskID, queuedFilename);
    } else if (response.status != 200) {
        // An error - let's show it
        console.log('Task status: ' + response.status);
        // Reconnect in one second
        await new Promise(resolve => setTimeout(resolve, 7000));
        await subscribe(url, taskID, queuedFilename);
    } else {
        // Get and show the message
        let message = await response.text();
        console.log('Task status: ' + message);

        getAlltermsParce(taskID, queuedFilename);

        // Hide progress bar
        $("body").css("cursor", "default");
        $(".loader").hide();
        // Enable any DIV including its contents.
        $(".container_adapter_for_one_page_view").removeClass("disabledbutton");

        iziToast.success({
            title: 'OK',
            message: 'Обробка файлу виконана',
            position: 'bottomLeft',
            onClosed: function () {
                iziToast.destroy();
            }
        });
    }
}

/*
 The Fetch API provides a JavaScript interface for accessing and manipulating parts of the HTTP pipeline,
 such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to
 fetch resources asynchronously across the network.
 https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
//Sending the text file to the server with the recap service to parse
function fetchFileToTaskQueuedService() {
    const txtExtension = '.txt',
        docxExtension = '.docx',
        pdfExtension = '.pdf';

    var uploadFileName = $recapOverviewButton.val().split('\\').pop(),
        // Generate unique name for uploaded file
        uniqueUploadFilename = Date.now() + '-' + uploadFileName,
        form = new FormData();

    // init content for temporary project
    // projectContent = { names: { original: "", unique: "" }, results: { alltermsxmlCompressed: "", parcexmlCompressed: "", alltermsjson: "", parcejson: "" } };
    // add file names to content for temporary project
    projectContent.names.original = uploadFileName;
    projectContent.names.unique = uniqueUploadFilename;


    form.append("file", $recapOverviewButton[0].files[0]);

    if (uploadFileName.indexOf(txtExtension) != -1 || uploadFileName.indexOf(docxExtension) || uploadFileName.indexOf(pdfExtension)) {

        iziToast.info({
            title: 'Зачекайте! Аналіз документа.',
            message: uploadFileName.split('\\').pop(),
            position: 'bottomLeft',
            close: false
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


        return fetch('/kua/api/task/queued', {
            method: 'post',
            body: form
        }).then(response => {
            if (!response.ok) {
                // Hide progress bar
                $("body").css("cursor", "default");
                $(".loader").hide();
                // Enable any DIV including its contents.
                $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
                $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
                iziToast.error({
                    title: 'Помилка!',
                    message: 'Дивіться деталі в JavaScript Console. Статус: ' + response.status,
                    position: 'bottomLeft',
                    onClosed: function () {
                        iziToast.destroy();
                    }
                });
                console.log(response.status);
                return response.status;
            }
            return response.json();
        }).then(obj => {
            return obj;
        }).catch(error => {
            // Hide progress bar
            $("body").css("cursor", "default");
            $(".loader").hide();
            // Enable any DIV including its contents.
            $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
            $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
            console.log(error);
            iziToast.error({
                title: 'Помилка!',
                message: 'Дивіться деталі в JavaScript Console',
                position: 'bottomLeft',
                onClosed: function () {
                    iziToast.destroy();
                }
            });
        })
    }
}

function getAlltermsParce(taskID, queuedFilename) {
    const url = '/kua/api/task/allterms/result?' + 'id=' + taskID;
    const url2 = '/kua/api/task/parce/result?' + 'id=' + taskID;
    fetch(url)
        .then(responseXML => {
            if (!responseXML.ok) { throw new Error(responseXML.status) }
            return responseXML.text()
                .then(result => {
                    dom = new DOMParser().parseFromString(result, "text/xml");
                    alltermsJSON = xmlToJson(dom);

                    // set #sort-select to order type 4
                    $sortSelect.val('4');

                    console.log(JSON.stringify(alltermsJSON));

                    // add allterms.xml to content for temporary project ("alltermsxmlCompressed" field)
                    projectContent.results.alltermsxmlCompressed = LZString.compressToBase64(result);
                    // add allterms.xml in JSON to content for temporary project ("alltermsjson" field)
                    projectContent.results.alltermsjson = alltermsJSON;

                    for (let elementKnownTxtJson of alltermsJSON.termsintext.exporterms.term) {
                        termsWithIndexDict[elementKnownTxtJson.tname] = alltermsJSON.termsintext.exporterms.term.indexOf(elementKnownTxtJson); // for dictionary structure
                        if (Array.isArray(elementKnownTxtJson.sentpos)) {
                            $uploadResultList.append($('<option>', {
                                text: elementKnownTxtJson.tname,
                                value: elementKnownTxtJson.sentpos.length,
                                title: 'Частота: ' + elementKnownTxtJson.sentpos.length
                            }));
                        }
                        if (Array.isArray(elementKnownTxtJson.sentpos) == false) {
                            $uploadResultList.append($('<option>', {
                                text: elementKnownTxtJson.tname,
                                value: 1,
                                title: 'Частота: ' + 1
                            }));
                        }
                    }

                    // Clear textarea id="sents_from_text"
                    $sents_from_text.text('');
                    // add to textarea id="sents_from_text"
                    for (let sent_element of alltermsJSON.termsintext.sentences.sent) {
                        $sents_from_text.append('<p>' + sent_element + '</p><br>')
                    }
                }).then(next => {
                    fetch(url2)
                        .then(responseXML => {
                            if (!responseXML.ok) { throw new Error(responseXML.status) }
                            return responseXML.text()
                                .then(result => {
                                    dom = new DOMParser().parseFromString(result, "text/xml");
                                    parceJSON = xmlToJson(dom);

                                    console.log(JSON.stringify(parceJSON));

                                    // add parce.xml to content for temporary project ("parcexmlCompressed" field)
                                    projectContent.results.parcexmlCompressed = LZString.compressToBase64(result);
                                    // add parce.xml in JSON to content for temporary project ("parcejson" field)
                                    projectContent.results.parcejson = parceJSON;

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
                                        // Enable any DIV including its contents.
                                        $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
                                        console.log(err);
                                        iziToast.error({
                                            title: 'Помилка!',
                                            message: 'Дивіться деталі в JavaScript Console.',
                                            position: 'bottomLeft',
                                            onClosed: function () {
                                                iziToast.destroy();
                                            }
                                        });
                                    });

                                    // Add last recaped data to last-selected database
                                    localforage.setItem('last-selected', projectContent).then(function (value) {
                                        console.log('last-selected item of database (localforage) updated');
                                    }).catch(function (err) {
                                        // Hide progress bar
                                        $("body").css("cursor", "default");
                                        $(".loader").hide();
                                        // Enable any DIV including its contents.
                                        $(".container_adapter_for_one_page_view").removeClass("disabledbutton");
                                        console.log(err);
                                        iziToast.error({
                                            title: 'Помилка!',
                                            message: 'Дивіться деталі в JavaScript Console.',
                                            position: 'bottomLeft',
                                            onClosed: function () {
                                                iziToast.destroy();
                                            }
                                        });
                                    });
                                })
                        })
                })
        })
}

// Sending to server ------------------------------------------------------------------------------------------------------

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

function forUploadResultListClickAndEnterPressEvents() {

    if ($("#uploadResultList option:selected").text() != "") {
        //clear textArea #text-content
        $textContent.text('');

        objForTree.text = $("#uploadResultList option:selected").text();
        objForTree.nodes.length = 0;

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

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') || alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {
            // inserting terms in tree #term-tree
            if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown')) {

                // add child nodes to template structure for bootstrap-treeview
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)) {
                    for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) {
                        // objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(elementForTermTree)] = { text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname };
                        objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname });
                    }
                }
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) == false) {
                    // objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)] = { text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown].tname };
                    objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown].tname });
                }
            }

            if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {

                // add child nodes to template structure for bootstrap-treeview
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)) {
                    for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) {
                        // objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(elementForTermTree)] = { text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname };
                        objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname });
                    }
                }
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) == false) {
                    // objForTree.nodes[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)] = { text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup].tname };
                    objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup].tname });
                }
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
                }
            }); // add array data to bootstrap-treeview and view it on page
        }

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup') == false && alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') == false) {
            $termTree.treeview({});
        }

        markTerms($("#uploadResultList option:selected").text().replace(/\s?([-])\s?/g, '-'));
    }

}

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

function ClearAllForNewProject() {
    $('option', $uploadResultList).remove();
    $('option', $uploadUnknownTerms).remove();
    $textContent.text('');
    $textareaNotes.val('');
    $('input').val('');
    $termTree.treeview({});
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

// XML to JSON --------------------------------------------------------------------------------------------------------
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
// XML to JSON --------------------------------------------------------------------------------------------------------

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

// CHANGE TABS --------------------------------------------------------------------------------------------------------
$('.nav-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
});

$('a[data-toggle="data"]').on('shown.bs.tab', function (e) {
    if ($("#fileList").is(".tab-pane.active")) {
        document.getElementById("projectFileList").oncontextmenu = function (event) {
            if (event.target.text !== undefined) {
                iziToast.warning({
                    title: 'Видалити документ ' + event.target.text + ' ?',
                    position: 'center',
                    timeout: 10000,
                    buttons: [
                        ['<button>Так</button>', function (instance, toast) {
                            instance.hide({
                                transitionOut: 'fadeOutUp',
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
                        ['<button>Ні</button>', function (instance, toast) {
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
// CHANGE TABS --------------------------------------------------------------------------------------------------------

// mark.js ------------------------------------------------------------------------------------------------------------
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
// mark.js ------------------------------------------------------------------------------------------------------------

// the textarea sutosave ----------------------------------------------------------------------------------------------
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
        iziToast.error({
            title: 'Помилка!',
            message: 'Дивіться деталі в JavaScript Console.',
            position: 'bottomLeft',
            onClosed: function () {
                iziToast.destroy();
            }
        });
    });
}
// the textarea sutosave ----------------------------------------------------------------------------------------------