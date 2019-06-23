var $uploadResultList = $("#uploadResultList"),
    $uploadUnknownTerms = $('#uploadUnknownTerms'),
    $projectFileList = $('#projectFileList'),
    $select_block = $('#select-block'),
    $table_block = $('#table-block'),
    $term_table = $("#term-table"),
    tableHeight,
    defaultTableColCount;

document.onload = assignBlockHeight();

function assignBlockHeight() {

    // Resize select-block
    if ($uploadResultList.length) {
        var selectBlockHeight = (Math.floor($select_block.height() / 20)); // 20 - option height
        $select_block.css({ "display": "flex", "justify-content": "flex-end" });
        $uploadResultList.prop({ 'size': selectBlockHeight });
        $uploadUnknownTerms.prop({ 'size': selectBlockHeight });
        $projectFileList.prop({ 'size': selectBlockHeight });
    }
}

let defaultRowCount = 40; // No of rows
let defaultColCount = 10; // No of cols
const SPREADSHEET_DB = "spreadsheet_db";

initializeData = () => {
    // console.log("initializeData");
    const data = [];
    for (let i = 0; i <= defaultRowCount; i++) {
        const child = [];
        for (let j = 0; j <= defaultColCount; j++) {
            child.push("");
        }
        data.push(child);
    }
    return data;
};

getData = () => {
    let data = localStorage.getItem(SPREADSHEET_DB);
    if (data === undefined || data === null) {
        return initializeData();
    }
    return JSON.parse(data);
};

saveData = data => {
    localStorage.setItem(SPREADSHEET_DB, JSON.stringify(data));
};

resetData = data => {
    localStorage.removeItem(SPREADSHEET_DB);
    this.createSpreadsheet();
};

createHeaderRow = () => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", "h-0");
    for (let i = 0; i <= defaultColCount; i++) {
        const th = document.createElement("th");
        th.setAttribute("id", `h-0-${i}`);
        th.setAttribute("class", `${i === 0 ? "" : "column-header"}`);
        // th.innerHTML = i === 0 ? `` : `Col ${i}`;
        if (i !== 0) {
            const span = document.createElement("span");
            span.innerHTML = `Col ${i}`;
            span.setAttribute("class", "column-header-span");
            const dropDownDiv = document.createElement("div");
            dropDownDiv.setAttribute("class", "dropdown");
            dropDownDiv.innerHTML = `<button class="dropbtn" id="col-dropbtn-${i}">+</button>
        <div id="col-dropdown-${i}" class="dropdown-content">
          <p class="col-insert-left">+ ліворуч</p>
          <p class="col-insert-right">+ праворуч</p>
          <p class="col-delete">Видалити</p>
        </div>`;
            th.appendChild(span);
            th.appendChild(dropDownDiv);
        }
        tr.appendChild(th);
    }
    return tr;
};

createTableBodyRow = rowNum => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", `r-${rowNum}`);
    for (let i = 0; i <= defaultColCount; i++) {
        const cell = document.createElement(`${i === 0 ? "th" : "td"}`);
        if (i === 0) {
            cell.contentEditable = false;
            const span = document.createElement("span");
            const dropDownDiv = document.createElement("div");
            // lable of row
            span.innerHTML = `${rowNum}`;
            dropDownDiv.setAttribute("class", "dropdown");
            dropDownDiv.innerHTML = `<button class="dropbtn" id="row-dropbtn-${rowNum}">+</button>
        <div id="row-dropdown-${rowNum}" class="dropdown-content">
          <p class="row-insert-top">+ вище</p>
          <p class="row-insert-bottom">+ нижче</p>
          <p class="row-delete">Видалити</p>
        </div>`;
            cell.appendChild(span);
            cell.appendChild(dropDownDiv);
            cell.setAttribute("class", "row-header");
        } else {
            cell.contentEditable = true;
        }
        cell.setAttribute("id", `r-${rowNum}-${i}`);
        // cell.id = `${rowNum}-${i}`;
        tr.appendChild(cell);
    }
    return tr;
};

createTableBody = tableBody => {
    for (let rowNum = 1; rowNum <= defaultRowCount; rowNum++) {
        tableBody.appendChild(this.createTableBodyRow(rowNum));
    }
};

// Fill Data in created table from localstorage
populateTable = () => {
    const data = this.getData();
    if (data === undefined || data === null) return;

    for (let i = 1; i < data.length; i++) {
        for (let j = 1; j < data[i].length; j++) {
            const cell = document.getElementById(`r-${i}-${j}`);
            cell.innerHTML = data[i][j];
        }
    }
};

