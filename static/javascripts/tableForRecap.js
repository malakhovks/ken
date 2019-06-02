/*

 Saving Selections

 jQuery doesn't cache elements for you. If you've made a selection that you might need to make again,
 you should save the selection in a variable rather than making the selection repeatedly.

 1| var divs = $( "div" );

 Once the selection is stored in a variable, you can call jQuery methods on the variable just
 like you would have called them on the original selection.

 A selection only fetches the elements that are on the page at the time the selection is made.
 If elements are added to the page later, you'll have to repeat the selection or otherwise add them to the selection
 stored in the variable. Stored selections don't magically update when the DOM changes.

 */

var $uploadResultList = $("#uploadResultList"),
    $uploadUnknownTerms = $('#uploadUnknownTerms'),
    $projectFileList = $('#projectFileList'),
    $select_block = $('#select-block'),
    $table_block = $('#table-block'),
    $term_table = $("#term-table"),
    tableHeight,
    defaultTableColCount;

//RESIZE_TABLE_AND SELECT-BLOCK______________________________________________________________________/ Shchurov 30/10/16


document.onload = assignBlockHeight();

function assignBlockHeight() {

    // Resize select-block
    if ($uploadResultList.length) {
        var selectBlockHeight = (Math.floor($select_block.height() / 20)); // 20 - option height
        $select_block.css({"display": "flex", "justify-content": "flex-end"});
        $uploadResultList.prop({'size': selectBlockHeight});
        $uploadUnknownTerms.prop({'size': selectBlockHeight});
        $projectFileList.prop({'size': selectBlockHeight});
    }

    // Resize table-block

    if (localStorage.getItem("defaultTableColCount")) {
        defaultTableColCount = localStorage.getItem("defaultTableColCount");
    } else {
        defaultTableColCount = 6;
    }

    if (localStorage.getItem("tableHeight")) {
        tableHeight = localStorage.getItem("tableHeight");
    } else {
        tableHeight = (Math.floor($table_block.height() / 25) - 2);
    }

    if ($term_table.length) {
        $term_table.prop({'height': tableHeight});

        var tableCellWidth = (Math.floor(($table_block.width() - 50) / (5))); // 25 - width first table col;
        $('#term-table input').css({width: tableCellWidth});
        tableCreate();
    }
}

//CREATE_TABLE__________________________________________________________________________________________________________
function tableCreate() {
    if (("term_table").length) {
        for (var i = 0; i < tableHeight; i++) {
            var row = document.querySelector("table").insertRow(-1);  // создается строка, которая в дальнейшем заполняется и становится частью таблицы
            for (var j = 0; j < defaultTableColCount; j++) {
                if (j == 0) {
                    var letter = String.fromCharCode(' '.charCodeAt(0) + j - 1);  // переменная letter - при определенных условиях может стать контентом будущей ячейки (заполняет паервый столбец и строку)
                }
                else {
                    letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
                }
                row.insertCell(-1).innerHTML = i && j ? "<input type='text' id='" + letter + i + "'/>" : i || letter; // проверка если
            }
        }

        var DATA = {}, INPUTS = [].slice.call(document.querySelectorAll("table input"));
        INPUTS.forEach(function (elm) {
            elm.onfocus = function (e) {
                e.target.value = localStorage[e.target.id] || "";
            };
            elm.onblur = function (e) {
                localStorage[e.target.id] = e.target.value;
                computeAll();
            };
            var getter = function () {
                var value = localStorage[elm.id] || "";
                if (value.charAt(0) == "=") {
                    with (DATA) return eval(value.substring(1));
                } else {
                    return isNaN(parseFloat(value)) ? value : parseFloat(value);
                }
            };
            Object.defineProperty(DATA, elm.id, {get: getter});
            Object.defineProperty(DATA, elm.id.toLowerCase(), {get: getter});

        });
        (window.computeAll = function () {
            INPUTS.forEach(function (elm) {
                try {
                    elm.value = DATA[elm.id];
                } catch (e) {
                }
                resizable(elm, 7);
            });
        })();
    }
}

