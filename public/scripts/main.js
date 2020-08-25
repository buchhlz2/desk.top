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
    const folderClassName = 'folder-div';
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

    // listens for contextmenu events -- toggles menu on/off if the correct class (folder-div) is clicked on
    function contextListener() {
        document.addEventListener("contextmenu", function(e) {
            if(clickInsideElement(e, folderClassName)) {
              e.preventDefault();
              toggleMenuOn();
              positionMenu(e);
            } else {
                toggleMenuOff();
              }
          });
    }

    // only apply context menu if clicked inside of "className", e.g., "folder-div"
    function clickInsideElement(e, className) {
        let el = e.srcElement || e.target;
        console.log(el)
        if (el.classList.contains(className)) {
          return el;
        } else {
          while (el = el.parentNode) {
            if (el.classList && el.classList.contains(className)) {
              return el;
            }
          }
        }
      
        return false;
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
        console.log(menu)
        menuPositionX = menuPosition.x + "px";
        menuPositionY = menuPosition.y + "px";

        menu[0].style.left = menuPositionX;
        menu[0].style.top = menuPositionY;
    }

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

    init();
});