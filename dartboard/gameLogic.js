isDebug = true;
if(isDebug){console.log("gameLogic.js loaded!");}

// GAMEMODE VARS
scoreboards = [];
xpos = 0;
ypos = 0;
currentPlayer = 0;
currentPlayerColor = '#0a0';
backgroundColor = '#fff'

var url = document.location.href; // ex .../darts.php#player=clasi,jannowitz,junjuaner;mode=0
var hash = url.substring(url.indexOf('#')+1);
var settings = hash.split(';');


// GAMEMODE (default) SETTINGS
var gameMode = 0;
var names = ["Claasi", "Jannowitz", "Junjuaner"];

loadSettings(settings);

var playsPerLeg = 3;
var legsPerMode = 3;


function loadSettings(settings){
  //localsettings
  names = ["Claasi", "Jannowitz", "Junjuaner"]
  
  settings.forEach(setting => {
    if(setting.substring(0,6) == "player"){
      names = setting.substring(7).split(",");
    } else if(setting.substring(0,4) == "mode"){
      gameMode = parseInt(setting.substring(5));
    }
  });
}



function initGameLogic(){
  scoreboard = new ScoreBoard(names, playsPerLeg, legsPerMode);

  scoreboard.players.forEach(player => {
    document.getElementById("player"+player.id).textContent = player.name;
  });

  if(isDebug){console.log("scoreboard loaded!");}
  currentPlayer = scoreboard.GetPlayerById(scoreboard.GetRandomInt(0, scoreboard.players.length - 1));
  if(isDebug){console.log(currentPlayer.name + " has the power and responsibility to start!");}
  document.getElementById("player" + currentPlayer.id).style.backgroundColor = currentPlayerColor;
  document.getElementById("hoch" + (currentPlayer.legs + 1) + currentPlayer.id).style.backgroundColor = currentPlayerColor;
}


//MOUSE MOVE EVENT
function MouseMove(e) { 
    xpos = (document.layers || (document.getElementById && !document.all)) ? e.pageX : document.body.scrollLeft + event.clientX; 
    ypos = (document.layers || (document.getElementById && !document.all)) ? e.pageY : document.body.scrollTop + event.clientY; 
 }

//MOUSE CLICK EVENT
function MouseClick(){
  UnSelectElements();


  if(xpos < 0 || xpos > 700 || ypos < 0 || ypos > 700){
  }else{
    score = calcScore(xpos, ypos);
    currentPlayer.AddThrow(score);
    

    if(currentPlayer.cLeg.length > 2){
      currentPlayer.legs.push(currentPlayer.cLeg);
      DisplayLeg(currentPlayer.cLeg);
      if(currentPlayer.legs.length == 3){
        document.getElementById("hochS" + currentPlayer.id).textContent = currentPlayer.SumHoch();
      }else if(currentPlayer.legs.length == 6){
        document.getElementById("tiefS" + currentPlayer.id).textContent = currentPlayer.SumTief();
        document.getElementById("finalS" + currentPlayer.id).textContent = currentPlayer.FinalScore();
        if(GameFinished() == true){
          DisplayPrize();
        }
      }
      NextPlayer();
    }else{
      DisplayScore();
    }
  }
}

function NextPlayer(){ 
  legs = currentPlayer.legs.length;
  currentPlayer.cLeg = [];
  document.getElementById("player" + currentPlayer.id).style.backgroundColor = backgroundColor;
  
  if(legs < 4){
    document.getElementById("hoch" + legs + currentPlayer.id).style.backgroundColor = backgroundColor;
  }else{
    document.getElementById("tief" + (legs - 3) + currentPlayer.id).style.backgroundColor = backgroundColor;
  }
  

  currentPlayer = scoreboard.GetNextPlayer(currentPlayer.id);
  
  if(GameFinished() == false){
    document.getElementById("player" + currentPlayer.id).style.backgroundColor = currentPlayerColor;
  }
  legs = currentPlayer.legs.length;
  if(legs < 3){
    console.log("hoch" + legs);
    document.getElementById("hoch" + (legs + 1) + currentPlayer.id).style.backgroundColor = currentPlayerColor;
  }
  if(legs >= 3 && ((legs-2) < 4)){
    console.log("trying to mark: tief" + (legs - 2) + currentPlayer.id);
    document.getElementById("tief" + (legs - 2) + currentPlayer.id).style.backgroundColor = currentPlayerColor;
  }
}

function DisplayScore(){
  legs = currentPlayer.legs.length + 1;
  if(legs < 4){
    document.getElementById("hoch" + legs + currentPlayer.id).textContent = currentPlayer.cLeg.join(" | ");
  }else{
    document.getElementById("tief" + (legs - 3) + currentPlayer.id).textContent = currentPlayer.cLeg.join(" | ");
  }
}

