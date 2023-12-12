import R from "./ramda.js";
import EmpireGrid from "./EmpireGrid.js";

let slides = [];

let number_of_players_intro = undefined;
let player_names_intro = undefined;

let current_slide = -1;
let currentlySelectedTile = {};

window.nextSlide = function () {
    document.getElementById('how-many-players-intro-box').style.display = 'none';
    document.getElementById('player-names-intro-box').style.display = 'none';
    document.getElementById('standard-intro-box').style.display = 'flex';

    current_slide += 1
    if(current_slide > slides.length-1) {
        initGame();
    } else {
        if(slides[current_slide]["type"] == "special") {
            slides[current_slide]['show']();
        } 
        if(slides[current_slide]["type"] == "standard") {
            document.getElementById('intro-box-title').innerText = slides[current_slide]['title'];
            document.getElementById('intro-box-text').innerText = slides[current_slide]['text'];
            document.getElementById('intro-box-logo').src = slides[current_slide]['image'];
            document.getElementById('intro-box-small').style.display = 'none';

        } 
    }
}

window.howManyPlayers = function () {
    document.getElementById('standard-intro-box').style.display = 'none';
    document.getElementById('how-many-players-intro-box').style.display = 'flex';
}


window.playerNamesIntroBox = function () {
    document.getElementById('standard-intro-box').style.display = 'none';
    R.range(0, number_of_players_intro).map(function (player_no) {
        var input_box_work = document.createElement('input');
        input_box_work.setAttribute('type', 'text');
        input_box_work.setAttribute('placeholder', 'Player '+ (player_no+1));
        input_box_work.setAttribute('id', 'playerName'+ (player_no));
        document.getElementById('player-name-input-boxes').appendChild(input_box_work);
    });

    document.getElementById('player-names-intro-box').style.display = 'flex';
}

window.selectPlayerNo = function (number) {
    number_of_players_intro = number;
    nextSlide()
}


window.playerSetup = function () {
    var invalid = false
    let player_names = []
    R.range(0, number_of_players_intro).map(function (player_no) {
        var name_work = document.getElementById('playerName'+player_no).value;
        if(!name_work) {
            invalid = true;
        }
        player_names.push(name_work);
    });

    EmpireGrid.initGame(player_names);

    if(!invalid) {
        nextSlide();
    } else {
        alert('invalid');
    }
}

slides = [
    {"type":"standard", "title": "Welcome!", "text": `EmpireGrid is a turn-based strategy multiplayer game, set in a world where players build, upgrade, and wage wars against each other to establish their empires. The game is designed to be played on a grid, with players taking turns to make decisions and strategize their moves.
Once in game, you may prefer to use the keyboard controls that are available.
`, "image": "assets/logo.png"},
    {"type":"standard", "title": "Thank you for Testing", "text": "Hello Tester! I hope you enjoy the game. Please note that the game concept is generated using GPT3.5 for the original brainstorming which can be found in EmpireGrid.docx. Additionally, most of the assets you see are generated using Midjourney.com. The above Memoji is from Apple and is being used for non-commercial purposes.", "image": "assets/667729_CFB_Memoji.png"},
    {"type":"standard", "title": "Build", "text": "Each turn, you will need to decide your next move. You can build by clicking a tile and then selecting 'Build' from the menu. You can then build a new structure with the indicated diamond count in brackets being deducted upon construction. Your diamond count is 50 at the start of the game and will not increase without a building producing it.", "image": "assets/build.png"},
    {"type":"standard", "title": "Mining Rig", "text": "Mining Rigs generate 5 diamonds a turn. They are critical and you should build one in your first turn as you will likely be unable to build anything else! Make sure to protect them from attack from other players and to have appropriate contingencies. If you run out of diamond sources and military, you will be eliminated.", "image": "assets/mining.png"},
    {"type":"standard", "title": "Lodging", "text": "Lodgings produce 1 population a turn. They are a cheap structure to build and can be useful when under attack to increase your overall population helping you to survive. They are also critical to supplying population for your military.", "image": "assets/house.png"},
    {"type":"standard", "title": "Barracks", "text": "Barracks are a critical asset in helping you win the game. Every 2 turns it will produce 3 military if there are sufficient population. Make sure to construct them early on to have a fighting chance at attacking other players and winning the game. Any player that loses all their population will be eliminated. Population and military of the other player decreases upon a building being destroyed. You will also get 25 of the players diamonds if they have enough.", "image": "assets/barracks.png"},
    {"type":"standard", "title": "Attacking others", "text": "Click the player icons at the top to switch between boards and attack other players! Once on another player’s board you will have the option to attack them when you click a tile. Your military will then take health from that building.", "image": "assets/playericons.png"},
    {"type":"special", "show": howManyPlayers},
    {"type":"special", "show": playerNamesIntroBox},
    {"type":"standard", "title": "That's it!", "text": "Have fun and may the best player win!", "image": "assets/logo.png"}
];

