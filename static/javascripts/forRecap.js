// variable for value of selected element of #uploadResultList if CTRL+C
valueOfSelectedElementOfUploadResultListIfCtrlC = {
    selectedElementValue: ""
};


//  GLOBAL VARIABLES FOR THIS SCRIPT:
var resJSON,
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
    $saveTerms = $('#saveTerms'),
    $saveNewTerms = $('#saveNewTerms'),
    $saveProjectFileList = $('#saveProjectFileList'),
    $upload_button = $('#upload-button');

$newProjectAndClearAll.click(function () {
    ClearAllForNewProject();
});

$(document).ready(function () {
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


$saveTerms.click(function () {

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

$saveNewTerms.click(function () {

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

$saveProjectFileList.click(function () {

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

        // Очистка списка терминов, поля textArea и input choose file
        $recapOverviewButton.val("");
        $('option', $uploadResultList).remove();
        $('option', $uploadUnknownTerms).remove();
        $textContent.text('');


        if (self.fetch) {

            fetch('/ken/api/v1.0/en/file/allterms', {
                method: 'post',
                body: form
            })
                .then(function (response) {

                    if (response.status == 503) {
                        $("body").css("cursor", "default");
                        alert('Сервіс зайнятий, спробуйте ще раз.' + '\n' + 'Статус: ' + response.status);
                        return;
                    }
                    // return response.json().then(function (result) {
                    return response.text().then(function (result) {

                        dom = new DOMParser().parseFromString(result, "text/xml");
                        resJSON = xmlToJson(dom);
                        console.log(JSON.stringify(resJSON));

                        // add to local storage recap of the last uploaded file
                        localStorage["recapForLastFile"] = JSON.stringify(resJSON);
                        // add to local storage recap of the last uploaded file

                        // add to local storage recap of this file for #projectFileList
                        localStorage[uploadFileName.split('\\').pop()] = JSON.stringify(resJSON);

                        for (let elementKnownTxtJson of resJSON.termsintext.exporterms.term) {
                            termsWithIndexDict[elementKnownTxtJson.tname] = resJSON.termsintext.exporterms.term.indexOf(elementKnownTxtJson); // for dictionary structure
                            $uploadResultList.append($('<option>', {
                                value: elementKnownTxtJson.tname,
                                text: elementKnownTxtJson.tname
                            }));
                        }

                        // hide progress bar
                        $("body").css("cursor", "default");
                    });
                })
                .catch(function (error) {
                    $("body").css("cursor", "default");
                    alert('Виникла помилка на стороні серевера.' + '\n' + 'Помилка: ' + error + '\n' + ' Cпробуйте ще раз.');
                });

        } else {
            alert('Ваш браузер застарів. Встановіть актуальну версію Google Chrome');
        }
    }
}

function forUploadResultListClickAndEnterPressEvents() {

    //clear textArea #textContent
    $textContent.text('');

    var valOfSelectedElementInUploadResultList = termsWithIndexDict[$uploadResultList.prop('value')];

    // inserting sentences with selected terms in textArea #textContent
    if (Array.isArray(resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos)) {
        for (let elementForUploadResultListDbClickAndEnterPress of resJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) {
            $textContent.append('\n' + resJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/")) - 1] + '\n');
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

    // Highlight-within-textarea
    // https://github.com/lonekorean/highlight-within-textarea

    function onInput(input) {
        //return /\d+/g; // highlight all digits
        var regex = new RegExp($uploadResultList.prop('value').substring(0, 4), 'gi');
        return regex;
    }
    $textContent.highlightWithinTextarea(onInput);
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

        alert('Разбор файлу "' + $projectFileList.prop('value') + '" завантажено');

    } else {
        alert('Разбору файлу "' + $projectFileList.prop('value') + '" не існує');
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

// CHANGE TABS
$('.nav-tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
});