//ADD_COL_TO_TABLE___________________________________________________________________________________/ Shchurov 11/11/16
$('#addColsToTable').click(function () {
    ++defaultTableColCount;
    localStorage['defaultTableColCount'] = defaultTableColCount;
    $("#term-table tbody").empty();
    tableCreate();
});

//DEL_COL_IN_TABLE___________________________________________________________________________________/ Shchurov 11/11/16
$('#removeColsFromTable').click(function () {
    if (defaultTableColCount != 1) {
        --defaultTableColCount;
        localStorage['defaultTableColCount'] = defaultTableColCount;
        $("#term-table tbody").empty();
        tableCreate();
    }
});

//ADD_ROW_TO_TABLE___________________________________________________________________________________/ Shchurov 11/11/16
$('#addRowsToTable').click(function () {
    ++tableHeight;
    localStorage['tableHeight'] = tableHeight;
    $("#term-table tbody").empty();
    tableCreate();
});

//DEL_COL_IN_TABLE___________________________________________________________________________________/ Shchurov 11/11/16
$('#removeRowsfromTable').click(function () {
    if (tableHeight != 1) {
        --tableHeight;
        localStorage['tableHeight'] = tableHeight;
        $("#term-table tbody").empty();
        tableCreate();
    }
});

//CLEAR_TABLE___________________________________________________________________________________________________________
$('#clear-table').click(function () {

    // clear localStorage for table cells
    var forClearInputs = [].slice.call(document.querySelectorAll("table input"));
    forClearInputs.forEach(function (elm) {
        localStorage.removeItem(elm.id);
    });

    $('input:not([id="recap-upload-button"])').val(''); // Clear all inputs except input with id="recapUploadButton"

    localStorage.removeItem('defaultTableColCount');
    localStorage.removeItem('tableHeight');

    location.reload();
});

// RESIZE TABLE INPUT WIDTH_____________________________________________________________________________________________
function resizable(el, factor) {
    var int = Number(factor) || 7.7;
    // if (el.value == '') {
    // 	el.style.minWidth = el.parentElement.clientWidth + 'px';
    // }
    function resize() {
        el.style.width = ((el.value.length + 1) * int) + 'px'
    }

    var e = 'keyup,keypress,focus,blur,change'.split(',');
    for (var i in e) el.addEventListener(e[i], resize, false);
    resize();
}


//SAVE_TABLE_TO_CSV_____________________________________________________________________________________________________
function download_csv(csv, filename) {
    //var csvFile;
    var downloadLink;

// Отправляю хуйню на сервак, конверчу её там в 1251, сохраняю это в файл
// и отправляю клиенту ссылку на этот файл для скачивания
// иначе никак
// я ебал
    var utf8ToWin1251ApiRequest = $.ajax({
        url: "http://icybcluster.org.ua:32145/recapservice/api/utf8ToWin1251",
        type: 'POST',
        async: true,
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            "query": csv
        },
        success: function (result) {

            // Download link
            downloadLink = document.createElement("a");

            // File name
            downloadLink.download = filename;

            // We have to create a link to the file
            downloadLink.href = result;

            // Make sure that the link is not displayed
            downloadLink.style.display = "none";

            // Add the link to your DOM
            document.body.appendChild(downloadLink);

            // Lanzamos
            downloadLink.click();

        },
        error: function (result) {
            if (utf8ToWin1251ApiRequest.status == 503) {
                alert('Сервіс зайнятий, спробуйте ще раз.' + '\n' + 'Статус: ' + utf8ToWin1251ApiRequest.status);
            } else {
                alert(utf8ToWin1251ApiRequest.getAllResponseHeaders());
                alert(utf8ToWin1251ApiRequest.status);
            }
        }
    });
}

function export_table_to_csv(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (let element of rows) {
        var row = [], cols = element.querySelectorAll("input");
        for (let element of cols) {
            row.push(element.value);
        }
        csv.push(row.join(";"));
    }

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

$('#saveTable').click(function () {
    var html = document.querySelector("table").outerHTML;
    export_table_to_csv(html, "table.csv");
});