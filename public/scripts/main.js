$(document).ready(function(){
    let $folderArea = (row, index) => $(`<div class="col-lg text-center folder-container"><div class="folder" id="folder-${row}${index}"></div></div>`);

    function addFolderDesktop(i, j) {
        for(let i = 0; i < 8; i++) {
            $('#desktop').append(`<div class="row text-center" id="desktop-row-${i}"></div>`)
            for(let j = 0; j < 10; j++) {
                $(`#desktop-row-${i}`).append($folderArea(i,j).clone());
            }
        }
    }
    addFolderDesktop();
});