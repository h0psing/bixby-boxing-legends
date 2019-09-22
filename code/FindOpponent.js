var console = require("console");
const { buildOpponent } = require("./lib/util.js");
const helperFunctions = require("./lib/helperFunctions");
const commentaryFunctions = require("./lib/commentaryFunctions");
var remoteDB = require('./lib/remoteDB.js');
var dBOperations = require('./lib/dBOperations.js');

exports.function = function(searchTerm, $vivContext) {

  const bixbyUserId = $vivContext.userId;
  var userExists = false;
  let speechOutput;
  let putData;

  var remoteParameters = remoteDB.getUserData(bixbyUserId);
 
  // fetch a new opponent for a new game or game restart
  var opponent = buildOpponent("new");
  //console.log("log: opponent", opponent);

  var computerAttack = helperFunctions.randomAttackGenerator(opponent[0].level);
  console.log("computerAttack: ", computerAttack);

  if (remoteParameters != undefined) {
    opponent = remoteParameters;
    console.log("log: !undefined");
    speechOutput = helperFunctions.getNewGameMessage(computerAttack);
  } else { 
    putData = remoteDB.putUserData(bixbyUserId, opponent);
    console.log("log: undefined");
    speechOutput = helperFunctions.getWelcomeMessage(computerAttack);
  }

  console.log("log: speechOutput: ", speechOutput);
  console.log("log: opponent[0]: ", opponent[0]);
  // setting opponent object to pass through the fight loop
  opponent[0].questions[0].text = speechOutput;
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

  // setting blocks
  opponent[0].questions[0].options[0].text = "block left right left";
  opponent[0].questions[0].options[1].text = blockAnswer;
  opponent[0].questions[0].options[2].text = "block right left right";

  return opponent;
};
