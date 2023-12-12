import EmpireGrid from "../EmpireGrid.js";

describe('Elimination Conditions', function () {
    it("A game where a player just builds houses and does not have any military or diamond sources.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('lodging', 0, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('barracks', 0, 2, 1)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('lodging', 0, 1, 0)
        EmpireGrid.buildStructure('lodging', 0, 2, 0)
        EmpireGrid.buildStructure('lodging', 1, 0, 0)
        EmpireGrid.buildStructure('lodging', 1, 1, 0)
        EmpireGrid.buildStructure('lodging', 1, 2, 0)
        EmpireGrid.buildStructure('lodging', 2, 0, 0)
        EmpireGrid.buildStructure('lodging', 2, 1, 0)
        EmpireGrid.buildStructure('lodging', 2, 2, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('lodging', 0, 1, 1)
        EmpireGrid.nextTurn()
        if(!EmpireGrid.getGameState().players[0].eliminated) {
            throw new Error(
                `Player 1 should be eliminated as they do not have enough diamonds to build anything or any military resources.`
            );
        }
    })
    it("A new game should have no eliminated players.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.getGameState().players.forEach(player => {
            if(player.eliminated) {
                throw new Error(
                    'Player ' +player.name+ ' should not have already been eliminated as the game just started!' 
                );
            }
        })
           
    });
});

describe('Win Conditions', function () {
    it("A game where a player just builds houses and does not have any military or diamond sources leading to the other player winning.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('lodging', 0, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('barracks', 0, 2, 1)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('lodging', 0, 1, 0)
        EmpireGrid.buildStructure('lodging', 0, 2, 0)
        EmpireGrid.buildStructure('lodging', 1, 0, 0)
        EmpireGrid.buildStructure('lodging', 1, 1, 0)
        EmpireGrid.buildStructure('lodging', 1, 2, 0)
        EmpireGrid.buildStructure('lodging', 2, 0, 0)
        EmpireGrid.buildStructure('lodging', 2, 1, 0)
        EmpireGrid.buildStructure('lodging', 2, 2, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('lodging', 0, 1, 1)
        EmpireGrid.nextTurn()
        if(!EmpireGrid.getGameState().players[1].winner) {
            throw new Error(
                `Player 2 should have won as the other player was eliminated.`
            );
        }
    });
   
    it("A new game should have no winning players.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.getGameState().players.forEach(player => {
            if(player.winner) {
                throw new Error(
                    'Player ' +player.name+ ' should not have already won as the game just started!' 
                );
            }
        })
           
    });
});
describe('Building Conditions', function () {
    it("A game where a player tries to build three barracks but is unsuccessful due to insuffiecent diamonds.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('barracks', 0, 0, 0)
        EmpireGrid.buildStructure('barracks', 1, 0, 0)
        EmpireGrid.buildStructure('barracks', 2, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('barracks', 0, 2, 1)
        EmpireGrid.nextTurn()
        let pInterestedInBoard = EmpireGrid.getGameState().players[0].board
        if(pInterestedInBoard[0][0].type.title != 'Barracks' || pInterestedInBoard[0][1].type.title != 'Barracks' || pInterestedInBoard[0][2].type.title != 'Grasslands') {
            throw new Error(
                `Unexpected result, top row of player 1 should be barracks, barracks, grasslands.`
            );
        }
    });
   
    it("A new game should have no tiles on any board.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.getGameState().players.forEach(player => {
            player.board.forEach(row => {
                row.forEach(col => {
                    if(col.type.title != 'Grasslands') {
                        throw new Error(
                            'Player ' +player.name+ ' should not have buildings as the game just started!' 
                        );
                    }
                })
            })
            
        })
           
    });
});

describe('Generation Checks', function () {
    it("Checking the building diamond costs are deducted correctly.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('barracks', 0, 0, 0)
        EmpireGrid.buildStructure('lodging', 1, 0, 0)
        EmpireGrid.buildStructure('lodging', 2, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('lodging', 0, 2, 1)
        EmpireGrid.nextTurn()
        let players = EmpireGrid.getGameState().players
        if(players[0].diamonds != 15 || players[1].diamonds != 25) {
            throw new Error(
                `Unexpected result, Player 1 should have 20 diamonds and Player 2 should have 25 but result did not match.`
            );
        }
    });
    it("Checking the diamond generation after 2 turns.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('barracks', 0, 0, 0)
        EmpireGrid.buildStructure('lodging', 1, 0, 0)
        EmpireGrid.buildStructure('lodging', 2, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('lodging', 0, 2, 1)
        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()
        let players = EmpireGrid.getGameState().players
        if(players[0].diamonds != 15 || players[1].diamonds != 30) {
            throw new Error(
                `Unexpected result, Player 1 should have 20 diamonds and Player 2 should have 25 but result did not match.`
            );
        }
    });
    it("Checking military are produced after 5 turns.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.buildStructure('barracks', 0, 0, 0)
        EmpireGrid.buildStructure('lodging', 1, 0, 0)
        EmpireGrid.buildStructure('lodging', 2, 0, 0)
        EmpireGrid.nextTurn()
        EmpireGrid.buildStructure('mining', 0, 1, 1)
        EmpireGrid.buildStructure('lodging', 0, 2, 1)
        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()

        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()

        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()

        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()

        EmpireGrid.nextTurn()
        EmpireGrid.nextTurn()

        let players = EmpireGrid.getGameState().players
        if(players[0].military != 6 || players[0].population != 7) {
            throw new Error(
                `Unexpected result, Player 1 should have 6 military and 7
                population.`
            );
        }
    });
   
    it("Each player in a new game should have the default amount of diamonds, military and population.", function () {
        EmpireGrid.initGame(['Freddie', 'Jack'])
        EmpireGrid.getGameState().players.forEach(player => {
            if(player.military != 0 || player.population != 1 || player.diamonds !=50) {
                throw new Error(
                    'Player ' +player.name+ ' does not match expected default values for diamond, military and population.' 
                );
            }
            
        })
           
    });
});