const initGame = function () {
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('navbar').style.display = 'flex';
    document.getElementById('player-grid-container').style.display = 'flex';
    document.getElementById('player-grid-container').style.flexDirection = 'column';
    document.getElementById('currentPlayer').style.display = 'block';
    document.getElementById('selected-board').style.display = "inline";
    render();
}

const render = function () {
    renderNavbar();
    renderGrid(EmpireGrid.getGameState().shown_board);
    renderPlayerInfoPanel();
}
const player_colours = {
    0: "D4FEFF",
    1: "FFD5A9",
    2: "D4FDD5",
    3: "FFACA9"
}

const renderNavbar = function() {
    let players = EmpireGrid.getGameState().players
    document.getElementById('navbar-players').innerHTML = '';
    R.range(0, players.length).map(function (player_no) {
        let player_div = document.createElement('div')
        player_div.setAttribute('class', 'player-navbar-indicator')
        let player_div_text = document.createElement('h3')
        player_div_text.innerText = (player_no+1)
        player_div.appendChild(player_div_text)
        player_div.setAttribute('tabindex', '0')

        document.getElementById('navbar-players').appendChild(player_div)
        if(!players[player_no]['eliminated']) {
        
        let clickAction = function () {
            EmpireGrid.switchShownBoard(player_no)
            render()
        }

        player_div.onclick = function (event) {
            clickAction()
        }

        player_div.onkeydown = function (event) {
            if(event.key == 'Enter' || event.key == 'Space') {
                clickAction()
            }
        }

        player_div.style.backgroundColor = '#'+player_colours[player_no]
        } else {
            player_div.style.backgroundColor = '#ccc'
        }
        
        
        player_div.onmouseover = function (event) {
            if(!players[player_no]['eliminated']) {
                displayPopoverAt(players[player_no].name, event.clientX, event.clientY)
            } else {
                displayPopoverAt(players[player_no].name+'\nELIMINATED', event.clientX, event.clientY)

            }
        }
        
       

        player_div.onmouseleave = function () {
            hidePopover()
        }
    });

}
window.renderGrid = function(playerNo) {
    let players = EmpireGrid.getGameState().players
    document.getElementById('player-grid').innerHTML = ''
    document.getElementById('selected-board').innerText = 'Viewing: ' + players[playerNo].name
    let boardTable = document.createElement('table')
    let player_board_work = players[playerNo].board
    R.range(0, player_board_work.length).map(function (row_index) {
        let work_row = document.createElement('tr')
        R.range(0, player_board_work[row_index].length).map(function (col_index) {
            let work_td = document.createElement('td')
            work_td.setAttribute('class', 'player-grid-tile') 
            work_td.setAttribute('tabindex', '0')
            let work_img = document.createElement('img')
            work_img.setAttribute('alt', player_board_work[row_index][col_index].type.title)
            work_img.setAttribute('src', player_board_work[row_index][col_index].type.image) 
            
            work_td.onmouseover = function (event) {
                let user_text = player_board_work[row_index][col_index].type.title+` 
                Health ❤️: `+ player_board_work[row_index][col_index].health
                
                displayPopoverAt(user_text, event.clientX, event.clientY)
            }
            work_td.onmouseleave = function () {
                hidePopover()
            }

            let clickAction = function () {
                if(!EmpireGrid.getGameState().gameOver) {
                    currentlySelectedTile.x = col_index
                    currentlySelectedTile.y = row_index
                    showContextMenu()
                }
            }

            work_td.onclick = function () {
                clickAction()
            }

            work_td.onkeydown = function () {
                if(event.key == 'Enter' || event.key == 'Space') {
                    clickAction()
                }
            }
            
            work_td.appendChild(work_img)
            work_row.appendChild(work_td)

        })
        boardTable.appendChild(work_row)
        document.getElementById('player-grid').appendChild(boardTable)
    })
}

