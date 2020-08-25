$(function() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        console.log(e);
    })

    let $folderArea = (row, index) => $(`<div class="col-lg text-center folder-container"><div class="folder-div" id="folder-${row}${index}" data-id="folder-${row}${index}"><i class="fas fa-folder fa-2x"></i></div></div>`);

    function addFolderDesktop(i, j) {
        for(let i = 0; i < 8; i++) {
            $('#desktop').append(`<div class="row text-center" id="desktop-row-${i}"></div>`)
            for(let j = 0; j < 10; j++) {
                $(`#desktop-row-${i}`).append($folderArea(i,j).clone());
            }
        }
    }
    addFolderDesktop();
    $("#drop-area").droppable({
        drop: function( event, ui ) {
        $( this )
            .addClass("highlight");
            }
      });
    $(".folder-div").draggable({
        scroll: true,
        scrollSensitivity: 10,
        containment: "#full-area",
        cursor: "move",
        //revert: true,
        /*
        start: function( event, ui ) { 
            console.log(event);
            console.log(ui);
        },  
        drag: function( event, ui ) {  
            console.log(event);
            console.log(ui);
        },
        stop: function( event, ui ) {
            console.log(event);
            console.log(ui);
        }*/
    });
});