// Utility function to add row
addRow = (currentRow, direction) => {
    let data = this.getData();
    const colCount = data[0].length;
    const newRow = new Array(colCount).fill("");
    if (direction === "top") {
        data.splice(currentRow, 0, newRow);
    } else if (direction === "bottom") {
        data.splice(currentRow + 1, 0, newRow);
    }
    defaultRowCount++;
    saveData(data);
    this.createSpreadsheet();
};

// Utility function to delete row
deleteRow = currentRow => {
    let data = this.getData();
    data.splice(currentRow, 1);
    defaultRowCount++;
    saveData(data);
    this.createSpreadsheet();
};

// Utility function to add columns
addColumn = (currentCol, direction) => {
    let data = this.getData();
    for (let i = 0; i <= defaultRowCount; i++) {
        if (direction === "left") {
            data[i].splice(currentCol, 0, "");
        } else if (direction === "right") {
            data[i].splice(currentCol + 1, 0, "");
        }
    }
    defaultColCount++;
    saveData(data);
    this.createSpreadsheet();
};

// Utility function to delete column
deleteColumn = currentCol => {
    let data = this.getData();
    for (let i = 0; i <= defaultRowCount; i++) {
        data[i].splice(currentCol, 1);
    }
    defaultColCount++;
    saveData(data);
    this.createSpreadsheet();
};

// Map for storing the sorting history of every column;
const sortingHistory = new Map();

// Utility function to sort columns
sortColumn = currentCol => {
    let spreadSheetData = this.getData();
    let data = spreadSheetData.slice(1);
    if (!data.some(a => a[currentCol] !== "")) return;
    if (sortingHistory.has(currentCol)) {
        const sortOrder = sortingHistory.get(currentCol);
        switch (sortOrder) {
            case "desc":
                data.sort(ascSort.bind(this, currentCol));
                sortingHistory.set(currentCol, "asc");
                break;
            case "asc":
                data.sort(dscSort.bind(this, currentCol));
                sortingHistory.set(currentCol, "desc");
                break;
        }
    } else {
        data.sort(ascSort.bind(this, currentCol));
        sortingHistory.set(currentCol, "asc");
    }
    data.splice(0, 0, new Array(data[0].length).fill(""));
    saveData(data);
    this.createSpreadsheet();
};

// Compare Functions for sorting - ascending
const ascSort = (currentCol, a, b) => {
    let _a = a[currentCol];
    let _b = b[currentCol];
    if (_a === "") return 1;
    if (_b === "") return -1;

    // Check for strings and numbers
    if (isNaN(_a) || isNaN(_b)) {
        _a = _a.toUpperCase();
        _b = _b.toUpperCase();
        if (_a < _b) return -1;
        if (_a > _b) return 1;
        return 0;
    }
    return _a - _b;
};

// Descending compare function
const dscSort = (currentCol, a, b) => {
    let _a = a[currentCol];
    let _b = b[currentCol];
    if (_a === "") return 1;
    if (_b === "") return -1;

    // Check for strings and numbers
    if (isNaN(_a) || isNaN(_b)) {
        _a = _a.toUpperCase();
        _b = _b.toUpperCase();
        if (_a < _b) return 1;
        if (_a > _b) return -1;
        return 0;
    }
    return _b - _a;
};

