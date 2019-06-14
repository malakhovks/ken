var $uploadResultList = $("#uploadResultList"),
    $uploadUnknownTerms = $('#uploadUnknownTerms'),
    $projectFileList = $('#projectFileList'),
    $select_block = $('#select-block'),
    $table_block = $('#table-block'),
    $term_table = $("#term-table"),
    tableHeight,
    defaultTableColCount;

//RESIZE_TABLE_AND SELECT-BLOCK______________________________________________________________________


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

//ADD_COL_TO_TABLE___________________________________________________________________________________/
$('#addColsToTable').click(function () {
    ++defaultTableColCount;
    localStorage['defaultTableColCount'] = defaultTableColCount;
    $("#term-table tbody").empty();
    tableCreate();
});

//DEL_COL_IN_TABLE___________________________________________________________________________________/
$('#removeColsFromTable').click(function () {
    if (defaultTableColCount != 1) {
        --defaultTableColCount;
        localStorage['defaultTableColCount'] = defaultTableColCount;
        $("#term-table tbody").empty();
        tableCreate();
    }
});

//ADD_ROW_TO_TABLE___________________________________________________________________________________/
$('#addRowsToTable').click(function () {
    ++tableHeight;
    localStorage['tableHeight'] = tableHeight;
    $("#term-table tbody").empty();
    tableCreate();
});

//DEL_COL_IN_TABLE___________________________________________________________________________________/
$('#removeRowsfromTable').click(function () {
    if (tableHeight != 1) {
        --tableHeight;
        localStorage['tableHeight'] = tableHeight;
        $("#term-table tbody").empty();
        tableCreate();
    }
});

//CLEAR_TABLE_______________________________________________________________________________________/
$('#clear-table').click(function () {

    // clear localStorage for table cells
    var forClearInputs = [].slice.call(document.querySelectorAll("table input"));
    forClearInputs.forEach(function (elm) {
        localStorage.removeItem(elm.id);
    });

    $('input:not([id="recap-upload-button"])').val(''); // Clear all inputs except input with id="recapUploadButton"

    localStorage.removeItem('defaultTableColCount');
    localStorage.removeItem('tableHeight');

    iziToast.info({
        title: 'Таблицю',
        message: 'скинуто',
        position: 'bottomLeft'
    });

    // location.reload();

});

// RESIZE TABLE INPUT WIDTH_______________________________________________________________________________________________/
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

function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

function save_table_to_csv(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (let element of rows) {
        var row = [], cols = element.querySelectorAll("input");
        for (let element of cols) {
            row.push(element.value);
        }
        csv.push(row.join(";"));
    }
    // Download link
    downloadLink = document.createElement("a");
    // Make sure that the link is not displayed
    downloadLink.style.display = "none";
    // Add the link to your DOM
    document.body.appendChild(downloadLink);
    let blob = new Blob([csv.join("\n")], { type: "octet/stream" }),
        url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
}

$('#saveTable').click(function () {
    var html = document.querySelector("table").outerHTML;
    // export_table_to_csv(html, "table.csv");
    save_table_to_csv(html, "table-for-confor-" + getFormattedTime() + ".csv");
});
//SAVE_TABLE_TO_CSV_____________________________________________________________________________________________________