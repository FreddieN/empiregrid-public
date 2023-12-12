import R from "./ramda.js";
/**
 * EmpireGrid.js is a module to model and play "Empire Grid"
 * See EmpireGrid.docx for original game specification
 * @namespace EmpireGrid
 * @author Freddie Nicholson
 * @version 2022/23
 */
const EmpireGrid = Object.create(null);

/**
 * A game board stores a players empire. Structures can be placed within them.
 * Each player has their own board. The board is made up of a 2D array.
 * Each cell can only occupy one structure.
 * @memberof EmpireGrid
 * @typedef {EmpireGrid.Structure[][]} Board
 */

/**
 * A player object stores specific details about that player such as their 
 * diamond count and military. The player's board is also stored within the object.
 * Metadata such as whether the player is eliminated is also stored.
 * @memberof EmpireGrid
 * @typedef {Object} Player
 */

// object storing various parameters around the game state such as whether it is over, the players within it and more
let gameState = {};

/**
 * Adds 5 diamonds to the player's diamond count. Intended to be run every round ( / turn as referred to in code).
 * @memberof EmpireGrid
 * @function
 * @param {player} player Player The player object this tile should evaluate for.
 * @param {tile} tile Tile The tile object for this specific structure within a board.
 */
EmpireGrid.miningTurnFunction = function (player, tile) {
    player.diamonds += 5;
}

/**
 * Adds 1 person to the player's population count. Intended to be run every round ( / turn as referred to in code).
 * @memberof EmpireGrid
 * @function
 * @param {player} player Player The player object this tile should evaluate for.
 * @param {tile} tile Tile The tile object for this specific structure within a board.
 */
EmpireGrid.lodgingTurnFunction = function (player, tile) {
    player.population += 1;
}

/**
 * Adds 5 military to the player's military count. Intended to be run every round ( / turn as referred to in code).
 * However will only produce military every 2 turns and when the players population is over 5.
 * @memberof EmpireGrid
 * @function
 * @param {player} player The player object this tile should evaluate for.
 * @param {tile} tile The tile object for this specific structure within a board.
 */
EmpireGrid.barracksTurnFunction = function (player, tile) {
    if(tile['lastMilitaryBorn'] === undefined) {
        tile['lastMilitaryBorn'] = gameState.turn;
    }
    if(gameState.turn - tile['lastMilitaryBorn'] >= 2 && player.population >= 3) {
        tile['lastMilitaryBorn'] = gameState.turn;
        player.military += 3;
        player.population -= 3;
    }
}

/**
 * A structure object stores specific details about that structure such as their 
 * diamond cost and special turn functions. Each turn its specific turn function is evaluated.
 * Some structures may have additional custom parameters added during game logic.
 * @memberof EmpireGrid
 * @property {string} grasslands 🟩
 * @property {string} destroyed ◼️
 * @property {string} barracks 🏛️
 * @property {string} mining ⛏️
 * @property {string} lodging 🏘️
 * @typedef {Object} Structure
 */
EmpireGrid.structures = {
    "grasslands": {
        "title": "Grasslands",
        "description": "A tile to be built upon",
        "cost": 5,
        "purchasable": true,
        "image": "assets/grass.png",
        "emoji": "🟩"
    },
    "research": {
        "title": "Research Lab",
        "description": "Allows you to upgrade your buildings",
        "cost": 100,
        "purchasable": false,
        "image": "assets/research.png",
        "emoji": ""
    },
    "destroyed": {
        "title": "Destroyed",
        "description": "A tile to be built upon",
        "cost": -1,
        "purchasable": false,
        "image": "assets/destroyed.png",
        "emoji": "◼️"
    },
    "barracks": {
        "title": "Barracks",
        "description": `Allows you to train troops

        Every 2 turns it will turn 5 citizens into 5 military units
        `,
        "cost": 25,
        "purchasable": true,
        "image": "assets/barracks.png",
        "turnFunction": EmpireGrid.barracksTurnFunction,
        "emoji": "🏛️"
    },
    "mining": {
        "title": "Mining Rig",
        "description": `Allows you to gather resources

        Each turn it will increase your diamond count by 5        
        `,
        "cost": 25,
        "purchasable": true,
        "image": "assets/mining.png",
        "turnFunction": EmpireGrid.miningTurnFunction,
        "emoji": "⛏️"
    },
    "lodging": {
        "title": "Lodging",
        "description": `Increases your population, allowing for more barrack activity and increasing your economy.

        Each turn it will increase your population by 1              
        `,
        "cost": 5,
        "purchasable": true,
        "image": "assets/house.png",
        "turnFunction": EmpireGrid.lodgingTurnFunction,
        "emoji": "🏘️"
    },
}

