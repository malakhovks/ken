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