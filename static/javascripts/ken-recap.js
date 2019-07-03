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
    $sents_from_text = $('#sents_from_text');

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
        console.log("Load last recapped file data");
        resJSON = JSON.parse(localStorage.getItem("recapForLastFile"));

        // for known words ES 6
        for (let element of resJSON.termsintext.exporterms.term) {
            termsWithIndexDict[element.tname] = resJSON.termsintext.exporterms.term.indexOf(element);
            $uploadResultList.append($('<option>', {
                value: element.tname,
                text: element.tname
            }));
        }

        // add text from last recapped file to textarea id="sents_from_text"
        // Clear textarea id="sents_from_text"
        $sents_from_text.text('');
        // add to textarea id="sents_from_text"
        for (let sent_element of resJSON.termsintext.sentences.sent) {
            $sents_from_text.append(sent_element + '\n\n')
        }

    }

    if (localStorage.getItem("projectFiles")) {
        fileNamesForProjectFileListAndLocalStorage = JSON.parse(localStorage.getItem("projectFiles"));
        for (let projectFilesElement of fileNamesForProjectFileListAndLocalStorage.fileNamesArray) {
            $projectFileList.append($('<option>', {
                value: projectFilesElement,
                text: truncate(projectFilesElement, 10)
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
    forUploadResultListClickAndEnterPressEvents();
});

// event on pressing enter key on selected element of #uploadResultList
$uploadResultList.keypress(function (event) {
    let key = event.which;
    if (key == keyEnter)  // the enter key code
    {
        forUploadResultListClickAndEnterPressEvents();
    }
});

/* event on pressing Ctrl+C on selected element of #uploadResultList COPY TO CLIPBOARD
dynamically created INPUT element, variable content passed to the INPUT element value,
and use execCommand("copy") the contents of the command INPUT element is copied to the clipboard.
INPUT element dynamically removed */
$uploadResultList.keydown(function (e) {
    if (e.keyCode == keyC && e.ctrlKey) {

        let copyCommandSupported = document.queryCommandSupported('copy');

        if (copyCommandSupported) {

            valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue = $uploadResultList.prop('value');

            let $temp = $("<input>");
            $("body").append($temp);
            $temp.val(valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue).select();
            document.execCommand("copy");
            $temp.remove();

        }
    }
});

$uploadUnknownTerms.keydown(function (e) {
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
});

$projectFileList.click(function () {
    forProjectFileListClickAndEnterPressEvents();
});

$projectFileList.keydown(function (e) {
    if (e.keyCode == keyC && e.ctrlKey) {

        let copyCommandSupported = document.queryCommandSupported('copy');

        if (copyCommandSupported) {

            valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue = $projectFileList.prop('value');

            let $temp = $("<input>");
            $("body").append($temp);
            $temp.val(valueOfSelectedElementOfUploadResultListIfCtrlC.selectedElementValue).select();
            document.execCommand("copy");
            $temp.remove();

        }
    }
});

// change p#caption_overview_button caption with filename that selected
// and clear all elements
$recapOverviewButton.change(function () {
    $captionOverviewButton.text(truncate($recapOverviewButton.val().split('\\').pop(), 10));
    $termTree.treeview({});
    $upload_button.css('display', 'block');
    $('option', $uploadResultList).remove();
    $('option', $uploadUnknownTerms).remove();
    $textContent.text('');
    if ($textContent.data('hwt')) {
        $textContent.data('hwt').destroy();
    }
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

    var uploadFileName = $recapOverviewButton.val(),
        form = new FormData();

    form.append("file", $recapOverviewButton[0].files[0]);

    if (uploadFileName.indexOf(txtExtension) != -1 || uploadFileName.indexOf(docxExtension) || uploadFileName.indexOf(pdfExtension)) {

        // Show progress bar
        $("body").css("cursor", "progress");
        $(".loader").show();
        iziToast.info({
            title: 'Аналіз файлу',
            message: $recapOverviewButton.val().split('\\').pop(),
            position: 'bottomLeft'
        });

        //add filename to localStorage and projectFileList
        if (fileNamesForProjectFileListAndLocalStorage.fileNamesArray.length > 0) {
            fileNamesForProjectFileListAndLocalStorage.fileNamesArray[fileNamesForProjectFileListAndLocalStorage.fileNamesArray.length] = $recapOverviewButton.val().split('\\').pop();
            $projectFileList.append($('<option>', {
                value: $recapOverviewButton.val().split('\\').pop(),
                text: truncate($recapOverviewButton.val().split('\\').pop(), 10)
            }));
        } else {
            fileNamesForProjectFileListAndLocalStorage.fileNamesArray[0] = $recapOverviewButton.val().split('\\').pop();
            $projectFileList.append($('<option>', {
                value: $recapOverviewButton.val().split('\\').pop(),
                text: truncate($recapOverviewButton.val().split('\\').pop(), 10)
            }));
        }
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

            fetch('/ken/api/v1.0/en/file/allterms', {
                method: 'post',
                body: form
            })
                .then(response => {

                    if (response.status == 503) {
                        $("body").css("cursor", "default");
                        $(".loader").hide();
                        iziToast.warning({
                            title: 'Сервіс зайнятий, спробуйте ще раз.',
                            message: 'Статус: ' + response.status,
                            position: 'bottomLeft'
                        });
                        return;
                    }

                    return response.text().then(result => {

                        dom = new DOMParser().parseFromString(result, "text/xml");
                        resJSON = xmlToJson(dom);

                        // add to local storage recap of the last uploaded file
                        localStorage["recapForLastFile"] = JSON.stringify(resJSON);

                        // add to local storage recap of this file for #projectFileList
                        localStorage[uploadFileName.split('\\').pop()] = JSON.stringify(resJSON);

                        for (let elementKnownTxtJson of resJSON.termsintext.exporterms.term) {
                            termsWithIndexDict[elementKnownTxtJson.tname] = resJSON.termsintext.exporterms.term.indexOf(elementKnownTxtJson); // for dictionary structure
                            $uploadResultList.append($('<option>', {
                                value: elementKnownTxtJson.tname,
                                text: elementKnownTxtJson.tname
                            }));
                        }

                        // Clear textarea id="sents_from_text"
                        $sents_from_text.text('');
                        // add to textarea id="sents_from_text"
                        for (let sent_element of resJSON.termsintext.sentences.sent) {
                            $sents_from_text.append(sent_element + '\n\n')
                        }
                    });
                })
                // fetch to parce.xml for NER
                .then(next => {
                    return fetch('/ken/api/v1.0/en/file/parcexml', {
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
                // fetch to /ken/api/v1.0/en/html/ner for NER
                .then(next => {

                    sentencesData = JSON.stringify(Object.values(resJSON.termsintext.sentences.sent));

                    return fetch('/ken/api/v1.0/en/html/ner', {
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
                                    position: 'bottomLeft'
                                });
                            });
                        })
                })
                .catch(error => {
                    $("body").css("cursor", "default");
                    $(".loader").hide();
                    iziToast.warning({
                        title: 'Помилка',
                        message: 'Виникла помилка на стороні серевера ' + error,
                        position: 'bottomLeft'
                    });
                });

        } else {
            iziToast.warning({
                title: 'Ваш браузер застарів.',
                message: 'Встановіть актуальну версію Google Chrome.',
                position: 'bottomLeft'
            });
        }
    }
}

function forUploadResultListClickAndEnterPressEvents() {

    //clear textArea #textContent
    $textContent.text('');

    var valOfSelectedElementInUploadResultList = termsWithIndexDict[$uploadResultList.prop('value')];

    // inserting sentences with selected terms in textArea #textContent
    if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos)) {
        let sentIndex = [];
        for (let elementForUploadResultListDbClickAndEnterPress of resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) {
            if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1))) {
                $textContent.append('\n' + resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1] + '\n');
                sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1));
            }
        }
    }

    if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) == false) {

        $textContent.append('\n' + resJSON.termsintext.sentences.sent[resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/")) - 1] + '\n');
    }

    // inserting terms in tree #termTree
    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown')) {

        //template structure for bootstrap-treeview
        objForTree = { text: $uploadResultList.prop('value'), nodes: [] };

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

        $termTree.treeview({ data: treeData }); // add array data to bootstrap-treeview and view it on page
    }

    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {

        //template structure for bootstrap-treeview
        objForTree = { text: $uploadResultList.prop('value'), nodes: [] };

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

        $termTree.treeview({ data: treeData }); // add array data to bootstrap-treeview and view it on page
    }

    if (resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup') == false && resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') == false) {
        $termTree.treeview({});
    }

    // Highlight-within-textarea
    // https://github.com/lonekorean/highlight-within-textarea

    // function onInput(input) {
    //     //return /\d+/g; // highlight all digits
    //     var regex = new RegExp($uploadResultList.prop('value').substring(0, 4), 'gi');
    //     return regex;
    // }
    // $textContent.highlightWithinTextarea(onInput);

    function onInput(input) {
        let term = $uploadResultList.prop('value').replace(/\s?([-])\s?/g,'-');
        var regex = new RegExp('\\b(\\w*' + term + '\\w*)\\b', 'gi');
        return regex;
    }
    $textContent.highlightWithinTextarea(onInput);

