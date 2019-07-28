// variable for value of selected element of #uploadResultList if CTRL+C
valueOfSelectedElementOfUploadResultListIfCtrlC = {
    selectedElementValue: ""
};


//  GLOBAL VARIABLES FOR THIS SCRIPT:
var resJSON,
    resParceJSON,
    termsWithIndexDict = {},
    fileNamesForProjectFileListAndLocalStorage = { fileNamesArray: [] },
    treeData = [], // for bootstrap-treeview
    objForTree = {}, // for bootstrap-treeview
    keyC = 67, // Javascript Char Code (Key Code) for "C" key
    keyEnter = 13; // Javascript Char Code (Key Code) for "Enter" key

var $newProjectAndClearAll = $('#newProjectAndClearAll'),
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
    $upload_button = $('#upload-button'),
    $sents_from_text = $('#sents_from_text'),
    $sortSelect = $('#sort-select');

$newProjectAndClearAll.click(function () {
    iziToast.warning({
        title: 'Ви впевнені?',
        message: 'Це призведе до видалення всіх даних і встановлення налаштувань за замовчуванням.',
        position: 'center',
        timeout: 10000,
        buttons: [
            ['<button>Так</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    onClosing: function (instance, toast, closedBy) {
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

$(document).ready(function () {
    // Load last recapped file data
    if (localStorage.getItem("recapForLastFile")) {
        // set #sort-select to order type 4
        $sortSelect.val('4');
        console.log("Load last recapped file data");
        resJSON = JSON.parse(localStorage.getItem("recapForLastFile"));

        // for known words ES 6
        for (let element of resJSON.termsintext.exporterms.term) {
            termsWithIndexDict[element.tname] = resJSON.termsintext.exporterms.term.indexOf(element);
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
        for (let sent_element of resJSON.termsintext.sentences.sent) {
            $sents_from_text.append('<p>' + sent_element + '</p><br>')
        }

    }

    if (localStorage.getItem("projectFiles")) {
        fileNamesForProjectFileListAndLocalStorage = JSON.parse(localStorage.getItem("projectFiles"));
        for (let projectFilesElement of fileNamesForProjectFileListAndLocalStorage.fileNamesArray) {
            $projectFileList.append($('<option>', {
                value: projectFilesElement.unique,
                text: truncate(projectFilesElement.unique, 30),
                title: projectFilesElement.original
            }));
        }
    }

    $("#displacy").hide();
    $("#displacy-ner").hide();

    iziToast.info({
        title: 'Вітаємо!',
        message: 'Оберіть файл для аналізу (pdf, txt, docx)',
        position: 'bottomLeft'
    });

});

// extract terms from text button #recapUploadButton click event
$('#recap-upload-button').click(function () {
    //sendFileToRecapService();
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
    downloadLink.download = $captionOverviewButton.text() + '.txt';
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
    downloadLink.download = $captionOverviewButton.text() + '.txt';
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

    var originalAndUniqueFilenames = { original: uploadFileName, unique: uniqueUploadFilename };

    form.append("file", $recapOverviewButton[0].files[0]);

    if (uploadFileName.indexOf(txtExtension) != -1 || uploadFileName.indexOf(docxExtension) || uploadFileName.indexOf(pdfExtension)) {

        // Show progress bar
        $("body").css("cursor", "progress");
        $(".loader").show();

        iziToast.info({
            title: 'Зачекайте! Аналіз файлу',
            message: uploadFileName.split('\\').pop(),
            position: 'bottomLeft',
            close: false,
            timeout: false
        });

        fileNamesForProjectFileListAndLocalStorage.fileNamesArray.push(originalAndUniqueFilenames);

        $projectFileList.append($('<option>', {
            value: originalAndUniqueFilenames.unique,
            text: truncate(originalAndUniqueFilenames.unique, 30),
            title: originalAndUniqueFilenames.original
        }));

        localStorage['projectFiles'] = JSON.stringify(fileNamesForProjectFileListAndLocalStorage);
        //add filename to localStorage and projectFileList

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
                        $("body").css("cursor", "default");
                        $(".loader").hide();
                        $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
                        iziToast.warning({
                            title: 'Сервіс зайнятий, спробуйте ще раз.',
                            message: 'Статус: ' + response.status,
                            position: 'bottomLeft',
                            onClosed: function () {
                                iziToast.destroy();
                            }
                        });
                        return;
                    }

                    return response.text().then(result => {

                        dom = new DOMParser().parseFromString(result, "text/xml");
                        resJSON = xmlToJson(dom);

                        // set #sort-select to order type 4
                        $sortSelect.val('4');

                        // add to local storage recap of the last uploaded file
                        localStorage["recapForLastFile"] = JSON.stringify(resJSON);

                        // add to local storage recap of this file for #projectFileList
                        localStorage[uniqueUploadFilename] = JSON.stringify(resJSON);

                        for (let elementKnownTxtJson of resJSON.termsintext.exporterms.term) {
                            termsWithIndexDict[elementKnownTxtJson.tname] = resJSON.termsintext.exporterms.term.indexOf(elementKnownTxtJson); // for dictionary structure
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
                        for (let sent_element of resJSON.termsintext.sentences.sent) {
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
                                resParceJSON = xmlToJson(dom);

                                for (let sentElement of resParceJSON.text.sentence) {

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

                    sentencesData = JSON.stringify(Object.values(resJSON.termsintext.sentences.sent));

                    return fetch('/ken/api/en/html/ner', {
                        method: 'post',
                        body: sentencesData
                    })
                        .then(response => {
                            return response.text().then(function (result) {
                                // htmlWithNER = new DOMParser().parseFromString(result, "text/html");
                                annotation = '<center><p><a target="_blank" href="https://spacy.io/api/annotation#named-entities">Named Entity Recognition annotations</a></p></center>'
                                // $('#displacy-ner').html(annotation + result);
                                $('#displacy-ner').html(result);
                                $("body").css("cursor", "default");
                                $(".loader").hide();
                                iziToast.success({
                                    title: 'OK',
                                    message: 'Обробка файлу виконана',
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
                    $("body").css("cursor", "default");
                    $(".loader").hide();
                    $("#projectFileList option[value='" + uniqueUploadFilename + "']").remove();
                    iziToast.warning({
                        title: 'Помилка',
                        message: 'Виникла помилка на стороні серевера 500',
                        position: 'bottomLeft',
                        onClosed: function () {
                            iziToast.destroy();
                        }
                    });
                });

        } else {
            iziToast.warning({
                title: 'Ваш браузер застарів.',
                message: 'Встановіть актуальну версію Google Chrome.',
                position: 'bottomLeft',
                onClosed: function () {
                    iziToast.destroy();
                }
            });
        }
    }
}

function forUploadResultListClickAndEnterPressEvents() {

    //clear textArea #text-content
    $textContent.text('');

    var valOfSelectedElementInUploadResultList = termsWithIndexDict[$("#uploadResultList option:selected").text()];

    // inserting sentences with selected terms in #text-content
    if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos)) {
        let sentIndex = [];
        let sentsForMark = [];
        for (let elementForUploadResultListDbClickAndEnterPress of resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) {
            if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1))) {
                $textContent.append('<p>' + resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1] + '</p><br>');
                sentsForMark.push(resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1]);
                sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1));
            }
        }
        mark(sentsForMark);
    }

    if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) == false) {

        $textContent.append('<p>' + resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/")) - 1] + '<p><br>');

        mark(resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/")) - 1]);
    }

    // inserting terms in tree #term-tree
    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown')) {

        //template structure for bootstrap-treeview
        objForTree = { text: $("#uploadResultList option:selected").text(), nodes: [] };

        // add child nodes to template structure for bootstrap-treeview
        if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)) {
            for (let elementForTermTree of resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) {
                objForTree.nodes[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(elementForTermTree)] = { text: resJSON.termsintext.exporterms.term[elementForTermTree - 1].tname };
            }
        }
        if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) == false) {
            objForTree.nodes[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown.indexOf(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)] = { text: resJSON.termsintext.exporterms.term[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown - 1].tname };
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
                if (Array.isArray(resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) == false) {

                    $textContent.append('<p>' + resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/")) - 1] + '<p><br>');

                    mark(resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/")) - 1]);
                }
                if (Array.isArray(resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos)) {
                    let sentIndex = [];
                    let sentsForMark = [];
                    for (let elementForUploadResultListDbClickAndEnterPress of resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) {
                        if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1))) {
                            $textContent.append('<p>' + resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1] + '</p><br>');
                            sentsForMark.push(resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1]);
                            sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1));
                        }
                    }
                    mark(sentsForMark);
                }
                markTerms(node.text);
            }
        }); // add array data to bootstrap-treeview and view it on page
    }

    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {

        //template structure for bootstrap-treeview
        objForTree = { text: $("#uploadResultList option:selected").text(), nodes: [] };

        // add child nodes to template structure for bootstrap-treeview
        if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)) {
            for (let elementForTermTree of resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) {
                objForTree.nodes[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(elementForTermTree)] = { text: resJSON.termsintext.exporterms.term[elementForTermTree - 1].tname };
            }
        }
        if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) == false) {
            objForTree.nodes[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup.indexOf(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)] = { text: resJSON.termsintext.exporterms.term[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup - 1].tname };
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
                if (Array.isArray(resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) == false) {

                    $textContent.append('<p>' + resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/")) - 1] + '<p><br>');

                    mark(resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/")) - 1]);
                }
                if (Array.isArray(resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos)) {
                    let sentIndex = [];
                    let sentsForMark = [];
                    for (let elementForUploadResultListDbClickAndEnterPress of resJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) {
                        if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1))) {
                            $textContent.append('<p>' + resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1] + '</p><br>');
                            sentsForMark.push(resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1]);
                            sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1));
                        }
                    }
                    mark(sentsForMark);
                }
                markTerms(node.text);
            }
        }); // add array data to bootstrap-treeview and view it on page
    }

    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup') == false && resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') == false) {
        $termTree.treeview({});
    }

    markTerms($("#uploadResultList option:selected").text().replace(/\s?([-])\s?/g, '-'));

    // visualize noun chunk / term
    let displacy = new displaCy('/ken/api/en/html/depparse/nounchunk', {
        container: '#displacy'
    });
    displacy.parse($("#uploadResultList option:selected").text());
}

