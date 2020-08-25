$(function() {
    // Folder & Desktop Setup
    // bootstrap grid where each grid can have 0 to 1 folders; current logic hardcodes all divs to have folder
    let $folderArea = (row, index) => $(`<div class="col-lg text-center folder-container"><div class="folder-div" id="folder-${row}${index}" data-id="folder-${row}${index}"><i class="fas fa-folder fa-2x"></i></div></div>`);

    function addFolderToDesktop(i, j) {
        for(let i = 0; i < 8; i++) {
            $('#desktop').append(`<div class="row text-center" id="desktop-row-${i}"></div>`)
            for(let j = 0; j < 10; j++) {
                $(`#desktop-row-${i}`).append($folderArea(i,j).clone());
            }
        }
    }
    addFolderToDesktop();

    // define drag/drop divs & areas using JQuery UI
    $("#drop-area").droppable({
        drop: function( event, ui ) {
            $(this).addClass("highlight");
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

    // Context Menu
    // build custom context menu
    // add listener to each of the folder divs, define if menu state is active/not, and position custom menu
    
    // variables
    const selectAllFolders = $(".folder-div");
    const menu = $("#context-menu");
    let menuState = 0;
    let activeMenu = "context-menu--active";
    let menuPosition;
    let menuPositionX;
    let menuPositionY;

    // initialize our application's code.
    function init() {
        contextListener();
        clickListener();
        keyupListener();
    }

    // Helper Functions

    // listens for contextmenu events -- need to refactor the "contextMenuListener" fucntion & for loop into this helper
    function contextListener() {

    }

    // listens for click events; toggles menu off if a left click
    function clickListener() {
        document.addEventListener("click", function(e) {
          let button = e.which || e.button;
          console.log(button)
          if (button === 1) {
            toggleMenuOff();
          }
        });
    }

    // listens for keyup event of 'esc'; if so, toggles menu off
    function keyupListener() {
        window.onkeyup = function(e) {
          if ( e.keyCode === 27 ) {
            toggleMenuOff();
          }
        }
    }

    // get the position of a right click -- pageX & pageY are part of the click event object
    function getPosition(e) {
        let posx = 0;
        let posy = 0;
      
        if(!e) {
            let e = window.event;
        };
      
        if(e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if(e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
      
        return {
            x: posx,
            y: posy
        }
    }
    // change the position of the context menu
    function positionMenu(e) {
        menuPosition = getPosition(e);
        menuPositionX = menuPosition.x + "px";
        menuPositionY = menuPosition.y + "px";

        menu.style.left = menuPositionX;
        menu.style.top = menuPositionY;
    }
    
    // listen for events on contextmenu (right click) -- must refactor into "contextListener"
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Main Functions

    // toggle menu state/class when active
    function toggleMenuOn() {
        if(menuState !== 1) {
            menuState = 1;
            menu.addClass(activeMenu);
        }
    }

    // toggle menu off if a normal click or 'esc'
    function toggleMenuOff() {
        if(menuState !== 0) {
            menuState = 0;
            menu.removeClass(activeMenu);
        }
    }

    function contextMenuListener(el) {
        el.addEventListener("contextmenu", function(e) {
            console.log(e, el);
            toggleMenuOn();
            positionMenu(e);
        });
    }

    // add listener to only the areas that need it, e.g., the folders
    for (let i = 0; i < selectAllFolders.length; i++ ) {
        let selectFolder = selectAllFolders[i];
        contextMenuListener(selectFolder);
    }

    init();
});