/*     function multiSearchOr(text, searchWord) {
        var regex = RegExp('\\b(\\w*' + searchWord + '\\w*)\\b', 'ig');
        let m;
        let foundWords = [];
        while ((m = regex.exec(text)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(match);
                foundWords.push(match)
            });
        }
        return foundWords[0];
    } */


    // visualize noun chunk / term
    let displacy = new displaCy('/ken/api/v1.0/en/html/depparse/nounchunk', {
        container: '#displacy'
    });
    displacy.parse($uploadResultList.prop('value'));
}

function forProjectFileListClickAndEnterPressEvents() {

    console.log('fileName: ' + $projectFileList.prop('value'));

    if (localStorage.getItem($projectFileList.prop('value'))) {

        resJSON = JSON.parse(localStorage.getItem($projectFileList.prop('value')));
        $('option', $uploadResultList).remove();
        $('option', $uploadUnknownTerms).remove();
        $textContent.text('');
        if ($textContent.data('hwt')) {
            $textContent.data('hwt').destroy();
        }
        //$textContent.data('hwt').destroy();
        $termTree.treeview({});

        $captionOverviewButton.text(truncate($projectFileList.prop('value'), 10));

        // for known words ES 6
        for (let element of resJSON.termsintext.exporterms.term) {
            termsWithIndexDict[element.tname] = resJSON.termsintext.exporterms.term.indexOf(element);
            $uploadResultList.append($('<option>', {
                value: element.tname,
                text: element.tname
            }));
        }

        // add text from last recapped file to textarea id="sents_from_text"
        // Clear textarea id="sents_from_text"
        $sents_from_text.text('');
        // add to textarea id="sents_from_text"
        for (let sent_element of resJSON.termsintext.sentences.sent) {
            $sents_from_text.append(sent_element + '\n\n')
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
    if ($textContent.data('hwt')) {
        $textContent.data('hwt').destroy();
    }
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

/* function getLanguage(ofText) {
    let text = 'https://translate.yandex.net/api/v1.5/tr.json/detect?hint=ru,en&key=trnsl.1.1.20160517T143002Z.e9fc37c7a484c5f4.8cba036cc3eb084c401f3766ed5b2b389b6dc9fc&text=' + ofText;
    if (self.fetch) {
        fetch(text, {
            method: 'post'
        })
            .then(function (response) {
                return response.json().then(function (result) {
                    // langField.innerHTML = result.lang;
                    console.log(result.lang);
                })
            })
            .catch(function (error) {
                alert('Виникла помилка на стороні серевера.' + '\n' + 'Помилка: ' + error + '\n' + ' Cпробуйте ще раз.');
            });
    } else {
        alert('Ваш браузер застарів. Встановіть актуальну версію Google Chrome');
    }
} */

// CHANGE TABS
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
});