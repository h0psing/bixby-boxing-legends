var console = require("console");
const { buildOpponent } = require("./lib/util.js");
const helperFunctions = require("./lib/helperFunctions");
const commentaryFunctions = require("./lib/commentaryFunctions");
var remoteDB = require('./lib/remoteDB.js');

exports.function = function(quiz, $vivContext) {

  const bixbyUserId = $vivContext.userId;
  var userExists = false;
  console.log("log: bixbyUserId: ", bixbyUserId);
  let $id;
  let level;
  let userPoints;
  let computerPoints;
  let opponentName;

//let opponent; 
  console.log("log: handleWelcome");
  var remoteParameters = remoteDB.getUserData(bixbyUserId)
  console.log("log: handleWelcome: remoteParameters: ", remoteParameters);
  if (remoteParameters != undefined) {
    userExists = true;
    console.log("log: remoteParameters: !undefined");
    //$id = remoteParameters["dbUserId"];
    var remoteOpponent = remoteDB.getUserData(bixbyUserId);
    $id = remoteOpponent["dbUserId"];
    remoteOpponent["dbUserId"] = $id;
    console.log("log: $id: ", $id);
    //remoteOpponent[0].level = "AMATEUR";
    //console.log("log: remoteOpponent: ", remoteOpponent);
    //console.log("log: remoteOpponent[0]: ", remoteOpponent[0]);
    //console.log("log: remoteOpponent: ", remoteOpponent["dbUserId"]);
    //remoteDB.putUserData(bixbyUserId, opponent);
  } else {
      //opponent = buildOpponent("new");
      //remoteDB.putUserData(bixbyUserId, opponent);
      //var remoteParametersFirstTime = remoteDB.getUserData(bixbyUserId);
      //$id = remoteParametersFirstTime["dbUserId"];
      //console.log("log: remoteParameters: undefined");
      //console.log("log: remoteParametersFirstTime: ", remoteParametersFirstTime);
  }

  console.log("start");
  var opponent = buildOpponent("new");
  console.log("aaa");
  console.log("opponent: ", opponent);
  var computerAttack = helperFunctions.randomAttackGenerator(opponent[0].level);
  //opponent[0].textToSpeak  

  // setting welcome message
  let speechOutput;






  /*if (quiz != undefined) {
    console.log("log: quiz !undefined");
    console.log("log: quiz: ", quiz);
    if (quiz.state == "NEW") {
    speechOutput = helperFunctions.getNewGameMessage(computerAttack);
    } else {
      speechOutput = helperFunctions.getWelcomeMessage(computerAttack);
    }

  } else {
     console.log("log: quiz undefined");*/
    speechOutput = helperFunctions.getNewGameMessage(computerAttack);
    
  //}











  console.log("log: speechOutput: ", speechOutput);
  console.log("log: opponent[0]: ", opponent[0]);
  // setting opponent object to pass through the fight loop
  opponent[0].questions[0].text = speechOutput;
  console.log("opponent[0]: ", opponent[0]);
  opponent[0].title = computerAttack;
  opponent[0].state = "BLOCK";
  opponent[0].computerPoints = 30;
  opponent[0].opponentName = helperFunctions.fighterArray[helperFunctions.randomIntFromInterval(0,helperFunctions.fighterArray.length-1)]; 

  var attackArray = computerAttack.split(',');
  console.log("log: attackArray: ", attackArray);
  
  console.log("log: options: ", opponent[0].questions[0].options);
  var blockAnswer = "block ";
  for (i=0; i < attackArray.length; i++) {
    var array = attackArray[i].split(" ");
    console.log("log: array: ", array);
    for (k=0; k < array.length; k++) {
      if (array[k] == "left" || array[k] == "right") {
        blockAnswer = blockAnswer + " " + array[k] + " ";
      }
    }
    
  }

  console.log("log: opponent: ", opponent[0]);

  opponent[0].questions[0].options[0].text = "block left right left";
  opponent[0].questions[0].options[1].text = blockAnswer;
  opponent[0].questions[0].options[2].text = "block left right";
  opponent[0].newGame = false;
  
  return opponent;
};
