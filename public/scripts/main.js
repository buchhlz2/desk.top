$(function() {
    // Folder & Desktop Setup
    // bootstrap grid where each grid can have 0 to 1 folders; current logic hardcodes all divs to have folder
    let $folderGrid = (row, index) => $(
        `<div class="col-lg text-center folder-container" id="folder-container_${row}${index}" props="${row}${index}">
        </div>`
    );

    /*
        `<div class="folder-div" data-id="folder-${row}${index}">
            <i class="fas fa-folder fa-2x">
            </i>
        </div>`
    */

    function addFolderToDesktop(i, j) {
        for(let i = 0; i < 8; i++) {
            $('#desktop').append(
                `<div class="row text-center" id="desktop-row_${i}"></div>`
            );
            for(let j = 0; j < 10; j++) {
                $(`#desktop-row_${i}`).append($folderGrid(i,j).clone());
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
    function makeDragable(el) {
        el.draggable({
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
    }

    // Context Menu
    // build custom context menu
    // add listener to each of the folder divs, define if menu state is active/not, and position custom menu
    
    // variables
    const contextMenuLinkClassName = "context-menu__link";
    const contextMenuActive = "context-menu--active";
    let contextMenuAction;

    const folderClassName = 'folder-div';
    const folderContainerClassName = 'folder-container';
    const folderEditAddClassName = 'folder-edit';
    let folderInContext;
    let folderActionInContext;

    let clickCoords;
    let clickCoordsX;
    let clickCoordsY;
    
    const menu = $("#context-menu");
    let menuState = {
        enabled: 0
    };
    let menuWidth;
    let menuHeight;

    let windowWidth;
    let windowHeight;


    // initialize our application's code.
    function init() {
        contextListener();
        clickListener();
        keyupListener();
        resizeListener();
    }

    // Helper Functions

    // listens for contextmenu events -- toggles menu on/off if the correct class (folder-div) is clicked on
    function contextListener() {
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            folderActionInContext = clickInsideElement(e, folderContainerClassName);
            if(folderActionInContext) {
              toggleMenuOn();
              positionMenu(e);
            } else {
                folderActionInContext = null;
                toggleMenuOff();
            }
          });
    }

    // only apply context menu if clicked inside of "className", e.g., "folder-div"
    function clickInsideElement(e, className) {
        let el = e.srcElement || e.target;
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
            let clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName);
            if (clickeElIsLink) {
                e.preventDefault();
                menuItemListener(clickeElIsLink);
            } else {
                let button = e.which || e.button;
                    if (button === 1) {
                        toggleMenuOff();
                    }
            }
        });
    }

    // listens for keyup event of 'esc'; if so, toggles menu off
    function keyupListener() {
        window.onkeyup = function(e) {
          if (e.keyCode === 27) {
            toggleMenuOff();
          }
        }
    }

    // listen for a winoow resize to make sure context menu turns off (to avoid confusing layout)
    function resizeListener() {
        window.onresize = function(e) {
            toggleMenuOff();
        };
    }

    function menuItemListener(link) {
        contextMenuAction = link.getAttribute("data-action");

        let folderDataId;
        let folderContainerId = folderActionInContext.getAttribute("id");
        
        switch(contextMenuAction) {
            case("CREATE"):
                console.log("Folder ID - " + folderDataId + ", Folder Container ID - " + folderContainerId + ", Folder action - " + contextMenuAction);
                createNewFolder(folderContainerId);
                break;
            case("EDIT"):
                folderDataId = "folder_" + $(`[id="${folderContainerId}"]`)[0].getAttribute("props");
                console.log("Folder ID - " + folderDataId + ", Folder Container ID - " + folderContainerId + ", Folder action - " + contextMenuAction);
                editExistingFolder(folderDataId);
                break;
            case("DELETE"):
                folderDataId = "folder_" + $(`[id="${folderContainerId}"]`)[0].getAttribute("props");
                console.log("Folder ID - " + folderDataId + ", Folder Container ID - " + folderContainerId + ", Folder action - " + contextMenuAction);
                deleteExistingFolder(folderDataId);
                break;
            default:
                toggleMenuOff();
        }
        toggleMenuOff();
    }



    // Main Functions

    // toggle menu state/class when active
    function toggleMenuOn() {
        if(menuState.enabled !== 1) {
            menuState.enabled = 1;
            menu.addClass(contextMenuActive);
        }
    }

    // toggle menu off if a normal click or 'esc'
    function toggleMenuOff() {
        if(menuState.enabled !== 0) {
            menuState.enabled = 0;
            menu.removeClass(contextMenuActive);
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
        clickCoords = getPosition(e);
        clickCoordsX = clickCoords.x;
        clickCoordsY = clickCoords.y;

        menuWidth = menu.offsetWidth + 4;
        menuHeight = menu.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ((windowWidth - clickCoordsX) < menuWidth) {
            menu[0].style.left = windowWidth - menuWidth + "px";
        } else {
            menu[0].style.left = clickCoordsX + "px";
        }

        if ((windowHeight - clickCoordsY) < menuHeight) {
            menu[0].style.top = windowHeight - menuHeight + "px";
        } else {
            menu[0].style.top = clickCoordsY + "px";
        }
    }


    // Folder Interactions through Context Menu

    function createNewFolder(folderContainerId) {
        let folderContainer = $(`[id="${folderContainerId}"]`);
        let folderDataId = folderContainer[0].getAttribute("props");

        if(folderDataId) {
            $(`#${folderContainerId}`).append(
                `<div class="folder-div" id="folder_${folderDataId}" data-id="folder_${folderDataId}">
                    <i class="fas fa-folder fa-2x">
                </div>`
            );
        };

        makeDragable($(`#folder_${folderDataId}`));
    }

    function editExistingFolder(folderDataId) {
        folderInContext = $(`[data-id="${folderDataId}"]`);
        folderInContext.addClass(folderEditAddClassName);
    }

    function deleteExistingFolder(folderDataId) {
        folderInContext = $(`[data-id="${folderDataId}"]`);
        folderInContext.remove();
    }

    init();
});