function forProjectFileListClickAndEnterPressEvents() {

    console.log('fileName: ' + $projectFileList.prop('value'));

    if (localStorage.getItem($projectFileList.prop('value'))) {

        resJSON = JSON.parse(localStorage.getItem($projectFileList.prop('value')));
        // add to local storage recap of the last uploaded file
        localStorage["recapForLastFile"] = JSON.stringify(resJSON);
        $('option', $uploadResultList).remove();
        $('option', $uploadUnknownTerms).remove();
        $("#displacy-ner").empty();
        $textContent.text('');
        $termTree.treeview({});

        $captionOverviewButton.text(truncate($projectFileList.find("option:selected").attr("title"), 20));

        // set #sort-select to order type 4
        $sortSelect.val('4');
        // for known words ES 6
        for (let element of resJSON.termsintext.exporterms.term) {
            termsWithIndexDict[element.tname] = resJSON.termsintext.exporterms.term.indexOf(element);

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
        for (let sent_element of resJSON.termsintext.sentences.sent) {
            $sents_from_text.append('<p>' + sent_element + '</p><br>')
        }

        iziToast.info({
            title: 'Разбор файлу',
            message: $projectFileList.prop('value') + ' завантажено!',
            position: 'bottomLeft'
        });

    } else {
        iziToast.warning({
            title: 'Разбор файлу',
            message: $projectFileList.prop('value') + ' не існує!',
            position: 'bottomLeft'
        });
    }

}

function ClearAllForNewProject() {
    $('option', $uploadResultList).remove();
    $('option', $uploadUnknownTerms).remove();
    $textContent.text('');
    localStorage.clear();
    $('input').val('');
    $termTree.treeview({});
    $("#displacy").empty();
    $("#displacy-ner").empty();
    location.reload();
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
        $("#displacy-label").html('<center>Візуалізація іменованих сутностей <a target="_blank" href="https://spacy.io/api/annotation#named-entities">(список анотацій)</a></center>');
        $("#displacy-label").show();
    }
    if ($("#term_tab").is(".tab-pane.active")) {
        $("#displacy").show();
        $("#displacy-ner").hide();
        $("#displacy-label").html('<center>Візуалізація залежностей термінів <a target="_blank" href="https://spacy.io/api/annotation#dependency-parsing">(список анотацій)</a></center>');
        $("#displacy-label").show();
    }
    if ($("#text_tab").is(".tab-pane.active")) {
        $("#displacy").hide();
        $("#displacy-ner").hide();
        $("#displacy-label").hide();
    }
    if ($("#fileList").is(".tab-pane.active")) {
        document.getElementById("projectFileList").oncontextmenu = function (event) {
            iziToast.warning({
                title: 'Ви впевнені?',
                message: ' Видалити файл ' + event.target.text + ' ?',
                position: 'center',
                timeout: 10000,
                buttons: [
                    ['<button>Так</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'fadeOutUp',
                            onClosing: function (instance, toast, closedBy) {
                                if (localStorage.getItem("projectFiles")) {
                                    let projectFilesListLS = JSON.parse(localStorage.getItem("projectFiles"));
                                    // let filtered = projectFilesListLS.fileNamesArray.filter(function(el) { return el.unique != $projectFileList.prop('value'); });
                                    let filtered = projectFilesListLS.fileNamesArray.filter(function (el) { return el.unique != event.target.value; });
                                    localStorage.setItem("projectFiles", JSON.stringify({ fileNamesArray: filtered }));
                                    // $('#projectFileList option:selected').remove();
                                    $("#projectFileList option[value='" + event.target.value + "']").remove();
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
        // Load last recapped file data
        if (localStorage.getItem("recapForLastFile")) {
            resJSON = JSON.parse(localStorage.getItem("recapForLastFile"));

            // for known words ES 6
            for (let element of resJSON.termsintext.exporterms.term) {
                termsWithIndexDict[element.tname] = resJSON.termsintext.exporterms.term.indexOf(element);
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