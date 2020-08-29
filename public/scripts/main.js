$(function() {
    // Folder & Desktop Setup
    // bootstrap grid where each grid can have 0 to 1 folders; current logic hardcodes all divs to have folder
    let $folderGrid = (row, index) => $(
        `<div class="col-lg text-center folder-container" id="folder-container_${row}${index}" props="${row}${index}">
        </div>`
    );

    // when mouse hovers over app in dock, show the app name above the app icon
    function onDockHoverListener() {
        $('.dock-app-icon').mouseenter(function() {
            let dockAppLabelId = $(this)[0].parentNode.children[0].getAttribute('id');
            let dockAppId = $(this)[0].getAttribute('id');
            $(`#${dockAppId}`).addClass("dock-app-icon--hover");
            $(`#${dockAppLabelId}`).addClass('dock-app-label--hover');
          })
          .mouseleave(function() {
            let dockAppLabelId = $(this)[0].parentNode.children[0].getAttribute('id');
            let dockAppId = $(this)[0].getAttribute('id');
            $(`#${dockAppId}`).removeClass("dock-app-icon--hover");
            $(`#${dockAppLabelId}`).removeClass('dock-app-label--hover');
          });
    }

    // define drag/drop divs & areas using JQuery UI
    // currently, the only draggable element into a drop region is class 'folder-div'
    function makeDroppable(el) {
        el.droppable({
            accept: '.folder-div',
            drop: function(event, ui) {
                $(this).toggleClass("highlight");
            }
        });
    }

    function makeDraggable(el) {
        el.draggable({
            scroll: true,
            scrollSensitivity: 10,
            containment: 'window',
            cursor: "move",
            revert: 'invalid'
        });
    }

    function addFolderGridToDesktop(i, j) {
        for(let i = 0; i < 4; i++) {
            $('#desktop').append(
                `<div class="row text-center" id="desktop-row_${i}"></div>`
            );
            for(let j = 0; j < 12; j++) {
                $(`#desktop-row_${i}`).append($folderGrid(i,j).clone());
            };
        }
        makeDroppable($(".folder-container"));
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
    const folderOpenAddClassName = 'folder-open';
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
        addFolderGridToDesktop();
        contextListener();
        clickListener();
        keyupListener();
        resizeListener();
        makeDroppable($("#trash"));
        onDockHoverListener();
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
        // listens for a click event
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

        // listens for double click & either creates new folder or opens an existing one
        document.addEventListener('dblclick', (e) => {
            let dblClickElement = $(`#${clickInsideElement(e, folderContainerClassName).getAttribute('id')}`)[0];
            let elementContainsChild = dblClickElement.children.length == 0 ? false : true;
            if(elementContainsChild) {
                openExistingFolder(dblClickElement.children[0].getAttribute("data-id"))
            } else {
                createNewFolder(dblClickElement.getAttribute('id'))
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

    function getFolderId(parentId) {
        return "folder_" + $(`[id="${parentId}"]`)[0].getAttribute("props");
    }

    function menuItemListener(link) {
        contextMenuAction = link.getAttribute("data-action");
        
        let folderContainerId = folderActionInContext.getAttribute("id");
        let folderDataId = getFolderId(folderContainerId);
        console.log("Folder ID - " + folderDataId + ", Folder Container ID - " + folderContainerId + ", Folder action - " + contextMenuAction);
        
        switch(contextMenuAction) {
            case("CREATE"):
                createNewFolder(folderContainerId);
                break;
            case("OPEN"):
                openExistingFolder(folderDataId);
                break;
            case("EDIT"):
                editExistingFolder(folderDataId);
                break;
            case("DELETE"):
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
        if(folderContainer[0].children.length != 0) {
            console.log("Folder already exists in this container.");
            return;
        };
        let folderDataId = folderContainer[0].getAttribute("props");

        if(folderDataId) {
            $(`#${folderContainerId}`).append(
                `<div class="folder-div" id="folder_${folderDataId}" data-id="folder_${folderDataId}">
                    <span class="fas fa-folder fa-3x folder-icon"></span>
                </div>`
            );
        };

        makeDraggable($(`#folder_${folderDataId}`));
    }

    function openExistingFolder(folderDataId) {
        folderInContext = $(`[data-id="${folderDataId}"]`);
        folderInContext.addClass(folderOpenAddClassName);
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