const displayPopoverAt = function(text, x, y) {
    document.getElementById('popover').innerText = text

    document.getElementById('popover').style.display = 'block'
    document.getElementById('popover').style.position = 'fixed'
    document.getElementById('popover').style.zIndex = '999'
    document.getElementById('popover').style.left = x+'px'
    document.getElementById('popover').style.top = y+'px'
}

const hidePopover = function() {
    document.getElementById('popover').style.display = 'none'
}


window.showBuildMenu = function () {
    let structures = EmpireGrid.structures
    let players = EmpireGrid.getGameState().players
    let shown_board = EmpireGrid.getGameState().shown_board

    let buildmenu = document.createElement('div')
    buildmenu.setAttribute('id', 'build-menu')
    let buildmenutable = document.createElement('table')
    buildmenu.setAttribute('class', 'dropdown subtle-shadow')


    Object.keys(structures).map(function (structure) {
        if(structures[structure].purchasable && structures[structure].title != players[shown_board]["board"][currentlySelectedTile.y][currentlySelectedTile.x].type.title) {
            let buildmenurow = document.createElement('tr')
            let work_structure_button = document.createElement('td')
            buildmenutable.appendChild(buildmenurow)
            buildmenurow.appendChild(work_structure_button)
            work_structure_button.innerText = structures[structure].title+'\n('+structures[structure].cost+'💎)'+'\n'
            let work_structure_img = document.createElement('img')
            work_structure_img.setAttribute('src', structures[structure].image)
            work_structure_img.setAttribute('width', 60)

            work_structure_button.appendChild(work_structure_img)
            work_structure_button.setAttribute('tabindex', 1)

            let clickAction = function () {
                if(structures[structure].title == players[shown_board]["board"][currentlySelectedTile.y][currentlySelectedTile.x].type.title) {
                    hideBuildMenu()
                    return;
                }
                let buildAttempt = EmpireGrid.buildStructure(structure, currentlySelectedTile.x, currentlySelectedTile.y, EmpireGrid.getGameState().currentPlayer)
                render()
                hideBuildMenu()
                if(typeof buildAttempt === 'string') {
                    alert(buildAttempt)
                } else {
                    return;
                }
            }

            work_structure_button.onclick = function () {
                clickAction()
            }

            work_structure_button.onkeydown = function(event) {
                if(event.key == 'Enter' || event.key == 'Space') {
                    clickAction()
                }
            }

            
            work_structure_button.onmouseenter = function (event) {

                let user_text = structures[structure].description
                displayPopoverAt(user_text, event.clientX, event.clientY)
            }
            work_structure_button.onmouseleave = function () {
                hidePopover()
            }

            
           

        }
    })

  
    document.body.appendChild(buildmenu)
    buildmenu.appendChild(buildmenutable)
}

window.hideBuildMenu = function (structure) {
    if(document.getElementById('build-menu')) {
        document.getElementById('build-menu').remove()
    }
    if(document.getElementById('popover')) {
        hidePopover()
    }
}

