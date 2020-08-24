$(document).ready(function(){
    var $folderArea = $('<div class="col-sm text-center folder-container"><div class="folder"></div></div>');
    function addFolderDesktop(i, j) {
        for(let i = 0; i < 8; i++) {
            $('#desktop').append(`<div class="row text-center" id="desktop-row-${i}"></div>`)
            for(let j = 0; j < 8; j++) {
                $(`#desktop-row-${i}`).append($folderArea.clone());
            }
        }
    }
    addFolderDesktop();
});