createSpreadsheet = () => {
    const spreadsheetData = this.getData();
    defaultRowCount = spreadsheetData.length - 1 || defaultRowCount;
    defaultColCount = spreadsheetData[0].length - 1 || defaultColCount;

    const tableHeaderElement = document.getElementById("table-headers");
    const tableBodyElement = document.getElementById("table-body");

    const tableBody = tableBodyElement.cloneNode(true);
    tableBodyElement.parentNode.replaceChild(tableBody, tableBodyElement);
    const tableHeaders = tableHeaderElement.cloneNode(true);
    tableHeaderElement.parentNode.replaceChild(tableHeaders, tableHeaderElement);

    tableHeaders.innerHTML = "";
    tableBody.innerHTML = "";

    tableHeaders.appendChild(createHeaderRow(defaultColCount));
    createTableBody(tableBody, defaultRowCount, defaultColCount);

    populateTable();

    // attach focusout event listener to whole table body container
    tableBody.addEventListener("focusout", function (e) {
        if (e.target && e.target.nodeName === "TD") {
            let item = e.target;
            const indices = item.id.split("-");
            let spreadsheetData = getData();
            spreadsheetData[indices[1]][indices[2]] = item.innerHTML;
            saveData(spreadsheetData);
        }
    });

    // Attach click event listener to table body
    tableBody.addEventListener("click", function (e) {
        if (e.target) {
            if (e.target.className === "dropbtn") {
                const idArr = e.target.id.split("-");
                document
                    .getElementById(`row-dropdown-${idArr[2]}`)
                    .classList.toggle("show");
            }
            if (e.target.className === "row-insert-top") {
                const indices = e.target.parentNode.id.split("-");
                addRow(parseInt(indices[2]), "top");
            }
            if (e.target.className === "row-insert-bottom") {
                const indices = e.target.parentNode.id.split("-");
                addRow(parseInt(indices[2]), "bottom");
            }
            if (e.target.className === "row-delete") {
                const indices = e.target.parentNode.id.split("-");
                deleteRow(parseInt(indices[2]));
            }
        }
    });

    // Attach click event listener to table headers
    tableHeaders.addEventListener("click", function (e) {
        if (e.target) {
            if (e.target.className === "column-header-span") {
                sortColumn(parseInt(e.target.parentNode.id.split("-")[2]));
            }
            if (e.target.className === "dropbtn") {
                const idArr = e.target.id.split("-");
                document
                    .getElementById(`col-dropdown-${idArr[2]}`)
                    .classList.toggle("show");
            }
            if (e.target.className === "col-insert-left") {
                const indices = e.target.parentNode.id.split("-");
                addColumn(parseInt(indices[2]), "left");
            }
            if (e.target.className === "col-insert-right") {
                const indices = e.target.parentNode.id.split("-");
                addColumn(parseInt(indices[2]), "right");
            }
            if (e.target.className === "col-delete") {
                const indices = e.target.parentNode.id.split("-");
                deleteColumn(parseInt(indices[2]));
            }
        }
    });
};

createSpreadsheet();

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

//SAVE_TABLE_TO_CSV_____________________________________________________________________________________________________
function save_table_to_csv(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);
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
//SAVE_TABLE_TO_CSV_____________________________________________________________________________________________________

//SAVE_TABLE_TO_XLS_____________________________________________________________________________________________________
var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
        }
        , downloadURI = function (uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
        }

    return function (table, name, fileName) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        var resuri = uri + base64(format(template, ctx))
        downloadURI(resuri, fileName);
    }
})();

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

document.getElementById("button-save-table").addEventListener("click", e => {
    iziToast.info({
        title: 'Зберегти таблицю в форматі: ',
        position: 'center',
        timeout: 10000,
        buttons: [
            ['<button>.xls</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    onClosing: function (instance, toast, closedBy) {
                        var $govno = $("#table-body").clone().attr('id', 'table-body1').appendTo("table").hide();
                        $govno.find("th.row-header").remove();
                        tableToExcel(document.getElementById('table-body1'), 'CONFOR ' + getFormattedTime(), 'confor' + getFormattedTime() + '.xls');
                        $govno.remove();
                    }
                }, toast);
            }],
            ['<button>.csv</button>', function (instance, toast) {
                instance.hide({
                    transitionOut: 'fadeOutUp',
                    onClosing: function (instance, toast, closedBy) {
                        save_table_to_csv("confor" + getFormattedTime() + ".csv");
                    }
                }, toast);
            }]
        ]
    });
});
//SAVE_TABLE_TO_XLS_____________________________________________________________________________________________________

document.getElementById("clear-table").addEventListener("click", e => {
    // if (
    //     confirm("Це призведе до видалення всіх даних і встановлення налаштувань за замовчуванням. Ви впевнені?")
    // ) {
    //     this.resetData();
    // }
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
                        this.resetData();
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

$('#addRowsToTable').click(function () {
    addRow(parseInt(0), "bottom");
});

$('#addColsToTable').click(function () {
    addColumn(parseInt(0), "right");
});

// Mouse handler for select-list with terms (DRAG):
$('#uploadResultList').on('mousedown', 'option', clickDragAndDrop);
$('#uploadUnknownTerms').on('mousedown', 'option', clickDragAndDrop);

function clickDragAndDrop() {
    var termText = $(this).prop('value'); // extract text from term-list
    console.log(termText);
    // Mouse handler for table (DROP):
    $('#table-body').on('mouseup', 'td', function () {
        if (termText != '') {
            $(this).html(termText);
            termText = '';
        }
    });
}