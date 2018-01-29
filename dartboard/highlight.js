function Paint(){
    document.getElementById("title").innerHTML = "Highlight";
    
}

function UnPaint(){
    document.getElementById("title").innerHTML = "";
}



function koordinaten(e) { 
   xpos = (document.layers || (document.getElementById && !document.all)) ? e.pageX : document.body.scrollLeft + event.clientX; 
   ypos = (document.layers || (document.getElementById && !document.all)) ? e.pageY : document.body.scrollTop + event.clientY; 
} 

function werte(){
  score = calculateScore(xpos, ypos);
  txt = "Xpos =" + (xpos - 340) +"; Ypos ="+(355 - ypos) + " | Score: "  + score + "  "; 
}

function calculateScore(xpos, ypos){
   score = 0;
   distance = 0;
   angle = 0;
   multi = 1;
   
   margin_left = 15;
   margin_top = 15;
   
   arrowx = xpos - 340;
   arrowy = 340 - ypos;
   
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

function addScore(){
  if(xpos < 0 || xpos > 700 || ypos < 0 || ypos > 700){
  }else{
    score = calculateScore(xpos, ypos);
    addThrow(score);
    legScore = getLeg();
    document.forms[1].elements[0].value = legScore;
    window.status = legScore;
  }
}