/**
 * This helper function takes a type and returns an object for that type known as a grid tile.
 * @function
 * @param {EmpireGrid.Type} type The structure type.
 * @returns {object} Object containing metadata about the structure.
 */
EmpireGrid.createStructure = function (type) {
    return {
        "health": 100,
        "type": EmpireGrid.structures[type]
    }
}

/**
 * This function initialises each player entered via the interface by setting up their
 * board and assigning the default population, military and diamond count.
 * @function
 * @param {Array} player_names Array of player names.
 * @returns {Array} Array containing object with metadata about each player.
 */
EmpireGrid.initPlayers = function (player_names) {
    let players = []
    let invalid = false
    R.range(0, player_names.length).map(function (player_no) {
        let name_work = player_names[player_no]
        if(!name_work) {
            invalid = true;
        }
        let player_board = []
        R.range(0,3).map(function() {
            let work_row = []
            R.range(0,3).map(function() {
                work_row.push(EmpireGrid.createStructure("grasslands"))
            })
            player_board.push(work_row)
        })
        players.push(
            {"name": name_work, "board": player_board, "population": 1, "military": 0, "diamonds": 50, "eliminated": false, "winner": false}
            )
    });
    if(!invalid) {
        return players
    } else {
        return "Player names cannot be blank."
    }
}

/**
 * This function initialises the game by setting up the metadata required for the gameState object
 * that stores critical data about the game such as player boards and round (turn) count.
 * @function
 * @param {EmpireGrid.Player_Names} player_names Array of player names.
 * @returns {Object} Object containing the setup gameState.
 */
EmpireGrid.initGame = function (player_names) {
    gameState = {
        "number_of_players": player_names.length,
        "shown_board": 0,
        "turn": 1,
        "gameOver": false,
        "currentPlayer": 0,
        "players": EmpireGrid.initPlayers(player_names),
        "alertMsg": []
    }
    return gameState
}

/**
 * This function returns a text representation of the board passed in as a parameters using
 * the structure 'emoji' metadata.
 * @function
 * @param {EmpireGrid.Board} board Board to be represented via Emojis.
 * @returns {String} String displaying the passed in board as emojis seperated by row using newline characters.
 */
EmpireGrid.textRepresentationBoard = function (board) {
    let textRepr = ""
    let workRow = undefined;
    R.range(0,3).map(function(row_number) {
        let workRow = board[row_number]
        R.range(0,3).map(function(col_number) {
            let workCol = workRow[col_number]
            textRepr += workCol.type.emoji + " "
        })
        textRepr += "\n"
    })
    return textRepr
}

/**
 * This function returns a board with the new structure built and updates the current player gameState to represent a new structure
 * being built that is passed in.
 * @function
 * @param {String} structure Structure name to be built.
 * @param {x} x x coordinate where the structure should be placed.
 * @param {y} y x coordinate where the structure should be placed.
 * @param {playerNo} playerNo Player number for the board which the structure should be placed on.
 * @returns {Board | String} Updated board or string error message
 */
EmpireGrid.buildStructure = function (structure, x, y, playerNo) {
    if(gameState.players[playerNo]["diamonds"] >= EmpireGrid.structures[structure].cost) {
        gameState.players[playerNo].board[y][x] = EmpireGrid.createStructure(structure)
        gameState.players[playerNo]["diamonds"] -= EmpireGrid.structures[structure].cost
        return gameState.players[playerNo].board
    } else {
        return('Not enough diamonds.');
    }
}

/**
 * This function switches the shown board in the gamestate.
 * @function
 * @param {Integer} playerNo Structure name to be built.
 */
EmpireGrid.switchShownBoard = function (playerNo) {
    gameState.shown_board = playerNo
}

