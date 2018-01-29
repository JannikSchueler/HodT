 var debug = true;
 if(debug){console.log("scoreboard.js loaded!");}

/*
    GameMode Settings
                        */
var legsPerMode = 3

/* ScoreBoard VARIABLES */
//var players = [];
var playerCount = 0;


/*module.exports = function(nameArray, playsPL, legsPM) {
    return new ScoreBoard(nameArray, playsPL, legsPM);
};*/

function ScoreBoard(nameArray, playsPL, legsPM){
    this.players = [];
    this.playsPerLeg = playsPL;
    this.legsPerMode = legsPM;
    legsPerMode = legsPM;

    nameArray.forEach(name => {
        this.players.push(new Player(name));
    });

    if(debug){
        this.players.forEach(player => {
            console.log(player.name + " loaded");
        });
    }


    this.GetPlayerById = function(playerID){
        for(i = 0; i < this.players.length; i++){
            if(this.players[i].id == playerID){
                return this.players[i];
            }
        }
    }

    this.GetPlayerByName = function(playerName){
        for(i = 0; i < this.players.length; i++){
            if(this.players[i].name == playerName){
                return this.players[i];
            }
        }
    
        console.log("PlayerName not found!");
        return 0;
    }
    this.GetPlayersSorted = function(){
        sortedPlayers = [this.players[0]];
        for(i = 1; i < this.players.length; i++){
            for(j=0; j < sortedPlayers.length; j++){
                if(this.players[i].score > sortedPlayers[j].score){
                    sortedPlayers.splice(j, 0, this.players[i]);
                    break;
                }
                if(j == sortedPlayers.length - 1){
                    sortedPlayers.push(this.players[i]);
                    break;
                }
            }
        }
    
        return sortedPlayers;
    }
    
    this.GetRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.GetNextPlayer = function(lastPlayerID){
        if(lastPlayerID == this.players.length - 1){
            i = 0;
        }else{
            i = lastPlayerID + 1;
        }
        return this.players[i];
    }
}



/*
    Player CLASS
    stay in scoreBoard                <*/
function Player(name){
    /* Variables */
    this.id = playerCount;
    this.name = name;
    this.cLeg = [];
    this.legs = [];
    this.hScore = 0;
    this.tScore = 0;
    this.score = 0;
    playerCount++;

    /* Functions */
    this.AddThrow = function(score){
        this.cLeg.push(score);
    }
    this.AddLeg = function(leg) { 
        this.legs.push(leg);
    }
    this.SumHoch = function(){
        for(i = 0; i < legsPerMode; i++){
            this.legs[i].forEach(points => {
                this.hScore += points;
            });
        }

        return this.hScore;
    }
    this.SumTief = function(){
        for(i = legsPerMode; i < legsPerMode * 2; i++){
            this.legs[i].forEach(points => {
                if(points == 0){
                    this.tScore += 20;
                }else{
                    this.tScore += points;
                }
            });
        }

        return this.tScore;
    }
    this.FinalScore = function(){
        this.score = this.hScore - this.tScore;
        return this.score;
    }
    this.DebugLegs = function(){
        this.legs.forEach(leg => {
            leg.forEach(points => {
                console.log(points);
            });
        });
    }
    this.GetLegScore = function(){
        legScore = 0;
        this.cLeg.forEach(points => {
            legScore += points;
        })
        return legScore;
    }
}



/* ScoreBoard FUNCTIONS */
function GetPlayerById(playerID){
    for(i = 0; i < players.length; i++){
        if(players[i].id == playerID){
            return players[i];
        }
    }

    console.log("PlayerID not found!");
    return 0;
}
function GetPlayerByName(playerName){
    for(i = 0; i < players.length; i++){
        if(players[i].name == playerName){
            return players[i];
        }
    }

    console.log("PlayerName not found!");
    return 0;
}
function GetPlayersSorted(){
    sortedPlayers = [players[0]];
    for(i = 1; i < players.length; i++){
        for(j=0; j < sortedPlayers.length; j++){
            if(players[i].score > sortedPlayers[j].score){
                sortedPlayers.splice(j, 0, players[i]);
                break;
            }
            if(j == sortedPlayers.length - 1){
                sortedPlayers.push(players[i]);
                break;
            }
        }
    }

    return sortedPlayers;
}