function DisplayLeg(leg){
  legs = currentPlayer.legs.length;
  if(legs < 4){
    document.getElementById("hoch" + legs + currentPlayer.id).textContent = currentPlayer.GetLegScore();
  }else{
    document.getElementById("tief" + (legs - 3) + currentPlayer.id).textContent = currentPlayer.GetLegScore();
  }
}

function DisplayPrize(){
  sortedPlayers = scoreboard.GetPlayersSorted();
  for(i = 0; i < sortedPlayers.length; i++){
    img = document.createElement('img');    
    img.src = 'img/platz' + (i+1) + '.svg';
    img.width = 100;
    //img.height = 150;
    document.getElementById("pokalS" + sortedPlayers[i].id).appendChild(img);
  }
}

function GameFinished(){
  legs = 0;
  scoreboard.players.forEach(player => {
    legs = legs + player.legs.length;
  });
  if(legs == (scoreboard.players.length * legsPerMode * 2)){
    return true;
  }else{
    return false;
  }
}

function UnSelectElements(){
  if (document.querySelectorAll){
    //var all = document.querySelectorAll(".claasName"); TODO (speed)
    var all = document.getElementsByTagName("*");
  }
  else{
    var all = document.getElementsByTagName("*");
  }
  
  for (var i=0, max=all.length; i < max; i++) {
      Deselect(all[i]);
  }
}

function Deselect(element) {
  if (element && /INPUT|TEXTAREA/i.test(element.tagName)) {
    if ('selectionStart' in element) {
      element.selectionEnd = element.selectionStart;
    }
    element.blur();
  }

  if (window.getSelection) { // IE 9+ and all other browsers
    window.getSelection().removeAllRanges();
  } else if (document.selection) { // IE <=8
    document.selection.empty();
  }
}


//CALC SCORE
function calcScore(xpos, ypos){
    score = 0;
    distance = 0;
    angle = 0;
    multi = 1;
    
    margin_left = 15;
    margin_top = 15;
    
    arrowx = xpos - 340;
    arrowy = 415 - ypos;
    
    distance = Math.sqrt(Math.pow(arrowx, 2) + Math.pow(arrowy, 2));
     
    if(distance <= 13){
       score = 50;
    }
    else if(distance <= 26){
       score = 25;
    }
    else if(distance <= 147 && distance > 130){
       multi = 3;
    }
    else if(distance <= 262 && distance > 245){
       multi = 2;
    }
    else if(distance > 262){
       multi = 0;
    }
    
    if(arrowx < 0 || arrowy < 0){
       if(arrowy > 0 && arrowx < 0){
          angle = 90 + Math.atan(-arrowx/arrowy) * 180 / Math.PI;
       }
       else if (arrowy < 0 && arrowx < 0){
          angle = 180 + Math.atan(arrowy/arrowx) * 180 / Math.PI;
       }
       else if (arrowy < 0 && arrowx > 0){
          angle = 270 + Math.atan(arrowx/-arrowy) * 180 / Math.PI;
       }
    }else{
       angle = Math.atan(arrowy/arrowx) * 180 / Math.PI;
    }
     
     
    if(score == 0){
       if(angle > 351 || angle <= 9){
          score = 6;
       }
       else if(angle > 9 && angle <= 27){
         score = 13;
       }
       else if(angle > 27 && angle <= 45){
         score = 4;
       }
       else if(angle > 45 && angle <= 63){
         score = 18;
       }
       else if(angle > 63 && angle <= 81){
         score = 1;
       }
       else if(angle > 81 && angle <= 99){
         score = 20;
       }
       else if(angle > 99 && angle <= 117){
         score = 5;
       }
       else if(angle > 117 && angle <= 135){
         score = 12;
       }
       else if(angle > 135 && angle <= 153){
         score = 9;
       }
       else if(angle > 153 && angle <= 171){
         score = 14;
       }
       else if(angle > 171 && angle <= 189){
         score = 11;
       }
       else if(angle > 189 && angle <= 207){
         score = 8;
       }
       else if(angle > 207 && angle <= 225){
         score = 16;
       }
       else if(angle > 225 && angle <= 243){
         score = 7;
       }
       else if(angle > 243 && angle <= 261){
         score = 19;
       }
       else if(angle > 261 && angle <= 279){
         score = 3;
       }
       else if(angle > 279 && angle <= 297){
         score = 17;
       }
       else if(angle > 297 && angle <= 315){
         score = 2;
       }
       else if(angle > 315 && angle <= 333){
         score = 15;
       }
       else if(angle > 333 && angle <= 351){
         score = 10;
       }
    }
    
    score = score * multi;
    
    return score;
 }






 /* Debug Scores */
/*GetPlayerById(0).DebugLegs();
GetPlayerById(0).SumHoch();
GetPlayerById(0).SumTief();
GetPlayerById(0).FinalScore();*/