/**
 * This function completes the logic for each turn. Checking a player's board to see if they are still
 * in the game and evaluates the generation for each tile using the tile's turn function.
 * @function
 * @param {String} player Structure name to be built.
 */
EmpireGrid.turnLogic = function (player) {
    let mineExists = false
    let militaryExists = false
    player.board.forEach(row => {
        row.forEach(col => {
            if(col.type["title"] == 'Mining Rig') {
                mineExists = true
            }
            if(col.type["title"] == 'Barracks') {
                militaryExists = true
            }
            if(col.type["turnFunction"] !== undefined) {
                col.type["turnFunction"](player, col)
            }
        })
        
    })
 
    if(!player.eliminated && !mineExists && (!militaryExists || player.population < 1) && !player.military && player.diamonds < 25) {
        gameState.alertMsg.push((player.name + ' eliminated as no diamond sources and no military.'))
        player['eliminated'] = true;
    }
    if(!player.eliminated && player.population == 0 && !player.military) {
        player['eliminated'] = true;
        gameState.alertMsg.push(player.name + ' eliminated as no population.')
    }
    let playersInGame = []
    gameState.players.forEach(player => {
        if(!player.eliminated) {
            playersInGame.push(player)
        }
    })
    if(playersInGame.length == 1 && gameState.gameOver != true) {
        gameState.alertMsg.push(playersInGame[0].name + ' won!')
        playersInGame[0]['winner'] = true;
        gameState.gameOver = true;

    }
}

/**
 * Clears all alerts within the gamestate alertMsg object.
 * @function
 * @returns {Array} The array of messages
 */
EmpireGrid.getAndClearAlerts = function () {
    let msgs = gameState.alertMsg
    gameState.alertMsg = []
    return msgs
}

/**
 * Evaluates next turn logic for each player using turnLogic.
 * @function
 * @returns {Object} The current gamestate
 */
EmpireGrid.nextTurn = function () {
    if(gameState.currentPlayer == gameState.players.length-1) {
        gameState.currentPlayer = 0
        gameState.players.forEach(player => {
            EmpireGrid.turnLogic(player)
        })
        gameState.turn += 1
    } else {
        gameState.currentPlayer +=1
    }
    gameState.shown_board = gameState.currentPlayer
    if(gameState.players[gameState.currentPlayer].eliminated) {
        EmpireGrid.nextTurn()
    }
    return gameState
}
/**
 * Attacks a player's board and completes the logic that needs to occur in this transaction such
 * as reducing military count and health of the building being attacked.
 * @function
 * @param {Integer} attacker the player attacking
 * @param {Integer} attacked the player attacked
 * @param {Integer} x x coordinate of the tile to attack on attacked board
 * @param {Integer} y y coordinate of the tile to attack on attacked board
 */
EmpireGrid.attack = function(attacker, attacked, x, y) {
    attacker = gameState.players[attacker]
    attacked = gameState.players[attacked]
    if(Math.round(Math.random())) {
        attacker.military -= 1
    }
    if(attacked.board[y][x].health > 25) {
        attacked.board[y][x].health -= 25
    } else {
        attacked.board[y][x] = EmpireGrid.createStructure('destroyed')
        if(attacked.diamonds > 25) {
            attacked.diamonds -= 25;
            attacker.diamonds += 25;
        }
        if(attacker.military > 0) {
            attacker.military -= 1
        }
        let remaining = 0
        attacked.board.forEach(row => {
            row.forEach(col => {
                if(col.type["title"] !== "Destroyed" && col.type["title"] !== "Grasslands") {
                    remaining += 1;
                }
            })
        })
        attacked.population = Math.ceil(attacked.population*(remaining/9))
        attacked.military = Math.ceil(attacked.military*(remaining/9))

    }
}

/**
 * Retrieves a numbered player's board object.
 * @function
 * @param {Integer} playerNumber The player to get the board for
 * @returns {EmpireGrid.Board} The string representation.
 */
EmpireGrid.getBoard = function (playerNumber) {
    return gameState.players[playerNumber].board
}

/**
 * Retrieves current gamestate.
 * @function
 * @returns {Object} The string representation.
 */
EmpireGrid.getGameState = function () {
    return gameState
}

export default Object.freeze(EmpireGrid);
