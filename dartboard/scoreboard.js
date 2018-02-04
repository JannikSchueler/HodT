 var debug = false;
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
    this.canvas = document.getElementById("scoreboard_canvas");
    this.ctx = this.canvas.getContext('2d');
    this.width = 462;
    this.height = 595;
    
    this.cells = [];
    this.images = [];
    this.imageNames = ["background", "bground", "title", "h_box", "t_box", "g_box", "lv1", "lh1", "lh2", "lh3", "pokal1","pokal2","pokal3"];
    this.imageCounter = Object.keys(this.imageNames).length;
    this.linePos = [];
    this.tableLinePos = [];
    
    nameArray.forEach(name => {
        this.players.push(new Player(name));
    });
    
    if(debug){
        this.players.forEach(player => {
            console.log(player.name + " loaded");
        });
    }
    
    
    this.InitializeScoreBoard = function(){
        for(var i = 0; i < this.imageNames.length; i++){
            var img = new Image();
            img.onload = CountImages;
            img.src = "img/scoreboard/" + this.imageNames[i] + ".png";
            
            this.images.push(img);
        }
        
        console.log(this.images);
        
        //shadow on
		this.ctx.shadowBlur=8;
		this.ctx.shadowOffsetX=155;
		this.ctx.shadowOffsetY=1;
		this.ctx.shadowColor="rgba(0, 0, 0, 0.5)";
        
		this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
		//ctx.fillRect(0,h/2,w,h/2);
		this.ctx.beginPath();
		this.ctx.moveTo(2/3*this.width, 1/2*this.height);
		this.ctx.lineTo(this.width - 50, 1/2*this.height);
		this.ctx.lineTo(2/3*this.width, this.height);
		this.ctx.lineTo(1/3*this.width, this.height);
		this.ctx.fill();
		//shadow off
		this.ctx.shadowColor="rgba(0, 0, 0, 0)";
		this.ctx.fillStyle = "rgba(235, 235, 235, 1)";
        this.ctx.fillRect(0,0,this.width,this.height);
    }
    
    this.InitializeCells = function(){
        startPosY = 98;
        startPosX = 20;
        width = this.width/3 - 10;
        settings_TextColor = ["rgba(25, 30, 100, 1)", "rgba(35, 40, 130, 1)", "rgba(41, 55, 166, 1)"];
        
        for(var i = 0; i < this.players.length; i++){
            var rows = [];
            var height = 30;
            var fontsize = 21;
            var color = settings_TextColor[2];
            var yoffset = 5;
            
            for(var j = 0; j < 10; j++){
                if(j > 0){
                    height = this.tableLinePos[j]-this.tableLinePos[j-1];
                    if(height / 40 > 1){
                        if(height/50 > 1){
                            fontsize = 30;
                            color = settings_TextColor[2];
                        }else{
                            fontsize = 25;
                            color = settings_TextColor[1];
                        }
                        
                    }else{
                        fontsize = 21;
                        color = settings_TextColor[0];
                    }
                }
                
                var cell = new Cell(i + "_" + j, width, height, startPosX + i*(width), this.tableLinePos[j] - height + yoffset, fontsize, color);
                //cell.ctx.strokeRect(0,0,width,height);
                
                rows.push(cell);
                this.ctx.drawImage(cell.cellCanvas, cell.x, cell.y);
            }
            
            this.cells.push(rows);
            this.cells[i][0].SetText(this.players[i].name);
            this.cells[i][0].UpdateCell(this.ctx);
        }
    }
    
    this.DrawScoreBoard = function(){
        console.log("Drawing Scoreboard now!");
        this.DrawImage("background", 0, 0);
        
        this.DrawImage("title", 20, 0);
        
        this.FindBackgroundLines(); // get the values for the horizontal lines to match up with the paperlines
        
        this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = "rgba(255,255,255,1)";
		this.ctx.strokeRect(0 + this.ctx.lineWidth / 2,0 + this.ctx.lineWidth / 2,this.width - this.ctx.lineWidth / 2,this.height - this.ctx.lineWidth / 2);
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = "rgba(0,0,0,1)";
		this.ctx.strokeRect(2, 2,this.width - 3,this.height - 3);
        
        this.DrawImage("lv1", 13 + (this.width/3 - 10),90,this.GetImage("lv1").width,this.GetImage("lv1").height - 90);
        this.DrawImage("lv1", 13 + 2 * (this.width/3 - 10),90,this.GetImage("lv1").width,this.GetImage("lv1").height - 90);
        
        this.DrawImage("lh2", 0, this.getLinePos(7) - this.GetImage("lh2").height / 2);
        
        this.DrawImage("h_box", -5, this.getLinePos(8));
        
        /*this.DrawImageCenter("lh3", 0, this.getLinePos(9), "y");
		this.DrawImageCenter("lh3", 0, this.getLinePos(11), "y");
        this.DrawImageCenter("lh2", 0, this.getLinePos(13), "y");*/
        
        this.InitializeCells();
        /*
        //DEBUG
		for(var i = 0; i < 3; i++){
			for(var j = 1; j < 10; j++){
				multiplier = Math.floor((Math.random() * 3) + 1);
				score = Math.floor((Math.random() * 20) + 0);
				if(Math.floor((Math.random() * 100) + 0) > 95){
					score = 25;
					multiplier = Math.floor((Math.random() * 2) + 1);
				}
				if(j != 4 && j != 8 && j != 9){
					scoreBoard.AddScore(i, score * multiplier, j);
				}else if(j == 4){
					scoreBoard.AddScore(i, scoreBoard.GetHochScore(i), j);
				}else if(j == 8){
					scoreBoard.AddScore(i, scoreBoard.GetTiefScore(i), j);
				}else if(j == 9){
					scoreBoard.AddScore(i, scoreBoard.GetFinalScore(i), j);
				}
                
			}
		}
        
		trophys = [1,2,3];
		for(var i = 0; i < players.length; i++){
			index = Math.floor((Math.random() * trophys.length) + 0);
			trophy = trophys[index];
			trophys.remove(trophys.indexOf(trophy));
			
			this.DrawPrize(i, trophy);
        } */
    }
    
    this.DrawImage = function(imageName, x, y){
        this.ctx.drawImage(this.GetImage(imageName), x, y)
    }
    
    this.DrawImageCenter = function(imageName, x, y, axis){
        var img = this.GetImage(imageName); 
        if(axis == 'y' || axis == 'v' || axis == 0){
            this.ctx.drawImage(img, x, y - (img.height / 2) + 1);
        }else if(axis == 'x' || axis == 'h' || axis == 1){
            this.ctx.drawImage(img, x - (img.width / 2) + 1, y);
        }
    }
    
    this.FindBackgroundLines = function(){
        var icanvas = document.createElement('canvas');
        icanvas.id = "icanvas";
        icanvas.width = 10;
        icanvas.height = 600;
        var ictx = icanvas.getContext('2d');
        var bground = this.GetImage("bground")
        ictx.drawImage(bground,0, 0);
        
        var imgSpacer = 15;
        var imgData = ictx.getImageData(0, imgSpacer, 1, bground.height - imgSpacer*2);
        var rgb = 0;
        var threshold = 200; //pixel gets ignored if rgb sum is below threshold*3
        
        for(var i = 0; i < imgData.data.length; i++){
            if((i%4) != 3){
                rgb += imgData.data[i];
            }else{
                if(rgb <= threshold*3){
                    pos = (i-3)/4 + imgSpacer;
                    this.linePos.push(pos);
                    //console.log("added " + pos + " as linePos\tRGB: " + rgb);
                }
                rgb = 0;
            }
        }
        
        // todo: load table settings telling where to draw the lines
        var settings_tablePos = [7, 9, 11, 13, 16, 18, 20, 22, 25, 29];
        
        settings_tablePos.forEach(line => {
            this.tableLinePos.push(this.getLinePos(line));
        });
    }
    
    this.GetImage = function(imageName){
        var index = this.imageNames.indexOf(imageName);
        return this.images[index];
    }
    
    this.AddScore = function(playerid, score, row){
        this.cells[playerid][row].SetText(score);
        this.cells[playerid][row].UpdateCell(this.ctx);
    }
    
    this.SetFontSize = function(fontsize){
        this.ctx.font = fontsize + "px Comic Sans MS";
    }
    
    this.getLinePos = function(line){
        return this.linePos[line];
    }
    
    this.DrawTrophy = function(playerID, place){
        trophy = this.GetImage("pokal" + place);
		xoffset = 15;
		yoffset = 5;
		this.ctx.drawImage(trophy, this.cells[playerID][0].x + xoffset, this.getLinePos(29) +  yoffset);
    }
    
    // TODO move to own file -> diff. game modes..
    this.GetHochScore = function(playerID){
        hscore = 0;
        for(var row = 1; row < 4; row++){
            hscore += this.cells[playerID][row].value;
        }
        return hscore;
    }
    this.GetTiefScore = function(playerID){
        tscore = 0;
        for(var row = 5; row < 8; row++){
            tscore += this.cells[playerID][row].value;
        }
        return tscore;
    }
    this.GetFinalScore = function(playerID){
        return this.cells[playerID][4].value - this.cells[playerID][8].value;;
    }
    ////////////////////////////////////////
    
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
<*/
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
        this.hScore = 0;
        for(i = 0; i < legsPerMode; i++){
            this.legs[i].forEach(points => {
                this.hScore += points;
            });
        }
        
        return this.hScore;
    }
    this.SumTief = function(){
        this.tScore = 0;
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



/* CELL CLAAS */
function Cell(id, width, height, xPos, yPos, fontsize, color){
    this.cellCanvas = document.createElement('canvas');
	this.cellCanvas.id = "sB" + id + "0";
	this.cellCanvas.width = width;
    this.cellCanvas.height = height;
    this.cellCanvas
	this.ctx = this.cellCanvas.getContext("2d");
	this.ctx.font = fontsize + "px Comic Sans MS";
	this.ctx.fillStyle = color;
	this.x = xPos;
	this.y = yPos;
	this.value = "";
    this.isDrawn = false;
    
    this.UpdateCell = function(context){
        context.drawImage(this.cellCanvas, this.x, this.y);
        this.isDrawn = true;
    }
    this.SetText = function(text){
        this.value = text;
        this.ctx.fillText(text, 0 + (this.cellCanvas.width - this.ctx.measureText(text).width) / 2, this.cellCanvas.height / 2 + 5);
    }
    this.SetFontSize = function(fontsize){
        this.ctx.font = fontsize + "px Comic Sans MS";
        console.log("Font Size changed: " + this.ctx.font);
    }
    this.SetFontColor = function(color){	//input format: "rgba(0-255,0-255,0-255,0-1)"
    this.ctx.fillStyle = color;
}
}




// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


/*function CountImages(){
    scoreBoard.counter--;
    if (scoreBoard.counter === 0){
        scoreBoard.DrawScoreBoard();
    }
}*/



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