window.renderPlayerInfoPanel = function () {
    let players = EmpireGrid.getGameState().players
    let currentPlayer = EmpireGrid.getGameState().currentPlayer
    let turn = EmpireGrid.getGameState().turn
    let gameOver = EmpireGrid.getGameState().gameOver

    document.getElementById('playernumbernameindicator').innerText = 'P'+(currentPlayer+1)+': '+players[currentPlayer].name
    document.getElementById('playerpopulationindicator').innerText = players[currentPlayer].population
    document.getElementById('playerdiamondindicator').innerText = players[currentPlayer].diamonds
    document.getElementById('playermilitaryindicator').innerText = players[currentPlayer].military

    if(!gameOver) {
        document.getElementById('playerturnindicator').innerText = 'Turn: '+turn
    } else {
        document.getElementById('playerturnindicator').innerText = 'Game Over!'
        document.getElementById('nextturn').remove()
    }
}

const buildConditional = function () {
    let currentPlayer = EmpireGrid.getGameState().currentPlayer
    let shown_board = EmpireGrid.getGameState().shown_board
    if(currentPlayer == shown_board) { return true } else { return false}
}

const attackConditional = function () {
    let players = EmpireGrid.getGameState().players
    let currentPlayer = EmpireGrid.getGameState().currentPlayer
    let shown_board = EmpireGrid.getGameState().shown_board
    if(currentPlayer != shown_board && players[currentPlayer].military > 0) { return true } else { return false}
}

const attackButton = function () {
    let attackAttempt = EmpireGrid.attack(EmpireGrid.getGameState().currentPlayer, EmpireGrid.getGameState().shown_board, currentlySelectedTile.x, currentlySelectedTile.y)
    // if(typeof attackAttempt)
    render()
}

const contextButtons = [
    {
        "label": "Build",
        "description": "Build a new structure on this tile.",
        "clickFunction": showBuildMenu,
        "conditional": buildConditional
    }, 
    {
        "label": "Attack",
        "description": "Attack a structure on this tile.",
        "clickFunction": attackButton,
        "conditional": attackConditional

    }
]


window.showContextMenu = function () {
    if(document.getElementById('context-menu') != null) {
        document.getElementById('context-menu').remove()
    }
    let contextmenu = document.createElement('div')
    contextmenu.setAttribute('id', 'context-menu')
    let contextmenutable = document.createElement('table')
    contextmenu.setAttribute('class', 'dropdown subtle-shadow')

    let count = 0

    contextButtons.map(function (button) {
        if(button.conditional()) {
            count += 1        
            let contextmenurow = document.createElement('tr')
            let work_context_button = document.createElement('td')
            contextmenutable.appendChild(contextmenurow)
            contextmenurow.appendChild(work_context_button)
            work_context_button.innerText = button.label
            
            work_context_button.setAttribute('tabindex', '1')

            let clickAction = function () {
                hideContextMenu()
                button.clickFunction()
            }


            work_context_button.onclick = function () {
                clickAction()
            }
            
            work_context_button.onkeydown = function(event) {
                if(event.key == 'Enter' || event.key == 'Space') {
                    clickAction()
                }
            }


            
            work_context_button.onmouseenter = function (event) {
                let user_text = button.description
                displayPopoverAt(user_text, event.clientX, event.clientY)
            }
            work_context_button.onmouseleave = function () {
                hidePopover()
            }
        }
    })

    if(count) {
        document.body.appendChild(contextmenu)
        contextmenu.appendChild(contextmenutable)
    } else {
        alert('No actions available on this tile.')
    }
}

window.hideContextMenu = function (structure) {
    if(document.getElementById('context-menu')) {
        document.getElementById('context-menu').remove()
    }
    if(document.getElementById('popover')) {
        hidePopover()
    }
}

window.hideMenus = function () {
    hideContextMenu()
    hideBuildMenu()
}

window.nextTurn = function () {
    hideMenus()
    EmpireGrid.nextTurn()
    EmpireGrid.getAndClearAlerts().forEach(msg => {
        alert(msg)
    })
    render()
}