function cssChangeReflect(distance , target){
  //apply styling class to that element.
  //innerHTML = distance;
  target.innerHTML = distance;
  target.className = "clicked";

  window.score -= 1;
  window.scoreElement.innerHTML = window.score;

  if (window.score == 0){
      return false;
  }
  return true;
}




function locateAndChange(target){
  /**
  @param target-> td element
  @returns statusCode -> if 200 won ; if 400 chance remaining ; if 404 game lost;
  **/
  var statusCode;
  var clickIndex = [-1, -1];
  clickIndex[0]= target.parentNode.rowIndex;
  clickIndex[1] = target.cellIndex;

  var distance = Math.abs(window.onePos[0] - clickIndex[0]) + Math.abs(window.onePos[1] - clickIndex[1]);

  if (distance == 0){
    statusCode = 200;
  }
  else if (cssChangeReflect(distance , target)){
    statusCode = 400;
  }
  else{ statusCode = 404; }
  return statusCode;

}




function gameEnd(win , target){
  /**
  @param win -> true if won ; false is lost
  @param target -> last Clicked Element before losing or winning
  */

    //dont allow to click on table after game over
    document.getElementById("myTable").removeEventListener("click" , tdClick);

    var retryButton;
    var winElement;//position of tdElement that shelters winning element

    if (win){
      winElement = target;
      var winBanner = document.getElementById("winBanner");
      setTimeout( ()=> { winBanner.style.display = "block"}, 1000 );
      retryButton = document.getElementById( "wonRetry" );
    }

    if (!win){
      winElement = document.getElementsByTagName("tr")[window.onePos[0]].children[window.onePos[1]];
      target.className = "lostRed";
      var loseBanner = document.getElementById("loseBanner");
      setTimeout( ()=> { loseBanner.style.display = "block"}, 1000 );
      retryButton = document.getElementById( "lostRetry" );
    }

    winElement.className ="wonGold"; //display winning element
    window.dirtyTdList.push(winElement);
    retryButton.addEventListener("click", renewCanvas);

}


function renewCanvas(ev){

  ev.target.removeEventListener("click" , renewCanvas);
  document.getElementById("myTable").removeEventListener("click" , tdClick);

  for (var each of window.dirtyTdList){ //clearing css of tdElement
    each.innerHTML = "";
    each.className = "";
  }
  ev.target.parentNode.style.display = "none"; // winBanner or lostBanner
  __main__();

}



function genDomTable(){ //-- ASSERTED ---
    /*
    Called only once to created Table td elements
    */

    var table = document.getElementById("myTable");
    var rows = document.getElementsByClassName("rows")[0];

    for (var i = 0; i < 9; i++ ){
        var cln = rows.cloneNode(true);
        table.appendChild(cln);
      }

  }

  function tdClick(ev){
      var target = ev.target;

      if (target.className == "clicked"){//this means that point was already picked;
        return;
      }


      if (target.nodeName == "TD"){
        window.dirtyTdList.push(target);
        var statusCode = locateAndChange(target);

        if (statusCode == 200){
            gameEnd(true , target);
        }
        else if(statusCode == 404){
            gameEnd(false , target);
        }
        //you won banner
        //remove styling banner
        //remove myTable eventListener
        //call main again

      }

  }



function __main__(){
  const mapDimension = 10;
  var oneX = Math.floor( Math.random()*mapDimension);
  var oneY =  Math.floor( Math.random()*mapDimension);

  var myTable = document.getElementById("myTable");
  var scoreElement = document.getElementById("score");



  myTable.addEventListener("click" , tdClick);
  window.onePos = [oneX , oneY];
  window.score = 4;
  window.scoreElement = scoreElement;
  window.scoreElement.innerHTML = 4;
  window.dirtyTdList = []; //tdElement where winning element lies


}

genDomTable();
__main__();
